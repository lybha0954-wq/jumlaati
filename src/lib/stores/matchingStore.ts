import { create } from "zustand";

interface MatchRequest {
  id: string;
  retailerId: string;
  wholesalerId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface MatchingState {
  matches: MatchRequest[];
  setMatches: (matches: MatchRequest[]) => void;
  addMatch: (match: MatchRequest) => void;
}

export const useMatchingStore = create<MatchingState>((set) => ({
  matches: [],
  setMatches: (matches) => set({ matches }),
  addMatch: (match) => set((state) => ({ matches: [match, ...state.matches] })),
}));
