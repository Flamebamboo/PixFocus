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

import { saveLogin } from '@/utils/userSessions';

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

async function createUserDocument(accountData, retryCount = 0) {
  const timestamp = new Date().toISOString();
  const userData = {
    userId: accountData.$id,
    email: accountData.email,
    username: accountData.name,
    createdAt: timestamp,
    updatedAt: timestamp,
    coins: 0,
    leaderboard: false,
  };

  try {
    const userDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      ID.unique(),
      userData
    );

    // auto purchase the first item
    await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userPurchasesCollectionId, ID.unique(), {
      user_id: accountData.$id,
      item_id: '1',
      purchase_date: timestamp,
      email: accountData.email,
    });

    return userDoc;
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error);

    if (retryCount < 2) {
      // Try up to 3 times
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return createUserDocument(accountData, retryCount + 1);
    }
    throw error;
  }
}

export async function signIn(emailOrUsername, password, setUser) {
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
    await account.createEmailPasswordSession(email, password);
    saveLogin(email, password);

    const userData = await getUserDetails();
    if (userData) {
      setUser(userData);
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function checkExistingSession() {
  try {
    const currentAccount = await account.get();

    return { isValid: true };
  } catch (error) {
    return { isValid: false };
  }
}

export async function getUserDetails() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error('No valid account found');
    }

    // find the user document by the auth ID to retrieve its internal $id
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      [ Query.equal('userId', currentAccount.$id) ]
    );
    const userDoc = res.documents[0];
    if (!userDoc) {
      throw new Error('User record not found');
    }

    // combine auth and document data
    return {
      userId: currentAccount.$id,     // auth user ID
      docId: userDoc.$id,             // Appwrite document ID
      email: currentAccount.email,
      username: currentAccount.name,
      leaderboard: userDoc.leaderboard,
      coins: userDoc.coins,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  } catch (error) {
    if (error.code === 401) {
      console.debug('User not logged in, returning null');
      return null;
    }
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

export async function createUser(email, password, name, setUser) {
  try {
    // Check for duplicates before creating account
    const [isEmailTaken, isUsernameTaken] = await Promise.all([
      checkDuplicateEmail(email),
      checkDuplicateUsername(name),
    ]);

    if (isEmailTaken) {
      throw new Error('Email is already registered');
    }

    if (isUsernameTaken) {
      throw new Error('Username is already taken');
    }

    // Create the Appwrite account
    const newAccount = await account.create(ID.unique(), email, password, name);
    console.log(newAccount);
    await createUserDocument(newAccount);
    console.log('User document created successfully');

    // Create session and get complete user data
    await signIn(email, password, setUser);
    console.log('Create User Session created successfully ');
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
    const session = await account.getSession('current');
    if (session) {
      await account.deleteSession('current');
      await clearAllAsyncStorage();
      console.log('Signed out successfully');
    } else {
      console.log('No active session found');
    }
  } catch (error) {
    if (error.message.includes('missing scope (account)')) {
      console.log('User is already signed out or session is invalid');
    } else {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

export async function resetPassword(email) {
  try {
    // Check if the email exists in the database
    const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
      Query.equal('email', email),
    ]);

    if (users.documents.length === 0) {
      throw new Error('Email not found');
    }

    // Create password recovery
    const recovery = await account.createRecovery(email, 'http://pixfocus.app/reset-password');
    return recovery;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function clearAllAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage data:', error);
  }
}

export { client, account, databases };
