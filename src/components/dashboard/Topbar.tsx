"use client";

import { useEffect, useState, useCallback } from "react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/userStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

import { Package, Search, LogIn, LogOut, ArrowRight, X, Bell, Sun, Moon } from "lucide-react";
import dynamic from "next/dynamic";

// ═══ تحميل مؤجَّل — يُحمَّل فقط عند فتح قائمة الإشعارات ═══
const NotificationDropdown = dynamic(
  () => import("./NotificationDropdown").then((m) => m.NotificationDropdown),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400">
        <Bell size={18} />
      </div>
    ),
  }
);

const SETTINGS_BY_ROLE: Record<string, string> = {
  admin: "/admin/settings",
  supplier: "/wholesale/settings",
  retailer: "/retailer/settings",
  delivery: "/delivery/settings",
};

// نقاط البداية (لا يظهر عندها زر الرجوع)
const ROOT_PATHS = [
  "/admin/home",
  "/wholesale/overview",
  "/retailer/overview",
  "/delivery/overview",
  "/",
];

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { signOut } = useAuth();
  const { fetchNotifications } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggle, mounted } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const refresh = useCallback(() => { fetchNotifications(); }, [fetchNotifications]);
  useRealtime("notifications", () => { refresh(); });
  useRealtimeNotifications();
  useEffect(() => { refresh(); }, [refresh]);

  // إغلاق البحث عند تغيير الصفحة
  useEffect(() => { setSearchOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    try { await signOut(); } catch (err) { console.error(err); }
    router.push("/login");
    router.refresh();
  };

  const isRoot = ROOT_PATHS.includes(pathname);
  const settingsHref = user?.role ? (SETTINGS_BY_ROLE[user.role] || "/") : "/";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-2 border-b border-gray-100 bg-white/95 px-3 backdrop-blur-md md:px-6">
      {/* يسار: زر رجوع أو شعار */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {!isRoot && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#2e8b73]"
            aria-label="رجوع"
          >
            <ArrowRight size={18} />
          </button>
        )}

        <Link href="/" prefetch={false} className="flex items-center gap-2">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#2e8b73]/10">
            <Package className="h-5 w-5 text-[#2e8b73]" strokeWidth={2.5} />
          </div>
          <span className="hidden text-lg font-black tracking-tight text-gray-900 sm:inline">
            جُمْلَتِي
          </span>
        </Link>
      </div>

      {/* وسط: بحث للشاشات الكبيرة */}
      <form onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 w-1/3 transition-all focus-within:border-[#2e8b73]/40 focus-within:bg-white">
        <Search size={16} className="text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
      </form>

      {/* يمين: أزرار */}
      <div className="flex items-center gap-1">
        {/* زر بحث للجوال */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 md:hidden"
          aria-label="بحث"
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
          title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
        >
          {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
        </button>

        {user && <NotificationDropdown />}

        {user ? (
          <div className="flex items-center gap-1">
            <Link href={settingsHref} prefetch={false}
              className="flex items-center gap-2 rounded-full border border-gray-100 py-1 pl-2 pr-1 transition-colors hover:bg-gray-50 sm:pl-3">
              <span className="hidden max-w-[80px] truncate text-xs font-medium text-gray-700 lg:block">
                {user?.name || user?.email?.split("@")[0] || "المستخدم"}
              </span>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2e8b73] text-xs font-bold text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
              </div>
            </Link>
            <button onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              aria-label="خروج">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link href="/login" prefetch={false}
            className="flex items-center gap-1.5 rounded-full bg-[#2e8b73] px-3 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1e6b57] active:scale-95 sm:px-4">
            <LogIn size={16} />
            <span className="hidden sm:inline">دخول</span>
          </Link>
        )}
      </div>

      {/* شريط البحث الممتد للجوال */}
      {searchOpen && (
        <form onSubmit={handleSearch}
          className="absolute left-0 right-0 top-16 border-b border-gray-100 bg-white p-3 shadow-md md:hidden">
          <div className="flex items-center gap-2 rounded-full border border-[#2e8b73]/40 bg-white px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input autoFocus type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </form>
      )}
    </header>
  );
}
