"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // افتراضي: تذكرني
  const [showForgot, setShowForgot] = useState(false); // لعرض نافذة الاستعادة
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
      email,
      password,
      options: {
        persistSession: rememberMe, // هنا خاصية تذكرني
      },
    });

                                                                                                                            // جلب الدور من بيانات المستخدم لتحديد وجهة الدخول
                                                                                                                                const { data: { user } } = await supabase.auth.getUser();
                                                                                                                                    const role = user?.user_metadata?.role || "retailer";

    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role || "retailer";
    
    let dashboardPath = "/dashboard/retailer/overview";
    if (role === "admin") dashboardPath = "/dashboard/admin/overview";
    else if (role === "wholesaler") dashboardPath = "/dashboard/wholesale/overview";
    else if (role === "delivery") dashboardPath = "/dashboard/delivery/overview";
    else if (role === "pending") dashboardPath = "/"; // في حال كان قيد المراجعة

    showToast("تم تسجيل الدخول بنجاح! 🎉", "success");
    router.push(dashboardPath);
  };

  // دالة إرسال رابط استعادة كلمة المرور
  const handleForgotPassword = async () => {
    if (!resetEmail) return showToast("أدخل بريدك الإلكتروني", "error");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) return showToast("خطأ في إرسال الرابط", "error");
    showToast("تم إرسال رابط الاستعادة لبريدك!", "success");
    setShowForgot(false);
  };

                                                                                                                                                        showToast("تم تسجيل الدخول بنجاح! 🎉", "success");
                                                                                                                                                            router.push(dashboardPath);
                                                                                                                                                              };

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">البريد الإلكتروني</label>
            <Input name="email" type="email" placeholder="example@email.com" required className="h-12 rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">كلمة المرور</label>
            <Input name="password" type="password" placeholder="********" required className="h-12 rounded-xl" />
          </div>
          
          {/* تذكرني + نسيت كلمة المرور */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-primary h-4 w-4" />
              تذكرني
            </label>
            <button type="button" onClick={() => setShowForgot(!showForgot)} className="text-sm text-primary hover:underline">
              نسيت كلمة المرور؟
            </button>
          </div>

          {showForgot && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
              <Input type="email" placeholder="أدخل بريدك لإرسال الرابط" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="h-10" />
              <Button type="button" onClick={handleForgotPassword} size="sm" variant="outline" className="w-full">إرسال الرابط</Button>
            </div>
          )}

          <Button type="submit" disabled={loading} size="lg" className="w-full justify-center text-lg shadow-lg shadow-primary/20">
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
}
