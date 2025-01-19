import { create } from 'zustand';
import { databases } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';

const useCoinsStore = create((set, get) => ({
  coins: 0,
  documentId: null,
  isLoading: false,
  error: null,

  setCoins: (amount) => set({ coins: amount }),

  initializeCoins: async (user) => {
    set({ isLoading: true, error: null });
    try {
      const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
        Query.equal('userId', user.userId),
      ]);

      if (response.documents.length > 0) {
        const userDocument = response.documents[0];
        set({ coins: userDocument.coins, documentId: userDocument.$id, isLoading: false });
        return userDocument.coins;
      }
    } catch (error) {
      set({ error: 'Failed to initialize coins', isLoading: false });
      console.error('Failed to initialize coins:', error);
    }
  },

  addCoins: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const { coins, documentId } = get();

      const newAmount = coins + amount;
      console.log(documentId);

      // Optimistically update the UI
      set({ coins: newAmount });

      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collectionId, documentId, {
        coins: newAmount,
      });

      set({ isLoading: false });
      return newAmount;
    } catch (error) {
      // Rollback on error
      set({ coins: get().coins - amount, error: 'Failed to add coins', isLoading: false });
      console.error('Failed to add coins:', error);
    }
  },

  spendCoins: async (amount) => {
    const currentCoins = get().coins; // get() is a function to get the current state
    if (currentCoins < amount) return false;

    try {
      const { documentId } = get();

      const newAmount = currentCoins - amount;
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collectionId, documentId, {
        coins: newAmount,
      });
      set({ coins: newAmount });
      return true;
    } catch (error) {
      console.error('Failed to spend coins:', error);
      return false;
    }
  },

  getBalance: async (user) => {
    set({ isLoading: true, error: null });
    try {
      const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
        Query.equal('userId', user.userId),
      ]);
      if (response.documents.length > 0) {
        const userDocument = response.documents[0];
        set({ coins: userDocument.coins, documentId: userDocument.$id, isLoading: false });
        return userDocument.coins;
      }
    } catch (error) {
      set({ error: 'Failed to get balance', isLoading: false });
      console.error('Failed to get balance:', error);
      return 0;
    }
  },
}));

export default useCoinsStore;
