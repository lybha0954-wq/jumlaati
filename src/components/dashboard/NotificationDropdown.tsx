"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing, CheckCheck, Package, RefreshCw, Info } from "lucide-react";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { formatTimeAgo } from "@/lib/utils/date";

export function NotificationDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const push = usePushNotifications();

  useEffect(() => {
    if (!open) return;
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const escKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", clickOutside);
    document.addEventListener("keydown", escKey);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("keydown", escKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  };

  const handleClick = (n: any) => {
    markAsRead(n.id);
    if (n.order_id) {
      setOpen(false);
      router.push(`/orders/${n.order_id}`);
    }
  };

  const kindIcon = (type?: string) => {
    if (type === "order") return <Package size={13} className="text-[#2e8b73]" />;
    if (type === "status") return <RefreshCw size={13} className="text-blue-500" />;
    return <Info size={13} className="text-gray-400" />;
  };

  const items = notifications.slice(0, 20);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
        aria-label="الإشعارات"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2e8b73] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          dir="rtl"
          className="absolute left-1/2 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:left-auto sm:right-0 sm:translate-x-0"
        >
          {/* ═══ قسم Push ═══ */}
          {push.status !== "unsupported" && push.status !== "denied" && (
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <BellRing size={14} className={push.status === "granted" ? "text-[#2e8b73]" : "text-gray-400"} />
                <p className="text-[11px] font-bold text-gray-700">
                  {push.status === "granted" ? "تنبيهات المتصفح مفعّلة" : "تفعيل تنبيهات المتصفح"}
                </p>
              </div>
              <button
                onClick={push.status === "granted" ? push.unsubscribe : push.subscribe}
                disabled={push.busy}
                className={`rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${
                  push.status === "granted"
                    ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    : "bg-[#2e8b73] text-white hover:bg-[#1e6b57]"
                } disabled:opacity-50`}
              >
                {push.busy ? "..." : push.status === "granted" ? "إيقاف" : "تفعيل"}
              </button>
            </div>
          )}

          {/* ═══ رأس القائمة ═══ */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#e8f4f0] px-2 py-0.5 text-[10px] font-bold text-[#2e8b73]">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-[11px] font-bold text-[#2e8b73] transition-colors hover:text-[#1e6b57]"
              >
                <CheckCheck size={12} /> تعليم الكل
              </button>
            )}
          </div>

          {/* ═══ القائمة ═══ */}
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                <p className="text-xs text-gray-400">لا توجد إشعارات بعد</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((n: any) => {
                  const body = n.body || n.message || "";
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => handleClick(n)}
                        className={`flex w-full gap-3 px-4 py-3 text-right transition-colors hover:bg-gray-50 ${
                          !n.is_read ? "bg-[#f6fbf9]" : ""
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-50">
                          {kindIcon(n.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`truncate text-xs ${!n.is_read ? "font-black text-gray-900" : "font-bold text-gray-700"}`}>
                              {n.title}
                            </p>
                            {!n.is_read && (
                              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2e8b73]" />
                            )}
                          </div>
                          {body && (
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">{body}</p>
                          )}
                          <p className="mt-1 text-[10px] text-gray-400">{formatTimeAgo(n.created_at)}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2 text-center">
              <p className="text-[10px] text-gray-400">آخر {items.length} إشعار</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
