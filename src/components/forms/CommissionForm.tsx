"use client";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCommissionStore } from "@/lib/stores/commissionStore";

export function CommissionForm({ orderId, retailerId }: { orderId: string; retailerId: string }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const setCommissions = useCommissionStore((s) => s.setCommissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = { orderId, retailerId, amount: Number(formData.get("amount")), status: "pending" };

    const res = await fetch("/api/commissions", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newCommission = await res.json();
      setCommissions([newCommission]); // تحديث الـ store
      showToast("تم إنشاء العمولة بنجاح", "success");
    } else {
      showToast("حدث خطأ في إنشاء العمولة", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input name="amount" type="number" placeholder="مبلغ العمولة" required />
      <Button type="submit" disabled={loading} className="w-full">إضافة عمولة</Button>
    </form>
  );
}
