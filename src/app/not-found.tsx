import Link from "next/link";
import { Package, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f4f0] dark:bg-[#1e3a33]">
          <Package className="h-10 w-10 text-[#2e8b73]" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-gray-900 dark:text-gray-100">
          404
        </h1>
        <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
          الصفحة غير موجودة
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          عذراً، الرابط الذي تبحث عنه غير متاح
        </p>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95"
          >
            <Home size={16} /> الرئيسية
          </Link>
          <Link
            href="/products"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Search size={16} /> المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
