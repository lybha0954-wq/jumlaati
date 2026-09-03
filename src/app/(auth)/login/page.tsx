"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email, password, options: { persistSession: rememberMe },
    });

    if (error) return showToast(error.message, "error");
    
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role || "retailer";
    let dashboardPath = "/dashboard/retailer/overview";
    if (role === "admin") dashboardPath = "/dashboard/admin/overview";
    else if (role === "wholesaler") dashboardPath = "/dashboard/wholesale/overview";
    else if (role === "delivery") dashboardPath = "/dashboard/delivery/overview";

    showToast("تم تسجيل الدخول بنجاح!", "success");
    router.push(dashboardPath);
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return showToast("أدخل بريدك", "error");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) return showToast("خطأ في الإرسال", "error");
    showToast("تم إرسال رابط الاستعادة!", "success");
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-center mb-6">مرحباً بعودتك 👋</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input name="email" type="email" placeholder="البريد الإلكتروني" required className="h-12 rounded-xl" />
            <Input name="password" type="password" placeholder="كلمة المرور" required className="h-12 rounded-xl" />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-primary h-4 w-4" />
                تذكرني
              </label>
              <button type="button" onClick={() => setShowForgot(!showForgot)} className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</button>
            </div>
            {showForgot && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
                <Input type="email" placeholder="أدخل بريدك" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="h-10" />
                <Button type="button" onClick={handleForgotPassword} size="sm" variant="outline" className="w-full">إرسال الرابط</Button>
              </div>
            )}
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-gray-500">
            ليس لديك حساب؟ <Link href="/register" className="text-primary font-semibold">إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
