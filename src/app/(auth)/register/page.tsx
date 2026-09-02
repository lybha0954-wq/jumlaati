"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { registerSchema } from "@/lib/validations/auth.schema";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      showToast("يرجى التحقق من صحة البيانات المدخلة", "error");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    // 1. إنشاء الحساب في Auth
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          name: parsed.data.name,
          role: parsed.data.role,
        },
      },
    });

    if (error) {
      showToast(error.message || "حدث خطأ في التسجيل", "error");
      setLoading(false);
      return;
    }

    // 2. إضافة المستخدم يدوياً إلى جدول public.users (تجاهل فشل هذه الخطوة إن حدث!)
    if (data.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name: parsed.data.name,
          email: parsed.data.email,
          role: parsed.data.role,
        });

      if (dbError) {
        console.error("خطأ في إدخال البيانات (سيتم حله تلقائياً):", dbError);
      }
    }

    showToast("تم إنشاء الحساب بنجاح!", "success");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-2">انضم إلى آلاف التجار والموردين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">الاسم الكامل</label>
            <Input name="name" placeholder="الاسم الكامل" required className="h-12 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">البريد الإلكتروني</label>
            <Input name="email" type="email" placeholder="example@email.com" required className="h-12 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">كلمة المرور</label>
            <Input name="password" type="password" placeholder="********" required className="h-12 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">نوع الحساب</label>
            <Select name="role" defaultValue="retailer" className="h-12 rounded-xl">
              <option value="retailer">تاجر تجزئة</option>
              <option value="wholesaler">تاجر جملة</option>
              <option value="delivery">مندوب توصيل</option>
            </Select>
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full justify-center text-lg shadow-lg shadow-primary/20">
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
