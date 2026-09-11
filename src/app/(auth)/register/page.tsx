"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const role = String(formData.get("role") || "retailer");

      if (!name || !email || !password) {
        showToast("جميع الحقول مطلوبة", "error");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
        setLoading(false);
        return;
      }

      console.log("🚀 محاولة التسجيل:", { name, email, role });

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });

      console.log("📥 رد Supabase:", { user: data?.user?.id, error });

      if (error) {
        showToast(error.message, "error");
        setLoading(false);
        return;
      }

      if (!data?.user) {
        showToast("لم يتم إنشاء الحساب. قد يكون البريد مستخدمًا مسبقًا.", "error");
        setLoading(false);
        return;
      }

      // If email confirmation required, session is null
      if (!data.session) {
        showToast(
          "تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.",
          "success"
        );
      } else {
        showToast("تم إنشاء حسابك بنجاح!", "success");
      }

      // Always clear loading and redirect
      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      console.error("❌ خطأ في التسجيل:", err);
      showToast(err?.message || "حدث خطأ غير متوقع", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-center mb-6">
            إنشاء حساب جديد
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input name="name" placeholder="الاسم الكامل" required className="h-12" />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" required className="h-12" />
            <Input
              name="password"
              type="password"
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              required
              minLength={6}
              className="h-12"
            />
            <Select name="role" defaultValue="retailer" className="h-12">
              <option value="retailer">تاجر تجزئة</option>
              <option value="wholesaler">تاجر جملة</option>
              <option value="delivery">مندوب توصيل</option>
            </Select>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full bg-[#f59e0b] text-gray-900 hover:bg-[#d97706]"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-gray-500">
            لديك حساب؟{" "}
            <Link href="/login" className="text-primary font-semibold">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
