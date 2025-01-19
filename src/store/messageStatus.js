import { create } from "zustand";

const useMessageStore = create((set) => ({
  message: "",
  setMessage: (message) => set({ message }),
}));

export default useMessageStore;
