"use client";
import { useNotificationStore } from "@/hooks/useNotification";
import { formatTimeAgo } from "@/lib/utils/date";

export function NotificationCenter() {
  const { notifications, unreadCount } = useNotificationStore();

  return (
    <div className="fixed left-4 top-20 z-50 w-80 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-xl p-4">
      <h3 className="font-bold mb-4 text-lg border-b pb-2">الإشعارات ({unreadCount})</h3>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 py-4">لا توجد إشعارات جديدة</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, idx) => (
            <li key={idx} className="flex gap-3 border-b pb-3 last:border-0">
              <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">{n.message}</p>
                <span className="text-xs text-gray-400">{n.createdAt}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
