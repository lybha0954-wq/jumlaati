"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Package } from "lucide-react";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <Package className="h-6 w-6 text-[#f59e0b]" />
          جُمْلَتِي
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">عن المنصة</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">اتصل بنا</Link>
          <Link href="/register" className="rounded-lg bg-[#f59e0b] px-4 py-2 text-sm font-bold text-gray-900 hover:bg-[#d97706] transition-all">إنشاء حساب</Link>
        </nav>

        {/* زر القائمة للجوال */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* قائمة الجوال */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/10 p-4 space-y-4">
          <Link href="/about" className="block text-gray-300 hover:text-white">عن المنصة</Link>
          <Link href="/contact" className="block text-gray-300 hover:text-white">اتصل بنا</Link>
          <Link href="/register" className="block rounded-lg bg-[#f59e0b] px-4 py-2 text-center font-bold text-gray-900">إنشاء حساب</Link>
        </div>
      )}
    </header>
  );
}
