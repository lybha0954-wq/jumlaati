"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart, User } from "lucide-react";

export function BottomNavBar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/products", label: "المنتجات", icon: Store },
    { href: "/cart", label: "السلة", icon: ShoppingCart },
    { href: "/dashboard/retailer/overview", label: "حسابي", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg flex justify-around py-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center text-xs p-2 ${
            pathname === link.href ? "text-[#f59e0b] font-bold" : "text-gray-500"
          }`}
        >
          <link.icon size={20} className="mb-1" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
