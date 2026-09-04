"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";
import { LayoutDashboard, Package, ShoppingCart, Coins, Users, FileText, Settings, Truck, Store, MessageCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const role = useUserStore((state) => state.user?.role) || "retailer";

  const links = [
    { href: "/dashboard/overview", label: "نظرة عامة", icon: LayoutDashboard, roles: ["admin"] },
    { href: "/dashboard/admin/users", label: "المستخدمون", icon: Users, roles: ["admin"] },
    { href: "/dashboard/wholesale/products", label: "المنتجات", icon: Package, roles: ["wholesaler"] },
    { href: "/dashboard/wholesale/orders", label: "الطلبات", icon: ShoppingCart, roles: ["wholesaler"] },
    { href: "/dashboard/wholesale/nearby-requests", label: "طلبات الانضمام", icon: MessageCircle, roles: ["wholesaler"] },
    { href: "/dashboard/retailer/cart", label: "السلة", icon: ShoppingCart, roles: ["retailer"] },
    { href: "/dashboard/retailer/orders", label: "طلباتي", icon: FileText, roles: ["retailer"] },
    { href: "/dashboard/retailer/favorites", label: "المفضلة", icon: Store, roles: ["retailer"] },
    { href: "/dashboard/retailer/points", label: "نقاطي", icon: Coins, roles: ["retailer"] },
    { href: "/dashboard/delivery/tasks", label: "المهام", icon: Truck, roles: ["delivery"] },
    { href: "/dashboard/delivery/my-wholesalers", label: "شركائي", icon: Store, roles: ["delivery"] },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, roles: ["admin", "wholesaler", "retailer", "delivery"] },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="hidden md:flex w-64 flex-col border-l border-gray-200 bg-white h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-black text-gray-900">جُمْلَتِي</h2>
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
