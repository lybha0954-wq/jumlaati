export const dynamic = "force-dynamic";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import {
  ArrowLeft, Store, Package, Truck,
  Wallet, MessageCircle, Zap, BarChart3,
} from "lucide-react";

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

      {/* ══════════════ Hero — هادئ وصادق ══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4f0] via-white to-white" />
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#2e8b73]/8 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          {/* شارة تعريفية بسيطة — بلا رموز */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2e8b73]/20 bg-white px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2e8b73]" />
            <span className="text-xs font-semibold text-[#1e6b57]">
              منصة عراقية للجملة والتوصيل
            </span>
          </div>

          {/* العنوان */}
          <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl">
            جُمْلَتِي
          </h1>

          {/* الوصف — صادق، بلا مبالغة */}
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            نُسهّل التواصل بين السوبرماركت وتجار الجملة ومندوبي التوصيل،
            مع دفتر ديون رقمي ومتابعة مباشرة للطلبات — من هاتفك.
          </p>

          {/* الأزرار */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e8b73] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95 sm:w-auto"
            >
              ابدأ الآن مجاناً
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 transition-all hover:border-[#2e8b73]/40 hover:text-[#1e6b57] active:scale-95 sm:w-auto"
            >
              لدي حساب
            </Link>
          </div>

          {/* ملاحظة صغيرة — بلا رموز AI */}
          <p className="mt-6 text-xs text-gray-400">
            بدون بطاقة بنكية · بدون التزامات
          </p>
        </div>
      </section>

      {/* ══════════════ كيف يعمل ══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-black text-gray-900 sm:text-3xl">
            كيف يعمل التطبيق؟
          </h2>
          <p className="text-sm text-gray-500">
            ثلاث خطوات — من الطلب إلى التسليم
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StepCard
            icon={<Store className="h-6 w-6" />}
            number="1"
            title="السوبرماركت يطلب"
            desc="اختر منتجاتك من تجار الجملة، أرسل الطلب بضغطة"
          />
          <StepCard
            icon={<Package className="h-6 w-6" />}
            number="2"
            title="الجملة يجهّز"
            desc="تاجر الجملة يستلم الطلب، يوافق، ويعيّن مندوباً"
          />
          <StepCard
            icon={<Truck className="h-6 w-6" />}
            number="3"
            title="المندوب يوصّل"
            desc="المندوب يستلم ويوصل — مع إشعار في كل مرحلة"
          />
        </div>
      </section>

      {/* ══════════════ الميزات ══════════════ */}
      <section className="bg-gray-50/50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-black text-gray-900 sm:text-3xl">
              ماذا يوفّر لك؟
            </h2>
            <p className="text-sm text-gray-500">
              أدوات عملية للعمل اليومي
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<Wallet className="h-5 w-5" />}
              title="دفتر ديون رقمي"
              desc="تتبّع كل دينار — من استلم، من دفع، ومن تأخّر."
            />
            <FeatureCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="واتساب مدمج"
              desc="أرسل الطلبات والفواتير عبر واتساب بضغطة واحدة."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="طلب سريع"
              desc="اختر تاجر الجملة، اكتب الكميات، أرسل. انتهى."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="تقارير واضحة"
              desc="اعرف مبيعاتك وأفضل منتجاتك — مباشرة من هاتفك."
            />
          </div>
        </div>
      </section>

      {/* ══════════════ المنتجات ══════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
              أحدث المنتجات
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              من تجار الجملة
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#2e8b73] hover:text-[#1e6b57]"
          >
            عرض الكل
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm text-gray-500">
              لا توجد منتجات بعد.
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

      {/* ══════════════ CTA نهائي — هادئ ══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-[#2e8b73]/20 bg-[#e8f4f0]/40 p-10 text-center sm:p-14">
          <h2 className="mb-3 text-2xl font-black text-gray-900 sm:text-3xl">
            جاهز للبدء؟
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
            أنشئ حسابك الآن وابدأ استخدام التطبيق خلال دقيقة.
          </p>

          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95"
          >
            إنشاء حساب
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>

          <p className="mt-6 text-xs text-gray-500">
            لديك حساب؟{" "}
            <Link
              href="/login"
              className="font-bold text-[#2e8b73] underline underline-offset-4 hover:text-[#1e6b57]"
            >
              سجّل الدخول
            </Link>
          </p>
        </div>
      </section>

      {/* ══════════════ Footer ══════════════ */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} جُمْلَتِي — منصة الجملة والتوصيل
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ══════════════ مكونات فرعية ══════════════ */

function StepCard({
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
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#2e8b73]/30 hover:shadow-lg hover:shadow-[#2e8b73]/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73] transition-transform group-hover:scale-110">
          {icon}
        </div>
        <span className="text-3xl font-black text-gray-100 transition-colors group-hover:text-[#2e8b73]/20">
          {number}
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#2e8b73]/30 hover:shadow-md">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="mb-1 text-base font-bold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
