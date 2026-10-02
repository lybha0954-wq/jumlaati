import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { createClient } from "@/lib/supabase/server";
import {
  Check, Crown, Sparkles, Building2, Package, Calculator,
  HelpCircle, ArrowLeft, Gift, Rocket, TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

const PACKAGE_ICONS: Record<string, any> = {
  basic: Package,
  pro: Crown,
  business: Building2,
};

const PACKAGE_HIGHLIGHTS: Record<string, string[]> = {
  basic: [
    "إدارة المنتجات والمخزون",
    "استقبال الطلبات",
    "تأكيد التسليم",
    "إشعارات فورية",
  ],
  pro: [
    "كل ما في الأساسية",
    "بدون أي عمولة على الطلبات",
    "تقارير مبيعات مفصلة",
    "دعم أولوية",
  ],
  business: [
    "كل ما في الاحترافية",
    "تقارير متقدمة",
    "نشر العروض",
    "إشعارات يدوية للعملاء",
    "دعم مخصص",
  ],
};

const FAQ = [
  {
    q: "هل التطبيق مجاني؟",
    a: "نعم — السوبرماركت والمندوب مجانيان بالكامل. تاجر الجملة يختار: إما 1% عمولة على كل طلب، أو اشتراك شهري بدون عمولة.",
  },
  {
    q: "ما هو عرض الإطلاق؟",
    a: "أول 3 أشهر مجاناً لجميع التجار. جرّب التطبيق كامل بدون أي التزام.",
  },
  {
    q: "كيف أختار بين العمولة والاشتراك؟",
    a: "إذا كان متوسط طلباتك الشهرية أقل من 4 طلبات بقيمة 50,000 د.ع — العمولة أوفر. إذا كنت تبيع أكثر، الاشتراك يوفّر أكثر.",
  },
  {
    q: "ما هي طرق الدفع المتاحة؟",
    a: "حالياً: الدفع عند الاستلام، والحوالة البنكية. قريباً: زين كاش، فاست باي، FIB.",
  },
  {
    q: "هل يمكنني إلغاء الاشتراك؟",
    a: "نعم، في أي وقت. تستمر حتى نهاية الفترة المدفوعة، ثم يعود حسابك للباقة الأساسية.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("key, name, description, price_iqd, period_days, feature_keys, is_recommended")
    .eq("enabled", true)
    .order("sort_order");

  const plansList = plans || [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      <Topbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ═══ Hero ═══ */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2e8b73]/20 bg-[#e8f4f0] px-4 py-1.5 text-xs font-bold text-[#1e6b57] dark:border-[#2e8b73]/30 dark:bg-[#1e3a33] dark:text-[#6ecdb0]">
            <Sparkles size={12} />
            عرض الإطلاق — 3 أشهر مجاناً
          </div>
          <h1 className="mb-3 text-3xl font-black text-gray-900 dark:text-gray-100 sm:text-4xl">
            باقات تناسب كل تاجر
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            ابدأ مجاناً، ثم اختر ما يناسب حجم تجارتك — بدون رسوم خفية،
            وبدون التزام طويل.
          </p>
        </div>

        {/* ═══ Banner عرض الإطلاق ═══ */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-l from-amber-50 via-white to-amber-50 shadow-md dark:border-amber-900/40 dark:from-amber-950/40 dark:via-gray-900 dark:to-amber-950/40">
          <div className="flex flex-wrap items-center gap-4 p-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
              <Gift size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                عرض خاص للإطلاق
              </p>
              <p className="mt-0.5 text-lg font-black text-gray-900 dark:text-gray-100">
                أول 3 أشهر مجاناً لجميع التجار
              </p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                جرّب التطبيق كاملاً بدون التزام
              </p>
            </div>
            <Rocket size={28} className="flex-shrink-0 text-amber-500" />
          </div>
        </div>

        {/* ═══ الباقات ═══ */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plansList.map((plan: any) => {
            const Icon = PACKAGE_ICONS[plan.key] || Package;
            const highlights = PACKAGE_HIGHLIGHTS[plan.key] || [];
            const isRecommended = plan.is_recommended;
            const isFree = plan.price_iqd === 0;

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 ${
                  isRecommended
                    ? "border-[#2e8b73] shadow-lg shadow-[#2e8b73]/10"
                    : "border-gray-100 dark:border-gray-800"
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2e8b73] px-4 py-1 text-[10px] font-black text-white shadow-md">
                    ⭐ الأكثر اختياراً
                  </div>
                )}

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        isRecommended
                          ? "bg-[#2e8b73] text-white"
                          : "bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33] dark:text-[#6ecdb0]"
                      }`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </div>
                  </div>
                </div>

                <h3 className="mb-1 text-lg font-black text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                )}

                <div className="mb-5 border-y border-gray-100 py-4 dark:border-gray-800">
                  {isFree ? (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        مجاناً
                      </p>
                      <p className="text-xs text-gray-400">للأبد</p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                        {Number(plan.price_iqd).toLocaleString("ar-IQ")}
                      </p>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        د.ع / شهر
                      </p>
                    </div>
                  )}
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-[#2e8b73]"
                        strokeWidth={3}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-95 ${
                    isRecommended
                      ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/25 hover:bg-[#1e6b57]"
                      : "border-2 border-[#2e8b73] bg-white text-[#2e8b73] hover:bg-[#e8f4f0] dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                  }`}
                >
                  {isFree ? "ابدأ مجاناً" : "اشترك الآن"}
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* ═══ حاسبة break-even ═══ */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-5 dark:border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Calculator size={22} />
              <div>
                <h2 className="text-base font-black">أيهما أوفر لك؟</h2>
                <p className="text-xs text-white/80">
                  قارن بين العمولة والاشتراك
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <TrendingUp size={11} />
                  بدون اشتراك
                </div>
                <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                  تدفع <strong className="text-amber-700 dark:text-amber-400">1%</strong> على
                  كل طلب. مناسب للبدأ أو للطلبات القليلة.
                </p>
                <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                  مثال: 10 طلبات بقيمة 50,000 د.ع = <strong>5,000 د.ع عمولة</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0]/60 p-4 dark:border-[#2e8b73]/30 dark:bg-[#1e3a33]/60">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#2e8b73] px-2.5 py-1 text-[10px] font-black text-white">
                  <Crown size={11} />
                  اشتراك شهري
                </div>
                <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                  <strong className="text-[#1e6b57] dark:text-[#6ecdb0]">15,000 د.ع/شهر</strong> ثابتة — بدون أي عمولة.
                  مناسب للتجار النشطين.
                </p>
                <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                  إذا تجاوزت مبيعاتك 1,500,000 د.ع شهرياً — الاشتراك يوفّر لك.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FAQ ═══ */}
        <div className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-gray-900 dark:text-gray-100">
            <HelpCircle size={20} className="text-[#2e8b73]" />
            أسئلة شائعة
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-[#2e8b73]/30 dark:border-gray-800 dark:bg-gray-900"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                  {item.q}
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#e8f4f0] text-[#2e8b73] transition-transform group-open:rotate-180 dark:bg-[#1e3a33] dark:text-[#6ecdb0]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-gray-100 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ═══ CTA نهائي ═══ */}
        <div className="rounded-3xl border border-[#2e8b73]/20 bg-gradient-to-l from-[#e8f4f0] to-white p-8 text-center dark:border-[#2e8b73]/30 dark:from-[#1e3a33] dark:to-gray-900">
          <h2 className="mb-3 text-2xl font-black text-gray-900 dark:text-gray-100">
            جاهز للبدء؟
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
            انطلق مع عرض الإطلاق — 3 أشهر مجاناً بدون التزام
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] hover:shadow-xl active:scale-95"
            >
              ابدأ الآن
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e8b73] bg-white px-6 py-3 text-sm font-bold text-[#2e8b73] transition-all hover:bg-[#e8f4f0] dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
            >
              تصفّح المنتجات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
