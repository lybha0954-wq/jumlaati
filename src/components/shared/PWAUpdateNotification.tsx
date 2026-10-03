"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

export function PWAUpdateNotification() {
  const [show, setShow] = useState(false);
  const [waitingSW, setWaitingSW] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let reg: ServiceWorkerRegistration | null = null;

    const checkUpdate = async () => {
      try {
        reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

        // نسخة جديدة بانتظار التفعيل
        if (reg.waiting) {
          setWaitingSW(reg.waiting);
          setShow(true);
        }

        // مراقبة التحديثات القادمة
        reg.addEventListener("updatefound", () => {
          const newWorker = reg!.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingSW(newWorker);
              setShow(true);
            }
          });
        });
      } catch {
        // silent
      }
    };

    checkUpdate();

    return () => {
      reg = null;
    };
  }, []);

  if (!show) return null;

  const handleUpdate = () => {
    if (waitingSW) {
      waitingSW.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 left-3 right-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#2e8b73]/30 bg-gradient-to-l from-[#e8f4f0] to-white p-3 shadow-2xl md:bottom-6 md:right-6 md:left-auto md:w-96 dark:border-[#2e8b73]/40 dark:from-[#1e3a33] dark:to-gray-900"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2e8b73] text-white">
        <RefreshCw size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-gray-900 dark:text-gray-100">
          تحديث جديد متاح
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          اضغط للتحميل — يستغرق ثانيتين
        </p>
      </div>
      <button
        onClick={handleUpdate}
        className="flex-shrink-0 rounded-full bg-[#2e8b73] px-3 py-2 text-[10px] font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95"
      >
        تحديث
      </button>
      <button
        onClick={() => setShow(false)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="إغلاق"
      >
        <X size={12} />
      </button>
    </div>
  );
}
