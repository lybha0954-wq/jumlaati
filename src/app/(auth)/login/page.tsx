"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
    });

    if (!res.ok) {
      showToast("فشل تسجيل الدخول", "error");
      setLoading(false);
      return;
    }
    showToast("تم تسجيل الدخول بنجاح", "success");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>
        <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
        <Input name="password" type="password" placeholder="كلمة المرور" required />
        <Button type="submit" disabled={loading} className="w-full">{loading ? "جارٍ الدخول..." : "دخول"}</Button>
      </form>
    </div>
  );
}
