"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPrompt() {
  const { canShow, isIOS, promptInstall, dismiss } = useInstallPrompt();
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    if (canShow && isIOS) setShowIOSTip(true);
  }, [canShow, isIOS]);

  if (!canShow) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSTip(true);
      return;
    }
    await promptInstall();
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 left-3 right-3 z-40 mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:bottom-6 md:right-6 md:left-auto md:w-96"
    >
      <button
        onClick={dismiss}
        className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50"
        aria-label="إغلاق"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
          <Smartphone size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-gray-900">ثبّت جُمْلَتِي</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {isIOS
              ? "أضف التطبيق لشاشتك الرئيسية"
              : "استخدم التطبيق كتطبيق حقيقي على جهازك"}
          </p>

          {isIOS && showIOSTip ? (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-900">
              <p className="mb-1 font-bold">للتثبيت على iPhone:</p>
              <ol className="list-inside list-decimal space-y-0.5">
                <li>اضغط زر المشاركة (⎋) في الأسفل</li>
                <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                <li>اضغط "إضافة"</li>
              </ol>
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1e6b57]"
            >
              <Download size={13} /> تثبيت التطبيق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
