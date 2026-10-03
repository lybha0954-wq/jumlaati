"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // تسجيل الخطأ
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-900/40 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-900 dark:text-gray-100">
              حدث خطأ غير متوقع
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              نعتذر عن الإزعاج. جرّب إعادة تحميل الصفحة، أو العودة للصفحة الرئيسية.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95"
              >
                <RotateCcw size={16} /> إعادة التحميل
              </button>
              <a
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Home size={16} /> الرئيسية
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
