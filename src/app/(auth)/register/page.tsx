"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string; // إضافة الهاتف
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: "retailer", phone },
      },
    });

    if (error) return showToast(error.message, "error");

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id, name, email, phone, role: "retailer",
      });
    }

    showToast("تم إنشاء الحساب بنجاح!", "success");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-center mb-6">إنشاء حساب جديد</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="الاسم الكامل" required className="h-12" />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" required className="h-12" />
            <Input name="phone" type="tel" placeholder="رقم الهاتف (مثال: 9647XXXXXXXXX)" required className="h-12" />
            <Input name="password" type="password" placeholder="كلمة المرور" required className="h-12" />
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "جارٍ التسجيل..." : "إنشاء الحساب"}
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-gray-500">
            لديك حساب؟ <Link href="/login" className="text-primary font-semibold">تسجيل الدخول</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
