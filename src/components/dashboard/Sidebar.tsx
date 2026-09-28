"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Coins,
  Users,
  FileText,
  Settings,
  Truck,
  Store,
  MessageCircle,
} from "lucide-react";

const ROLE_PREFIX: Record<string, string> = {
  admin: "/admin",
  supplier: "/wholesale",
  retailer: "/retailer",
  delivery: "/delivery",
};

export function Sidebar() {
  const pathname = usePathname();
  const role = useUserStore((s) => s.user?.role) || "retailer";
  const rolePrefix = ROLE_PREFIX[role] || "/retailer";

  const links = [
    // Admin
    { href: "/admin/home", label: "نظرة عامة", icon: LayoutDashboard, roles: ["admin"] },
    { href: "/admin/users", label: "المستخدمون", icon: Users, roles: ["admin"] },
    // Wholesale
    { href: "/wholesale/products", label: "منتجاتي", icon: Package, roles: ["supplier"] },
    { href: "/wholesale/orders", label: "الطلبات", icon: ShoppingCart, roles: ["supplier"] },
    { href: "/wholesale/nearby-requests", label: "طلبات قريبة", icon: MessageCircle, roles: ["supplier"] },
    // Retailer
    { href: "/retailer/cart", label: "السلة", icon: ShoppingCart, roles: ["retailer"] },
    { href: "/retailer/orders", label: "طلباتي", icon: FileText, roles: ["retailer"] },
    { href: "/retailer/favorites", label: "المفضلة", icon: Store, roles: ["retailer"] },
    { href: "/retailer/points", label: "نقاطي", icon: Coins, roles: ["retailer"] },
    // Delivery
    { href: "/delivery/tasks", label: "مهامي", icon: Truck, roles: ["delivery"] },
    { href: "/delivery/my-wholesalers", label: "تجاري", icon: Store, roles: ["delivery"] },
    // All
    { href: "/messages", label: "الرسائل", icon: MessageCircle, roles: ["admin", "supplier", "retailer", "delivery"] },
    { href: `${rolePrefix}/settings`, label: "الإعدادات", icon: Settings, roles: ["admin", "supplier", "retailer", "delivery"] },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="hidden md:flex w-64 flex-col border-l border-gray-200 bg-white h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-black text-gray-900">جملتي</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
