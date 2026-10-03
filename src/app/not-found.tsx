import Link from "next/link";
import { Package, Home, Search, ShoppingCart, Store, HelpCircle } from "lucide-react";

export default function NotFound() {
  const suggestions = [
    { href: "/", icon: Home, label: "الرئيسية", desc: "ابدأ من هنا" },
    { href: "/products", icon: Package, label: "المنتجات", desc: "تصفّح الكل" },
    { href: "/offers", icon: Store, label: "العروض", desc: "أحدث التخفيضات" },
    { href: "/contact", icon: HelpCircle, label: "تواصل معنا", desc: "نحن هنا" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#e8f4f0] dark:bg-[#1e3a33]">
            <Package className="h-12 w-12 text-[#2e8b73]" />
          </div>
          <h1 className="mb-2 text-4xl font-black text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">
            الصفحة غير موجودة
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            لكن يمكنك الذهاب إلى:
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {suggestions.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:-translate-y-1 hover:border-[#2e8b73]/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73] transition-transform group-hover:scale-110 dark:bg-[#1e3a33] dark:text-[#6ecdb0]">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {s.label}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {s.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] hover:shadow-lg active:scale-95"
          >
            <Home size={16} /> العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
