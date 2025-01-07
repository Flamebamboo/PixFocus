import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

const useTimerStore = create(
  persist(
    (set) => ({
      task: 'Focus Session', // Changed default task
      color: '#4CAF50', // Added default color
      duration: 1800, // 30 minutes default
      setTask: (task) => set({ task }),
      setColor: (color) => set({ color }),
      setDuration: (duration) => set({ duration }),
      resetToDefaults: () =>
        set({
          task: 'Focus Session',
          color: '#4CAF50',
          duration: 1800,
        }),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTimerStore;
