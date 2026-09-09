"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { useUserStore } from "@/lib/stores/userStore";

export function ProductForm({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast("تم إنشاء المنتج بنجاح", "success");
      router.refresh(); // لتحديث الجدول بدون إعادة تحميل الصفحة
    } else {
      showToast("حدث خطأ ما", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="اسم المنتج" defaultValue={initialData?.name} required />
      <Textarea name="description" placeholder="وصف المنتج" defaultValue={initialData?.description} />
      <div className="grid grid-cols-2 gap-4">
        <Input name="price" type="number" step="0.01" placeholder="سعر التجزئة" defaultValue={initialData?.price} required />
        <Input name="wholesalePrice" type="number" step="0.01" placeholder="سعر الجملة" defaultValue={initialData?.wholesalePrice} required />
      </div>
      <Input name="stock" type="number" placeholder="الكمية المتوفرة" defaultValue={initialData?.stock} required />
      <Select name="category" defaultValue={initialData?.category}>
        <option value="electronics">إلكترونيات</option>
        <option value="clothing">ملابس</option>
        <option value="food">مواد غذائية</option>
      </Select>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "جارٍ الحفظ..." : "حفظ المنتج"}
      </Button>
    </form>
  );
}
