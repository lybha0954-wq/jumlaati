import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string | number;
  title: string;
  body?: string;
  message?: string;
  type?: string;
  order_id?: number | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      set({
        notifications: data,
        unreadCount: data.filter((n: any) => !n.is_read).length,
      });
    }
  },

  markAsRead: async (id: string | number) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    get().fetchNotifications();
  },

  markAllAsRead: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    get().fetchNotifications();
  },
}));
