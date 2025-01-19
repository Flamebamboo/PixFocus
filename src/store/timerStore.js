import { create } from 'zustand';

const useTimerStore = create((set) => ({
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
}));

export default useTimerStore;
