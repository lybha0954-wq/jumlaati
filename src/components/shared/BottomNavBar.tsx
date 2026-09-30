"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, ShoppingCart, Package, Wallet, Menu, X,
  User, Settings, HelpCircle, LogOut, Bell, MapPin,
  Boxes, UserPlus, Coins, Users, BarChart3, Truck,
  ShoppingBag, FileText, Heart, Store, Ticket, RotateCcw, Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";
import { useAuth } from "@/contexts/AuthContext";

interface Tab {
  key: string;
  href?: string;
  label: string;
  Icon: any;
  action?: "drawer";
}

interface DrawerItem {
  href: string;
  label: string;
  Icon: any;
}

const TABS_BY_ROLE: Record<string, Tab[]> = {
  retailer: [
    { key: "home",   href: "/retailer/overview", label: "الرئيسية", Icon: Home },
    { key: "shop",   href: "/retailer/shop",     label: "تسوّق",    Icon: Store },
    { key: "cart",   href: "/retailer/cart",     label: "السلة",    Icon: ShoppingCart },
    { key: "orders", href: "/retailer/orders",   label: "طلباتي",   Icon: Package },
    { key: "me",     href: "/retailer/settings", label: "حسابي",    Icon: User },
  ],
  supplier: [
    { key: "home",     href: "/wholesale/overview", label: "الرئيسية", Icon: Home },
    { key: "products", href: "/wholesale/products", label: "منتجاتي",  Icon: Package },
    { key: "orders",   href: "/wholesale/orders",   label: "الطلبات",  Icon: ShoppingCart },
    { key: "me",       href: "/wholesale/settings", label: "حسابي",    Icon: User },
    { key: "more",                                   label: "المزيد",   Icon: Menu, action: "drawer" },
  ],
  delivery: [
    { key: "home",     href: "/delivery/overview",       label: "الرئيسية", Icon: Home },
    { key: "tasks",    href: "/delivery/tasks",          label: "مهامي",    Icon: Truck },
    { key: "earnings", href: "/delivery/earnings",       label: "أرباحي",   Icon: Wallet },
    { key: "stores",   href: "/delivery/my-wholesalers", label: "تجاري",    Icon: Store },
    { key: "me",       href: "/delivery/settings",       label: "حسابي",    Icon: User },
  ],
  admin: [
    { key: "home",   href: "/admin/home",     label: "الرئيسية",   Icon: Home },
    { key: "orders", href: "/admin/orders",   label: "الطلبات",    Icon: ShoppingCart },
    { key: "users",  href: "/admin/users",    label: "المستخدمون", Icon: Users },
    { key: "me",     href: "/admin/settings", label: "حسابي",      Icon: User },
    { key: "more",                             label: "المزيد",     Icon: Menu, action: "drawer" },
  ],
};

const DRAWER_BY_ROLE: Record<string, DrawerItem[]> = {
  supplier: [
    { href: "/wholesale/finance", label: "المالية", Icon: Wallet },
  ],
  retailer: [],
  delivery: [],
  admin: [
    { href: "/admin/analytics",  label: "التحليلات",  Icon: BarChart3 },
    { href: "/admin/finance",    label: "المالية",     Icon: Wallet },
    { href: "/admin/audit-logs", label: "سجل النشاط", Icon: FileText },
    { href: "/admin/flags",      label: "الميزات",     Icon: Flag },
  ],
};

/* ═══════════════════════════════════════ */

export function BottomNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { signOut } = useAuth();
  const role = user?.role;
  const hasSidebar = role === "admin" || role === "supplier";
  const wrapperClass = hasSidebar ? "md:hidden" : "";

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (!role) return null;
  const tabs = TABS_BY_ROLE[role] || TABS_BY_ROLE.retailer;
  const drawerItems = DRAWER_BY_ROLE[role] || DRAWER_BY_ROLE.retailer;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
    router.push("/login");
  };

  return (
    <>
      {/* Bottom nav */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.04)] ${hasSidebar ? "md:hidden" : ""}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid h-16 grid-cols-5">
          {tabs.map((tab) => {
            const active =
              tab.href &&
              (pathname === tab.href || pathname.startsWith(tab.href + "/"));
            const Icon = tab.Icon;

            const content = (
              <>
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[#2e8b73]" />
                )}
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  className={cn("transition-transform", active && "scale-110")}
                />
                <span
                  className={cn(
                    "text-[10px] leading-none",
                    active ? "font-bold" : "font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </>
            );

            if (tab.action === "drawer") {
              return (
                <button
                  key={tab.key}
                  onClick={() => setDrawerOpen(true)}
                  className="relative flex flex-col items-center justify-center gap-0.5 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={tab.key}
                href={tab.href!}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 transition-colors",
                  active ? "text-[#2e8b73]" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 z-[70] flex w-72 flex-col bg-white shadow-2xl md:hidden">
            {/* رأس */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2e8b73] text-white">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {user?.name || "المستخدم"}
                  </p>
                  <p className="truncate text-[10px] text-gray-500">
                    {roleLabel(role)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* القائمة */}
            <div className="flex-1 overflow-y-auto p-2">
              {drawerItems.map((item) => {
                const Icon = item.Icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#e8f4f0] text-[#1e6b57] font-bold"
                        : "text-gray-700 hover:bg-[#e8f4f0] hover:text-[#1e6b57]"
                    )}
                  >
                    <span className={active ? "text-[#2e8b73]" : "text-gray-400"}>
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* تذييل */}
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════ */

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    retailer: "سوبرماركت",
    supplier: "تاجر جملة",
    delivery: "مندوب توصيل",
    admin: "مدير",
  };
  return map[role] || role;
}
