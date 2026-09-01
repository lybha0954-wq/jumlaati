"use client";
import { create } from "zustand";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "info";
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  showToast: (message, type = "success") => set({ isOpen: true, message, type }),
  closeToast: () => set({ isOpen: false }),
}));

export function useToast() {
  const { showToast, closeToast } = useToastStore();
  return { showToast, closeToast };
}
