import { create } from "zustand";
export const useMessageStore = create((set) => ({
  messages: [],
  latestMessage: null,
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      latestMessage: msg,
    })),
  clearLatest: () => set({ latestMessage: null }),
}));
