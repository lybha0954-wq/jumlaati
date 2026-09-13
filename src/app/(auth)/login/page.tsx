"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast(error.message, "error");
        setLoading(false);
        return;
      }

      if (!data.user) {
        showToast("لم يتم تسجيل الدخول", "error");
        setLoading(false);
        return;
      }

      const role = (data.user.user_metadata?.role as string) || "retailer";

      let dashboardPath = "/retailer/overview";
      if (role === "admin") dashboardPath = "/admin/overview";
      else if (role === "wholesaler") dashboardPath = "/wholesale/overview";
      else if (role === "delivery") dashboardPath = "/delivery/overview";

      showToast("تم تسجيل الدخول بنجاح!", "success");

      // انتظر لحظة لضبط الكوكيز ثم توجه
      await new Promise((r) => setTimeout(r, 300));
      window.location.href = dashboardPath;
    } catch (err) {
      showToast("حدث خطأ غير متوقع", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-medium p-8 border border-border">
          <h1 className="text-3xl font-extrabold text-center mb-6">
            مرحباً بعودتك 👋
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
