import { Button } from "@/components/ui/Button";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { Menu, X, Package } from "lucide-react";
import { useState } from "react";

// دالة الهيدر مدمجة هنا حتى لا يبحث Rocket عن ملف خارجي
function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <Package className="h-6 w-6 text-[#f59e0b]" />
          جُمْلَتِي
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">عن المنصة</a>
          <a href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">اتصل بنا</a>
          <a href="/register" className="rounded-lg bg-[#f59e0b] px-4 py-2 text-sm font-bold text-gray-900 hover:bg-[#d97706] transition-all">إنشاء حساب</a>
        </nav>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/10 p-4 space-y-4">
          <a href="/about" className="block text-gray-300 hover:text-white">عن المنصة</a>
          <a href="/contact" className="block text-gray-300 hover:text-white">اتصل بنا</a>
          <a href="/register" className="block rounded-lg bg-[#f59e0b] px-4 py-2 text-center font-bold text-gray-900">إنشاء حساب</a>
        </div>
      )}
    </header>
  );
}

export default async function Home() {
  let products = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <PublicHeader />
      {/* باقي أقسام الصفحة كما هي (Hero, Stats, Features, Footer) */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white py-28 text-center">
         {/* ... ضع هنا بقية كود الصفحة التي أرسلتها سابقاً ... */}
      </section>
    </main>
  );
}
