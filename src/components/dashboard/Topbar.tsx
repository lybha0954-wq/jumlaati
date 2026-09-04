"use client";
import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useRealtime } from "@/hooks/useRealtime";
import { Package, Bell, UserCircle } from "lucide-react";

export function Topbar() {
  const user = useUserStore((state) => state.user);
  const { unreadCount, fetchNotifications } = useNotificationStore();

  // الاستماع للتحديثات اللحظية
  useRealtime("notifications", () => {
    fetchNotifications();
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <header className="h-16 sticky top-0 z-40 flex items-center justify-between bg-[#0F172A] px-6 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-[#f59e0b]" />
        <span className="text-xl font-black">جُمْلَتِي</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#f59e0b] text-gray-900 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || "ز"}
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.name || "زائر"}</span>
        </div>
      </div>
    </header>
  );
}
