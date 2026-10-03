"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useToast } from "@/hooks/useToast";

/**
 * Real-time notifications via Supabase Realtime.
 * بديل عن polling — يسمع إدراج جديد في جدول notifications.
 */
export function useRealtimeNotifications() {
  const { fetchNotifications } = useNotificationStore();
  const { showToast } = useToast();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const channel = supabase
          .channel("notifications-" + user.id)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: "user_id=eq." + user.id,
            },
            (payload: any) => {
              const n = payload?.new;
              if (!n) return;
              // تحديث المخزن
              fetchNotifications();
              // عرض Toast سريع
              if (n.title) {
                showToast(n.title, "info");
              }
            }
          )
          .subscribe();

        channelRef.current = channel;
      } catch {
        // silent — الميزة اختيارية
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        try { channelRef.current.unsubscribe(); } catch {}
      }
    };
  }, [fetchNotifications, showToast]);
}
