import { create } from "zustand";
import type { Commission } from "@/types/commission";

interface CommissionState {
  commissions: Commission[];
  setCommissions: (commissions: Commission[]) => void;
}

export const useCommissionStore = create<CommissionState>((set) => ({
  commissions: [],
  setCommissions: (commissions) => set({ commissions }),
}));
