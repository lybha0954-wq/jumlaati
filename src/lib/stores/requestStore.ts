import { create } from "zustand";

interface RequestState {
  pendingRequests: number;
  setPendingRequests: (count: number) => void;
  incrementRequests: () => void;
  decrementRequests: () => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  pendingRequests: 0,
  setPendingRequests: (count) => set({ pendingRequests: count }),
  incrementRequests: () => set((state) => ({ pendingRequests: state.pendingRequests + 1 })),
  decrementRequests: () => set((state) => ({ pendingRequests: Math.max(0, state.pendingRequests - 1) })),
}));
