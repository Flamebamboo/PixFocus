import { create } from 'zustand';

import { saveUserDesigns, loadUserDesigns } from '@/lib/focusItem';
//mission move to the database
const useTimerVariant = create((set) => ({
  ownedItems: ['1'],
  variant: 'COFFEE_CUP',
  isLoading: false,
  error: null,

  //we use this in focus-design
  purchaseItem: async (item_id, user) => {
    try {
      set({ isLoading: true, error: null });
      await saveUserDesigns(item_id, user);
      set((state) => ({
        ownedItems: [...state.ownedItems, item_id],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  initialize: async (user) => {
    try {
      set({ isLoading: true, error: null });
      const userItems = await loadUserDesigns(user);
      set({
        ownedItems: userItems || ['1'],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        ownedItems: ['1'],
      });
    }
  },
  setVariant: (name) => set({ variant: name }),
}));

// Integrate the Shop with the Database:

// Instead of using hardcoded data in timerVariantStore, fetch the focus designs dynamically from your Appwrite database using getFocusItems.
// Update focus-design.jsx to display the designs fetched from the database.
// Implement Purchase and Ownership Logic:

// Store purchased items in the database, associated with the user's data.
// Update the purchaseItem function in timerVariantStore to reflect ownership status in the database.
// Ensure that the ownership status persists across sessions and devices.

export default useTimerVariant;
