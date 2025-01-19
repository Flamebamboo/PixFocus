import { create } from "zustand";

const usePomodoroStore = create((set) => ({
  duration: 25,
  adjustDuration: (newDuration) => set({ duration: newDuration }),
  shortRest: 5,
  adjustShortRest: (newShortRest) => set({ shortRest: newShortRest }),
  longRest: 20,
  adjustLongRest: (newLongRest) => set({ longRest: newLongRest }),
  cycles: 4,
  adjustCycles: (newCycles) => set({ cycles: newCycles }),
  task: "Select Task",
  setTask: (newTask) => set({ task: newTask }),
  color: "red",
  setColor: (newColor) => set({ color: newColor }),
}));

export default usePomodoroStore;
