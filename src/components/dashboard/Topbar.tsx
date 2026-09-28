"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/userStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Bell, Search, LogIn, LogOut } from "lucide-react";

export function Topbar() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { signOut } = useAuth();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const refresh = useCallback(() => { fetchNotifications(); }, [fetchNotifications]);

  useRealtime("notifications", () => { refresh(); });
  useEffect(() => { refresh(); }, [refresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("[Topbar] logout error:", err);
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md md:px-6">
      {/* الشعار */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2e8b73]/10">
          <Package className="h-5 w-5 text-[#2e8b73]" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-black tracking-tight text-gray-900">
          جُمْلَتِي
        </span>
      </Link>

      {/* البحث — سطح المكتب فقط */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 px-4 py-2 w-1/3 focus-within:border-[#2e8b73]/40 focus-within:bg-white transition-all"
      >
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
        />
      </form>

      {/* الأزرار */}
      <div className="flex items-center gap-2">
        {user && (
          <button
            onClick={refresh}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="الإشعارات"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2e8b73] px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-gray-100 py-1 pl-3 pr-1 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-700 hidden sm:block">
                {user?.name || user?.email?.split("@")[0] || "المستخدم"}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2e8b73] text-xs font-bold text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              aria-label="خروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#1e6b57] active:scale-95 transition-all"
          >
            <LogIn size={16} />
            <span>دخول</span>
          </Link>
        )}
      </div>
    </header>
  );
}
