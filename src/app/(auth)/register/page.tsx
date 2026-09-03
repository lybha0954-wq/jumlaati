"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role: "retailer" } },
    });

    if (error) return showToast(error.message, "error");

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id, name, email, role: "retailer",
      });
    }

    showToast("تم إنشاء الحساب بنجاح!", "success");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-center mb-6">إنشاء حساب جديد</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input name="name" placeholder="الاسم الكامل" required className="h-12 rounded-xl" />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" required className="h-12 rounded-xl" />
            <Input name="password" type="password" placeholder="كلمة المرور" required className="h-12 rounded-xl" />
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
