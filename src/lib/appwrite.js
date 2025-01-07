import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ENDPOINT,
  PROJECT_ID,
  DATABASE_ID,
  COLLECTION_ID,
  FOCUS_SESSION_COLLECTION_ID,
  FOCUS_ITEM_COLLECTION_ID,
  USER_PURCHASES_COLLECTION_ID,
} from '@env';
export const appwriteConfig = {
  endpoint: ENDPOINT,
  projectId: PROJECT_ID,
  databaseId: DATABASE_ID,
  collectionId: COLLECTION_ID,
  focusItemCollectionId: FOCUS_ITEM_COLLECTION_ID,
  focusSessionCollectionId: FOCUS_SESSION_COLLECTION_ID,
  userPurchasesCollectionId: USER_PURCHASES_COLLECTION_ID,
};

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

async function createUserDocument(accountData, retryCount = 0) {
  const timestamp = new Date().toISOString();
  const userData = {
    userId: accountData.$id,
    email: accountData.email,
    username: accountData.username || accountData.name, // Prefer username, fallback to name
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      ID.unique(),
      userData
    );
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error);

    // Log the exact data we're trying to send
    console.log('Attempting to create document with data:', JSON.stringify(userData, null, 2));

    if (retryCount < 2) {
      // Try up to 3 times
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return createUserDocument(accountData, retryCount + 1);
    }
    throw error;
  }
}

export async function signIn(emailOrUsername, password) {
  try {
    let email = emailOrUsername;

    // Check if input is username
    if (!emailOrUsername.includes('@')) {
      // Query the database to find user by username
      const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
        Query.equal('username', emailOrUsername),
      ]);

      if (users.documents.length === 0) {
        throw new Error('User not found');
      }

      // Get the email associated with username
      email = users.documents[0].email;
    }

    // Create session with email
    const session = await account.createEmailPasswordSession(email, password);
    const userData = await getCurrentUser();

    await AsyncStorage.setItem('userSession', JSON.stringify(session));
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    return { session, userData };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    let session;
    try {
      session = await account.getSession('current');
    } catch (error) {
      console.log('No valid session');
      return null;
    }

    const currentAccount = await account.get();

    try {
      const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
        Query.equal('userId', currentAccount.$id), //compare the userId field in the database with the current account id
      ]);

      if (!users.documents.length) {
        console.log('No user document found, creating one...');
        const newUser = await createUserDocument(currentAccount);
        return {
          ...newUser,
          accountDetails: currentAccount,
        };
      }

      return {
        ...users.documents[0],
        accountDetails: currentAccount,
      };
    } catch (error) {
      console.error('Database operation error:', error);
      throw error;
    }
  } catch (error) {
    console.error('GetCurrentUser error:', error);
    return null;
  }
}

export async function getUserDetails() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount || !currentAccount.$id) {
      throw new Error('No valid account found');
    }
    return {
      userId: currentAccount.$id,
      email: currentAccount.email,
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}

export async function checkDuplicateEmail(email) {
  try {
    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
      Query.equal('email', email),
    ]);
    return response.documents.length > 0;
  } catch (error) {
    console.error('Error checking duplicate email:', error);
    throw error;
  }
}

export async function checkDuplicateUsername(username) {
  try {
    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
      Query.equal('username', username),
    ]);
    return response.documents.length > 0;
  } catch (error) {
    console.error('Error checking duplicate username:', error);
    throw error;
  }
}

export async function createUser(email, password, username) {
  try {
    // Check for duplicates before creating account
    const [isEmailTaken, isUsernameTaken] = await Promise.all([
      checkDuplicateEmail(email),
      checkDuplicateUsername(username),
    ]);

    if (isEmailTaken) {
      throw new Error('Email is already registered');
    }

    if (isUsernameTaken) {
      throw new Error('Username is already taken');
    }

    // Create the Appwrite account with username
    const newAccount = await account.create(ID.unique(), email, password, username);
    console.log('Account created successfully:', newAccount.$id);

    // Ensure username is passed to createUserDocument
    const accountDataWithUsername = {
      ...newAccount,
      username: username, // Only pass username
    };

    // Create user document with username
    const newUser = await createUserDocument(accountDataWithUsername);
    console.log('User document created successfully');

    // Create session and get complete user data
    const { session, userData } = await signIn(email, password);
    console.log('Session created successfully');

    return {
      user: userData,
      session: session,
    };
  } catch (error) {
    console.error('Create user error:', error);
    if (error.message.includes('Missing required attribute')) {
      console.log('Schema validation error');
    }
    throw error;
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
    // Clear stored session
    await AsyncStorage.multiRemove(['userSession', 'userData']);
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Add new function to check stored session
export async function checkStoredSession() {
  try {
    const storedSession = await AsyncStorage.getItem('userSession');
    const storedUserData = await AsyncStorage.getItem('userData');

    if (storedSession && storedUserData) {
      return {
        session: JSON.parse(storedSession),
        userData: JSON.parse(storedUserData),
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking stored session:', error);
    return null;
  }
}

export async function clearAllAsyncStorage() {
  try {
    console.log('called');
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage data:', error);
  }
}

export { client, account, databases };
