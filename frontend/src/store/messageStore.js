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

  nextMessage: () =>
    set((state) => {
      if (state.messages.length === 0) {
        return { latestMessage: null }; // 메시지가 없으면 초기화
      }
      const msg = state.messages.pop();
      const newMessages = [...state.messages];
      // const next = newMessages.pop(); // 마지막 메시지 꺼내기
      return {
        messages: newMessages,
        latestMessage: msg,
      };
    }),
}));
