"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { useUserStore } from "@/lib/stores/userStore";

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast("تم حفظ الملف الشخصي", "success");
    } else {
      showToast("خطأ في الحفظ", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input name="name" placeholder="الاسم" defaultValue={user?.name} required />
      <Input name="phone" placeholder="رقم الهاتف" defaultValue={user?.phone} />
      <Button type="submit" disabled={loading}>حفظ التغييرات</Button>
    </form>
  );
}
