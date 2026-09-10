"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/userStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useRealtime } from "@/hooks/useRealtime";
import { createClient } from "@/lib/supabase/client";
import { Package, Bell, Search, LogIn, LogOut } from "lucide-react";
import type { User } from "@/types/user";

export function Topbar() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const refresh = useCallback(() => { fetchNotifications(); }, [fetchNotifications]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser((data.user as unknown as User) || null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as unknown as User) || null);
    });
    return () => sub.subscription.unsubscribe();
  }, [setUser]);

  useRealtime("notifications", () => { refresh(); });
  useEffect(() => { refresh(); }, [refresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 sticky top-0 z-40 flex items-center justify-between bg-[#0F172A] px-4 md:px-6 text-white shadow-lg">
      <Link href="/" className="flex items-center gap-3">
        <Package className="h-6 w-6 text-[#f59e0b]" />
        <span className="text-xl font-black">جملتي</span>
      </Link>

      <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-2 w-1/3">
        <Search size={18} className="text-gray-300 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-gray-300 text-white"
        />
      </form>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#f59e0b] text-gray-900 flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
              </div>
              <span className="text-sm font-medium hidden md:block">
                {user?.name || user?.email?.split("@")[0] || "المستخدم"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="خروج"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f59e0b] text-gray-900 hover:bg-[#d97706] font-bold text-sm"
          >
            <LogIn size={18} />
            <span>دخول</span>
          </Link>
        )}
      </div>
    </header>
  );
}
