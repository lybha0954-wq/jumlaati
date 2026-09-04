"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // تسجيل الدخول بالبريد أو كلمة المرور
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // جلب المستخدم من الجلسة
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

  // إرسال رمز OTP للهاتف
  const handleSendOtp = async () => {
    if (!phone) return showToast("أدخل رقم الهاتف", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("تم إرسال رمز التحقق إلى هاتفك", "success");
      setOtpSent(true);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // التحقق من الرمز وتسجيل الدخول
  const handleVerifyOtp = async () => {
    if (!otpToken) return showToast("أدخل رمز التحقق", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone, token: otpToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const role = data.user?.user_metadata?.role || "retailer";
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
          
          <Tabs defaultValue="email">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="email" className="flex-1">البريد الإلكتروني</TabsTrigger>
              <TabsTrigger value="phone" className="flex-1">رقم الهاتف</TabsTrigger>
            </TabsList>

            {/* تسجيل الدخول بالبريد */}
            <TabsContent value="email">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <Input placeholder="البريد الإلكتروني" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required className="h-12" />
                <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>

            {/* تسجيل الدخول بالهاتف */}
            <TabsContent value="phone" className="space-y-4">
              <Input placeholder="رقم الهاتف (بالصيغة الدولية 9647XXXXXXXXX)" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12" />
              
              {!otpSent ? (
                <Button onClick={handleSendOtp} disabled={loading} size="lg" className="w-full">
                  {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
                </Button>
              ) : (
                <>
                  <Input placeholder="رمز التحقق (OTP)" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} required className="h-12" />
                  <Button onClick={handleVerifyOtp} disabled={loading} size="lg" className="w-full">
                    {loading ? "جارٍ التحقق..." : "تأكيد الدخول"}
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6 text-sm text-gray-500">
            ليس لديك حساب؟ <Link href="/register" className="text-primary font-semibold">إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
