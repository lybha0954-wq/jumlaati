"use client";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function MatchingForm({ retailerId }: { retailerId: string }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/matching", {
      method: "POST",
      body: JSON.stringify({ ...data, retailerId }),
    });

    if (res.ok) {
      showToast("تم إرسال طلب المطابقة", "success");
      (e.target as HTMLFormElement).reset();
    } else {
      showToast("فشل إرسال طلب المطابقة", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input name="productName" placeholder="اسم المنتج المطلوب" required />
      <Input name="quantity" type="number" placeholder="الكمية المطلوبة" required />
      <Textarea name="notes" placeholder="ملاحظات إضافية..." />
      <Button type="submit" disabled={loading} className="w-full">إرسال للمطابقة</Button>
    </form>
  );
}
