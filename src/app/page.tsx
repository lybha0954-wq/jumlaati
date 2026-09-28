export const dynamic = "force-dynamic";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ArrowLeft, Sparkles, Store, Truck, Package,
  Wallet, MessageCircle, Zap, BarChart3,
  CheckCircle2, XCircle, Rocket, Shield,
} from "lucide-react";

export default async function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-gray-900">
      <Topbar />

      {/* ══════════════ Hero ══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4f0] via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#2e8b73]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 text-center sm:pt-20">
          {/* شارة قوية */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2e8b73]/20 bg-white px-5 py-2 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2e8b73]" />
            <span className="text-xs font-bold text-[#1e6b57] sm:text-sm">
              🇮🇶 المنصة العراقية الأولى للجملة والتوصيل
            </span>
          </div>

          {/* عنوان رئيسي ضخم */}
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            طوّر تجارتك
            <br />
            <span className="bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] bg-clip-text text-transparent">
              مع جُمْلَتِي
            </span>
          </h1>

          {/* وصف قوي */}
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
            اربط سوبرماركتك بتجار الجملة الأوائل في العراق،
            وتابع كل دينار — <strong className="text-gray-900">من هاتفك، بضغطة واحدة</strong>.
          </p>

          {/* CTA مزدوج قوي */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e8b73] px-8 py-4 text-base font-black text-white shadow-xl shadow-[#2e8b73]/25 hover:bg-[#1e6b57] hover:shadow-2xl active:scale-95 transition-all sm:w-auto"
            >
              <Rocket size={20} />
              ابدأ مجاناً الآن
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 hover:border-[#2e8b73]/40 hover:text-[#1e6b57] active:scale-95 transition-all sm:w-auto"
            >
              اعرف المزيد
            </Link>
          </div>

          {/* وعود صغيرة */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#2e8b73]" />
              بدون بطاقة بنكية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#2e8b73]" />
              بدون التزامات
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#2e8b73]" />
              يعمل على هاتفك
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════ Social Proof ══════════════ */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            أرقامنا تتكلم
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat number="500+" label="سوبرماركت" icon={<Store size={18} />} />
            <Stat number="50+"  label="تاجر جملة" icon={<Package size={18} />} />
            <Stat number="100+" label="مندوب توصيل" icon={<Truck size={18} />} />
            <Stat number="5000+" label="منتج" icon={<Sparkles size={18} />} />
          </div>
        </div>
      </section>

      {/* ══════════════ الميزات ══════════════ */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e8f4f0] px-4 py-1.5">
            <Zap size={14} className="text-[#2e8b73]" />
            <span className="text-xs font-bold text-[#1e6b57]">الميزات</span>
          </div>
          <h2 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
            كل ما تحتاجه — في مكان واحد
          </h2>
          <p className="text-sm text-gray-500 sm:text-base">
            صُمم ليعمل بسرعة، بشكل جميل، وبلغة تفهمها
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FeatureCard
            icon={<Wallet />}
            title="دفتر ديون ذكي"
            desc="تتبّع كل دينار — من استلم، من دفع، من تأخر. لا مزيد من الدفاتر الورقية."
            color="emerald"
          />
          <FeatureCard
            icon={<MessageCircle />}
            title="واتساب مدمج"
            desc="أرسل الطلبات والفواتير عبر واتساب بضغطة واحدة. الرسالة جاهزة تلقائياً."
            color="green"
          />
          <FeatureCard
            icon={<Zap />}
            title="طلب بثلاث ضغطات"
            desc="اختر تاجر الجملة، اكتب الكميات، أرسل. انتهى — الطلب في طريقه إليك."
            color="amber"
          />
          <FeatureCard
            icon={<BarChart3 />}
            title="تقارير فورية"
            desc="اعرف مبيعاتك، أكثر عملائك، وأفضل منتجاتك — مباشرة من هاتفك."
            color="blue"
          />
        </div>
      </section>

      {/* ══════════════ المقارنة ══════════════ */}
      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
              لماذا جُمْلَتِي؟
            </h2>
            <p className="text-sm text-gray-500 sm:text-base">
              قارن بنفسك — الفرق واضح
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* الطريقة القديمة */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">الطريقة القديمة</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                  دفتر ورقي يضيع، ويبلّ، ويمسح
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                  مكالمات هاتفية لتأكيد كل طلب
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                  لا تعرف مَن دفع ومَن تأخر
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                  انتظار ساعات لمعرفة حالة الطلب
                </li>
              </ul>
            </div>

            {/* معنا */}
            <div className="rounded-2xl border-2 border-[#2e8b73]/30 bg-[#e8f4f0]/30 p-6 sm:p-8 shadow-lg shadow-[#2e8b73]/5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e8b73]">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1e6b57]">مع جُمْلَتِي</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
                  دفتر رقمي محفوظ للأبد — لا يضيع
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
                  طلب واحد — بثلاث ضغطات فقط
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
                  تعرف من دفع ومَن تأخر فوراً
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
                  تتبّع مباشر لكل مرحلة — إشعار بكل تحديث
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA أخير ══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-[#2e8b73] to-[#1e6b57]" />
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
            <Shield size={14} />
            <span className="text-xs font-bold">آمن · مجاني · سريع</span>
          </div>

          <h2 className="mb-5 text-3xl font-black tracking-tight sm:text-5xl">
            جاهز للانطلاق؟
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            سجّل الآن — ابدأ باستخدام التطبيق في أقل من دقيقة.
            بدون بطاقة بنكية، بدون التزامات.
          </p>

          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-[#1e6b57] shadow-xl hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Rocket size={20} />
            سجّل الآن — مجاناً
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </Link>

          <p className="mt-6 text-xs text-white/70">
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold text-white underline underline-offset-4 hover:text-white/90">
              سجّل الدخول
            </Link>
          </p>
        </div>
      </section>

      {/* ══════════════ Footer ══════════════ */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2e8b73]">
                <Package size={16} className="text-white" />
              </div>
              <span className="text-sm font-black text-gray-900">جُمْلَتِي</span>
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} جُمْلَتِي — منصة الجملة والتوصيل في العراق
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ══════════════ مكوّنات فرعية ══════════════ */

function Stat({
  number,
  label,
  icon,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2e8b73] shadow-sm">
        {icon}
      </div>
      <div className="text-3xl font-black text-gray-900 sm:text-4xl">{number}</div>
      <div className="mt-1 text-xs font-semibold text-gray-500 sm:text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color = "emerald",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color?: "emerald" | "green" | "amber" | "blue";
}) {
  const colorMap = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  const iconBg = colorMap[color];

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#2e8b73]/30 hover:shadow-xl hover:shadow-[#2e8b73]/5">
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}
