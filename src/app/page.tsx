export const dynamic = "force-dynamic";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { Store, Truck, Package, ArrowLeft, Sparkles } from "lucide-react";

export default async function Home() {
  let products: any[] = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-white text-gray-900">
      <Topbar />

      {/* ═══════════ Hero ═══════════ */}
      <section className="relative overflow-hidden">
        {/* تدرّج خلفي هادئ */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4f0] via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[#2e8b73]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          {/* شارة صغيرة */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2e8b73]/20 bg-white px-4 py-1.5 shadow-sm">
            <Sparkles size={14} className="text-[#2e8b73]" />
            <span className="text-xs font-semibold text-[#1e6b57]">
              🇮🇶 منصة عراقية للجملة والتوصيل
            </span>
          </div>

          {/* العنوان */}
          <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl">
            جُمْلَتِي
          </h1>

          {/* الوصف */}
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            نربط السوبرماركت بتجار الجملة ومندوبي التوصيل — بسهولة، بسرعة، بلا وسطاء.
          </p>

          {/* الأزرار */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 hover:bg-[#1e6b57] active:scale-95 transition-all"
            >
              تسوّق الآن
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 hover:border-[#2e8b73]/40 hover:text-[#1e6b57] active:scale-95 transition-all"
            >
              انضم إلينا مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ كيف يعمل ═══════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-black text-gray-900 sm:text-3xl">
            كيف يعمل التطبيق؟
          </h2>
          <p className="text-sm text-gray-500">
            ثلاث خطوات بسيطة — من الطلب إلى التسليم
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FeatureCard
            icon={<Store className="h-6 w-6" />}
            number="1"
            title="سوبرماركت يطلب"
            desc="اختر منتجاتك من عدة تجار جملة، أرسل الطلب بضغطة"
          />
          <FeatureCard
            icon={<Package className="h-6 w-6" />}
            number="2"
            title="جملة يجهّز"
            desc="تاجر الجملة يستلم الطلب، يوافق، ويعيّن مندوب"
          />
          <FeatureCard
            icon={<Truck className="h-6 w-6" />}
            number="3"
            title="مندوب يوصّل"
            desc="المندوب يستلم ويوصل — وإشعار لك في كل مرحلة"
          />
        </div>
      </section>

      {/* ═══════════ المنتجات ═══════════ */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
              أحدث المنتجات
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              مختارات من تجار الجملة
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#2e8b73] hover:text-[#1e6b57]"
          >
            عرض الكل
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm text-gray-500">
              لا توجد منتجات بعد — سجّل كتاجر جملة وأضف أول منتج.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ Footer ═══════════ */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} جُمْلَتِي — منصة الجملة والتوصيل في العراق
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ═══════════ مكوّن فرعي ═══════════ */

function FeatureCard({
  icon,
  number,
  title,
  desc,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#2e8b73]/30 hover:shadow-lg hover:shadow-[#2e8b73]/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73] transition-transform group-hover:scale-110">
          {icon}
        </div>
        <span className="text-3xl font-black text-gray-100 group-hover:text-[#2e8b73]/20 transition-colors">
          {number}
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}
