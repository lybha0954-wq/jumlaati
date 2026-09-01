"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

export function RequestForm({ type }: { type: "product" | "wholesale" }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/requests", {
      method: "POST",
      body: JSON.stringify({ ...data, type }),
    });

    if (res.ok) {
      showToast("تم إرسال الطلب", "success");
      (e.target as HTMLFormElement).reset();
    } else {
      showToast("خطأ في إرسال الطلب", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="title" placeholder="عنوان الطلب" required />
      <Textarea name="details" placeholder="تفاصيل الطلب..." required />
      <Button type="submit" disabled={loading}>إرسال الطلب</Button>
    </form>
  );
}
