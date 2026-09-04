"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في تسجيل الدخول");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || "retailer";

      let dashboardPath = "/dashboard/retailer/overview";
      if (role === "admin") dashboardPath = "/dashboard/admin/overview";
      else if (role === "wholesaler") dashboardPath = "/dashboard/wholesale/overview";
      else if (role === "delivery") dashboardPath = "/dashboard/delivery/overview";

      showToast("تم تسجيل الدخول بنجاح!", "success");
      router.push(dashboardPath);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-extrabold text-center mb-6">مرحباً بعودتك 👋</h1>
          <p className="text-center text-gray-500 mb-8">سجل دخولك بالبريد الإلكتروني أو رقم الهاتف</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="البريد الإلكتروني أو رقم الهاتف" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
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
