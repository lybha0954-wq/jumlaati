"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

const STORAGE_KEY = "jumlati-onboarding-done";

const STEPS = [
  {
    icon: "🏪",
    title: "مرحباً في جُمْلَتِي",
    body: "منصة عراقية تربط السوبرماركت بتجار الجملة ومندوبي التوصيل.",
  },
  {
    icon: "🛒",
    title: "اطلب من هاتفك",
    body: "تصفّح المنتجات، أضف للسلة، وأرسل الطلب بضغطة واحدة.",
  },
  {
    icon: "🚚",
    title: "تابع التوصيل",
    body: "اعرف مكان طلبك لحظة بلحظة — من القبول حتى التسليم.",
  },
  {
    icon: "📱",
    title: "ثبّت التطبيق",
    body: "أضف جُمْلَتِي لشاشتك الرئيسية — يعمل بلا إنترنت.",
  },
];

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) {
        // تأخير الظهور لتجنب التحميل الثقيل
        setTimeout(() => setShow(true), 2000);
      }
    } catch {}
  }, []);

  const close = () => {
    setShow(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
    >
      <div
        className="w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-wide text-amber-600">
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="تخطي"
          >
            <X size={16} />
          </button>
        </div>

        {/* المحتوى */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#e8f4f0] to-white text-4xl shadow-md dark:from-[#1e3a33] dark:to-gray-800">
            {current.icon}
          </div>
          <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-gray-100">
            {current.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {current.body}
          </p>
        </div>

        {/* نقاط التقدم */}
        <div className="mb-6 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-[#2e8b73]" : "w-1.5 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={prev}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowRight size={14} />
              السابق
            </button>
          )}
          <button
            onClick={next}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white shadow-md shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] active:scale-95"
          >
            {isLast ? "ابدأ الآن" : "التالي"}
            {!isLast && <ArrowLeft size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
