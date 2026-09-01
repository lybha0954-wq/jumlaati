"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard/retailer/overview", label: "نظرة عامة" },
    { href: "/dashboard/retailer/orders", label: "الطلبات" },
    { href: "/dashboard/retailer/products", label: "المنتجات" },
    { href: "/dashboard/retailer/favorites", label: "المفضلة" },
    { href: "/dashboard/retailer/settings", label: "الإعدادات" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 right-0 p-4 border-l border-gray-800">
      <h2 className="text-xl font-bold mb-6 px-2">لوحة التحكم</h2>
      <nav className="space-y-2">
        {links?.map((link) => (
          <Link
            key={link?.href}
            href={link?.href}
            className={cn("block px-4 py-2 rounded-md transition-colors", pathname === link?.href ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}
          >
            {link?.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
