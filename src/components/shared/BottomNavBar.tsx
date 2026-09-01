"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNavBar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "الرئيسية", icon: "🏠" },
    { href: "/products", label: "المنتجات", icon: "🛍️" },
    { href: "/cart", label: "السلة", icon: "🛒" },
    { href: "/dashboard/retailer/overview", label: "حسابي", icon: "👤" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg flex justify-around py-2">
      {links?.map((link) => (
        <Link
          key={link?.href}
          href={link?.href}
          className={`flex flex-col items-center text-xs p-2 ${
            pathname === link?.href ? "text-primary font-bold" : "text-gray-500"
          }`}
        >
          <span className="text-xl">{link?.icon}</span>
          {link?.label}
        </Link>
      ))}
    </nav>
  );
}
