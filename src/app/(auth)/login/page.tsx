"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema } from "@/lib/validations/auth.schema";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
    const router = useRouter();
      const { showToast } = useToast();

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
                setLoading(true);

                    const formData = new FormData(e.target as HTMLFormElement);
                        const rawData = {
                              email: formData.get("email") as string,
                                    password: formData.get("password") as string,
                                        };

                                            const parsed = loginSchema.safeParse(rawData);
                                                if (!parsed.success) {
                                                      showToast("يرجى إدخال بريد إلكتروني وكلمة مرور صحيحة", "error");
                                                            setLoading(false);
                                                                  return;
                                                                      }

                                                                          const supabase = createClient();
                                                                              const { error } = await supabase.auth.signInWithPassword({
                                                                                    email: parsed.data.email,
                                                                                          password: parsed.data.password,
                                                                                              });

                                                                                                  if (error) {
                                                                                                        showToast(error.message || "خطأ في تسجيل الدخول", "error");
                                                                                                              setLoading(false);
                                                                                                                    return;
                                                                                                                        }

                                                                                                                            // جلب الدور من بيانات المستخدم لتحديد وجهة الدخول
                                                                                                                                const { data: { user } } = await supabase.auth.getUser();
                                                                                                                                    const role = user?.user_metadata?.role || "retailer";

                                                                                                                                        let dashboardPath = "/dashboard/retailer/overview";
                                                                                                                                            if (role === "admin") dashboardPath = "/dashboard/admin/overview";
                                                                                                                                                else if (role === "wholesaler") dashboardPath = "/dashboard/wholesale/overview";
                                                                                                                                                    else if (role === "delivery") dashboardPath = "/dashboard/delivery/overview";

                                                                                                                                                        showToast("تم تسجيل الدخول بنجاح! 🎉", "success");
                                                                                                                                                            router.push(dashboardPath);
                                                                                                                                                              };

                                                                                                                                                                return (
                                                                                                                                                                    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                                                                                                                                                                          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                                                                                                                                                                  <div className="text-center mb-8">
                                                                                                                                                                                            <h1 className="text-3xl font-extrabold text-gray-900">مرحباً بعودتك 👋</h1>
                                                                                                                                                                                                      <p className="text-gray-500 mt-2">سجل دخولك للمتابعة إلى لوحة التحكم</p>
                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                      <form onSubmit={handleSubmit} className="space-y-5">
                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">البريد الإلكتروني</label>
                                                                                                                                                                                                                                                        <Input name="email" type="email" placeholder="example@email.com" required className="h-12 rounded-xl" />
                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                            <div>
                                                                                                                                                                                                                                                                                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">كلمة المرور</label>
                                                                                                                                                                                                                                                                                                    <Input name="password" type="password" placeholder="********" required className="h-12 rounded-xl" />
                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                        <Button type="submit" disabled={loading} size="lg" className="w-full justify-center text-lg shadow-lg shadow-primary/20">
                                                                                                                                                                                                                                                                                                                                    {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                                                                                                                                                                                                                                                                                                                                              </Button>
                                                                                                                                                                                                                                                                                                                                                      </form>

                                                                                                                                                                                                                                                                                                                                                              <div className="text-center mt-6 text-sm text-gray-500">
                                                                                                                                                                                                                                                                                                                                                                        ليس لديك حساب؟{" "}
                                                                                                                                                                                                                                                                                                                                                                                  <Link href="/register" className="text-primary font-semibold hover:underline">
                                                                                                                                                                                                                                                                                                                                                                                              إنشاء حساب جديد
                                                                                                                                                                                                                                                                                                                                                                                                        </Link>
                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                                                            }