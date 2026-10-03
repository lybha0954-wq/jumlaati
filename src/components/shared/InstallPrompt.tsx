"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Sparkles } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPrompt() {
  const { canShow, isIOS, promptInstall, dismiss } = useInstallPrompt();
  const [showIOSTip, setShowIOSTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (canShow && isIOS) setShowIOSTip(true);
  }, [canShow, isIOS]);

  if (!canShow || dismissed) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSTip(true);
      return;
    }
    const installed = await promptInstall();
    if (installed) setDismissed(true);
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 left-3 right-3 z-40 mx-auto max-w-md animate-slide-up rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl shadow-black/10 md:bottom-6 md:right-6 md:left-auto md:w-96 dark:border-gray-800 dark:bg-gray-900"
    >
      <button
        onClick={() => { dismiss(); setDismissed(true); }}
        className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800"
        aria-label="إغلاق"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e8b73] to-[#1e6b57] text-white shadow-md">
          <Smartphone size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-wide text-amber-600">
              تطبيق مجاني
            </p>
          </div>
          <p className="mt-0.5 text-sm font-black text-gray-900 dark:text-gray-100">
            ثبّت جُمْلَتِي على جهازك
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            {isIOS
              ? "أضف للشاشة الرئيسية للوصول السريع"
              : "يعمل بلا إنترنت — بدون متجر التطبيقات"}
          </p>

          {isIOS && showIOSTip ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="mb-1.5 font-bold">📱 على iPhone:</p>
              <ol className="space-y-1">
                <li className="flex items-start gap-1.5">
                  <span className="font-black">1.</span>
                  <span>اضغط زر المشاركة <strong>⎋</strong> أسفل الشاشة</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-black">2.</span>
                  <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-black">3.</span>
                  <span>اضغط "إضافة" في الأعلى</span>
                </li>
              </ol>
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] hover:shadow-lg active:scale-95"
            >
              <Download size={13} /> تثبيت التطبيق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
