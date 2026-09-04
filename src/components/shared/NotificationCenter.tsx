"use client";
import { useEffect } from "react";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useRealtime } from "@/hooks/useRealtime";
import { formatTimeAgo } from "@/lib/utils/date";

export function NotificationCenter() {
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();

  // تحديث عند الاستماع لقاعدة البيانات
  useRealtime("notifications", () => {
    fetchNotifications();
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="fixed left-4 top-20 z-50 w-80 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-xl p-4">
      <h3 className="font-bold mb-4 text-lg border-b pb-2">الإشعارات ({unreadCount})</h3>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 py-4">لا توجد إشعارات جديدة</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id} className="flex gap-3 border-b pb-3 last:border-0">
              <div className={`h-2 w-2 mt-2 rounded-full ${n.is_read ? "bg-gray-300" : "bg-blue-500"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>
                <span className="text-xs text-gray-400">{formatTimeAgo(n.created_at)}</span>
                {!n.is_read && (
                  <button onClick={() => markAsRead(n.id)} className="text-xs text-primary hover:underline block mt-1">
                    تحديد كمقروء
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
