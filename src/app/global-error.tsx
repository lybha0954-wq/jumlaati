"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans">
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="mb-2 text-xl font-black text-gray-900">
              خطأ في النظام
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              نعتذر، حدث خطأ غير متوقع. جرّب إعادة التحميل.
            </p>
            <button
              onClick={reset}
              className="w-full rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
