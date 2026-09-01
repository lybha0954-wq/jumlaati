"use client";
import { create } from "zustand";

interface NotificationState {
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  addNotification: (notification: any) => void;
  unreadCount: number;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1 
  })),
}));
