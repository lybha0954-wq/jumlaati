"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavBar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/products", label: "المنتجات", icon: Store },
    { href: "/offers", label: "العروض", icon: MessageCircle },
    { href: "/cart", label: "السلة", icon: ShoppingCart },
    { href: "/dashboard/retailer/overview", label: "حسابي", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg flex justify-around py-2 pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center text-xs p-2 transition-all",
              isActive ? "text-[#f59e0b] font-bold scale-105" : "text-gray-500"
            )}
          >
            <link.icon size={22} className="mb-1" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
