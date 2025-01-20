import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCoinsStore from './coinsStore';
import { saveUserDesigns, loadUserDesigns } from '@/lib/focusItem';

const useTimerVariant = create(
  persist(
    (set) => ({
      ownedItems: ['1'],
      variant: 'COFFEE_CUP',
      isLoading: false,
      error: null,

      //we use this in focus-design
      purchaseItem: async (item_id, user, price) => {
        try {
          set({ isLoading: true, error: null });

          // Get spendCoins from coinsStore
          const { spendCoins } = useCoinsStore.getState();

          // Attempt to spend coins first
          const purchaseSuccessful = await spendCoins(price, user);

          if (!purchaseSuccessful) {
            set({
              error: 'Not enough coins to purchase this item',
              isLoading: false,
            });
            return false;
          }

          // If payment successful, save the design
          await saveUserDesigns(item_id, user);
          set((state) => ({
            ownedItems: [...state.ownedItems, item_id],
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
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
    }),
    {
      name: 'timer-variant-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ variant: state.variant }), // Only persist the variant
    }
  )
);

export default useTimerVariant;
