"use client";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

/**
 * useToast — واجهة موحّدة للرسائل المنبثقة
 *
 * API:
 *   const { showToast, closeToast } = useToast();
 *   showToast("تم الحفظ");                 // success
 *   showToast("خطأ", "error");
 *   showToast("معلومة", "info");
 *   closeToast();
 *
 * ✅ الدوال ثابتة (useCallback) — آمنة داخل useEffect
 */
export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.success(message);
  }, []);

  const closeToast = useCallback(() => {
    toast.dismiss();
  }, []);

  return useMemo(() => ({ showToast, closeToast }), [showToast, closeToast]);
}
