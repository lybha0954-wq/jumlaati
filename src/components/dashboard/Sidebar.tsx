"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";
import {
  Home, Package, ShoppingCart, ShoppingBag, Wallet, Users,
  FileText, Settings, Truck, Store, BarChart3, Flag, Ticket, RotateCcw, Headphones, CreditCard, Crown,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

// القائمة الرئيسية + الفرعية لكل دور
const NAV_BY_ROLE: Record<string, NavItem[]> = {
  admin: [
    { href: "/admin/home",       label: "الرئيسية",     Icon: Home },
    { href: "/admin/orders",     label: "الطلبات",      Icon: ShoppingCart },
    { href: "/admin/users",      label: "المستخدمون",   Icon: Users },
    { href: "/admin/analytics",  label: "التحليلات",    Icon: BarChart3 },
    { href: "/admin/finance",    label: "المالية",       Icon: Wallet },
    { href: "/admin/audit-logs", label: "سجل النشاط",   Icon: FileText },
    { href: "/admin/flags",      label: "الميزات",       Icon: Flag },
    { href: "/admin/coupons",    label: "الكوبونات",     Icon: Ticket },
    { href: "/admin/refunds",         label: "المرتجعات",     Icon: RotateCcw },
    { href: "/admin/requests",        label: "الدعم الفني",   Icon: Headphones },
    { href: "/admin/payment-methods", label: "طرق الدفع",     Icon: CreditCard },
    { href: "/admin/subscriptions",   label: "الاشتراكات",    Icon: Crown },
    { href: "/admin/settings",        label: "الإعدادات",     Icon: Settings },
  ],
  supplier: [
    { href: "/wholesale/overview", label: "الرئيسية",        Icon: Home },
    { href: "/wholesale/products", label: "منتجاتي",         Icon: Package },
    { href: "/wholesale/orders",   label: "الطلبات الواردة", Icon: ShoppingCart },
    { href: "/wholesale/finance",       label: "المالية",          Icon: Wallet },
    { href: "/supplier/subscription",   label: "الباقات",          Icon: Crown },
    { href: "/wholesale/settings",      label: "الإعدادات",       Icon: Settings },
  ],
  retailer: [
    { href: "/retailer/overview", label: "الرئيسية", Icon: Home },
    { href: "/retailer/shop",     label: "تسوّق",    Icon: Store },
    { href: "/retailer/cart",     label: "السلة",    Icon: ShoppingBag },
    { href: "/retailer/orders",   label: "طلباتي",   Icon: Package },
    { href: "/retailer/settings", label: "حسابي",    Icon: Settings },
  ],
  delivery: [
    { href: "/delivery/overview",       label: "الرئيسية", Icon: Home },
    { href: "/delivery/tasks",          label: "مهامي",    Icon: Truck },
    { href: "/delivery/earnings",       label: "أرباحي",   Icon: Wallet },
    { href: "/delivery/my-wholesalers", label: "تجاري",    Icon: Store },
    { href: "/delivery/settings",       label: "حسابي",    Icon: Settings },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const role = useUserStore((s) => s.user?.role) || "admin";
  const links = NAV_BY_ROLE[role] || NAV_BY_ROLE.admin;

  return (
    <aside className="hidden md:flex fixed inset-y-0 right-0 w-64 flex-col border-l border-gray-200 bg-white z-30">
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2e8b73]/10">
          <Package className="h-5 w-5 text-[#2e8b73]" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-black text-gray-900">جُمْلَتِي</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.Icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                active
                  ? "bg-[#e8f4f0] text-[#1e6b57]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4 text-center">
        <p className="text-[10px] text-gray-400">جُمْلَتِي — نسخة MVP</p>
      </div>
    </aside>
  );
}
