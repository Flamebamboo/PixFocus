import { Client, Databases, Query, ID } from "react-native-appwrite";
import { appwriteConfig } from "@/lib/appwrite";

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

const databases = new Databases(client);

// using this to save the user's designs, called from timerVariantStore item id is passed

// NOTE there is two collection being used here, the focusItemCollectionId and the userPurchasesCollectionId
// the focusItemCollectionId is used to store the designs that are available in the shop
// the userPurchasesCollectionId is used to store the designs that the user has purchased

//calling from timerVariantStore
export async function saveUserDesigns(designId, user) {
  if (!user?.userId) return null;
  try {
    console.log("User ID:", user.userId);
    // Query the database to find the document associated with the current user's ID
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPurchasesCollectionId,
      ID.unique(),
      {
        user_id: user.userId,
        item_id: designId,
        purchase_date: new Date().toISOString(),
        email: user.email,
      }
    );

    console.log("Created new document:", response);
  } catch (error) {
    console.log("error fuck", error);
  }
}

//calling from timerVariantStore
export async function loadUserDesigns(user) {
  if (!user?.userId) return ["1"];
  try {
    // Query the database to find the document associated with the current user's ID
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userPurchasesCollectionId,
      [Query.equal("user_id", user.userId)]
    );

    return response.documents.map((doc) => doc.item_id); // Ensure item_id is returned as a string
  } catch (error) {
    console.log("error sucks", error);
  }
}

//fetching to display on the shop calling from focus-design

export async function fetchDesigns() {
  try {
    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusItemCollectionId);
    return response.documents;
  } catch (err) {
    console.log("error", err);
  }
}

//pass user details
