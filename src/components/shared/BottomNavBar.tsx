"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Heart, User, LayoutDashboard, Users, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";

interface NavLink {
  key: string;
  href: string;
  label: string;
  icon: any;
}

export function BottomNavBar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const role = user?.role;

  // الزائر: قائمة عامة
  if (!user) {
    const guestLinks: NavLink[] = [
      { key: "home", href: "/", label: "الرئيسية", icon: Home },
      { key: "products", href: "/products", label: "المنتجات", icon: Package },
      { key: "offers", href: "/offers", label: "العروض", icon: Heart },
      { key: "login", href: "/login", label: "دخول", icon: User },
    ];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 h-16">
          {guestLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                pathname === link.href ? "text-primary" : "text-gray-500"
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  // روابط حسب الدور
  let roleLinks: NavLink[] = [];

  if (role === "retailer") {
    roleLinks = [
      { key: "home", href: "/", label: "الرئيسية", icon: Home },
      { key: "products", href: "/products", label: "المنتجات", icon: Package },
      { key: "cart", href: "/retailer/cart", label: "السلة", icon: ShoppingCart },
      { key: "orders", href: "/retailer/orders", label: "طلباتي", icon: Truck },
      { key: "dashboard", href: "/retailer/overview", label: "لوحتي", icon: LayoutDashboard },
    ];
  } else if (role === "wholesaler") {
    roleLinks = [
      { key: "dashboard", href: "/wholesale/overview", label: "لوحتي", icon: LayoutDashboard },
      { key: "products", href: "/wholesale/products", label: "منتجاتي", icon: Package },
      { key: "orders", href: "/wholesale/orders", label: "الطلبات", icon: ShoppingCart },
      { key: "messages", href: "/messages", label: "الرسائل", icon: Heart },
    ];
  } else if (role === "delivery") {
    roleLinks = [
      { key: "dashboard", href: "/delivery/overview", label: "لوحتي", icon: LayoutDashboard },
      { key: "tasks", href: "/delivery/tasks", label: "مهامي", icon: Truck },
      { key: "messages", href: "/messages", label: "الرسائل", icon: Heart },
    ];
  } else if (role === "admin") {
    roleLinks = [
      { key: "dashboard", href: "/admin/overview", label: "لوحة", icon: LayoutDashboard },
      { key: "users", href: "/admin/users", label: "المستخدمون", icon: Users },
      { key: "products", href: "/products", label: "المنتجات", icon: Package },
    ];
  }

  const gridCols =
    roleLinks.length === 5 ? "grid-cols-5" :
    roleLinks.length === 4 ? "grid-cols-4" :
    "grid-cols-3";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className={cn("grid h-16", gridCols)}>
        {roleLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
