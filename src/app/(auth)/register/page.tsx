"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showToast("فشل التسجيل", "error");
      setLoading(false);
      return;
    }
    showToast("تم إنشاء الحساب، تحقق من بريدك", "success");
    router.push("/auth/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">إنشاء حساب جديد</h1>
        <Input name="name" placeholder="الاسم الكامل" required />
        <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
        <Input name="password" type="password" placeholder="كلمة المرور" required />
        <Select name="role" defaultValue="retailer">
          <option value="retailer">تاجر تجزئة</option>
          <option value="wholesaler">تاجر جملة</option>
          <option value="delivery">مندوب توصيل</option>
        </Select>
        <Button type="submit" disabled={loading} className="w-full">{loading ? "جارٍ التسجيل..." : "تسجيل"}</Button>
      </form>
    </div>
  );
}
