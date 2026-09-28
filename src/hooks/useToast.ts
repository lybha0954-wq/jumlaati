"use client";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

/**
 * useToast — واجهة موحّدة للرسائل المنبثقة
 *
 * API متوافق مع الإصدار السابق (Zustand store محذوف):
 *   const { showToast, closeToast } = useToast();
 *   showToast("تم الحفظ");                 // success (افتراضي)
 *   showToast("خطأ", "error");
 *   showToast("معلومة", "info");
 *   closeToast();                          // إخفاء كل الرسائل
 *
 * داخلياً يستخدم sonner المُثبّت في layout.tsx
 */
export function useToast() {
  const showToast = (message: string, type: ToastType = "success") => {
    if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.success(message);
  };

  const closeToast = () => {
    toast.dismiss();
  };

  return { showToast, closeToast };
}
