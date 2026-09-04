"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast } from "@/hooks/useToast";

export function ProductForm({ initialData, onSuccess }: { initialData?: any; onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.images?.[0]);
  const { showToast } = useToast();

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) {
      setImageUrl(data.url);
      showToast("تم رفع الصورة بنجاح!", "success");
    } else {
      showToast(data.error || "خطأ في رفع الصورة", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    data.images = JSON.stringify(imageUrl ? [imageUrl] : []);

    const res = await fetch(initialData ? `/api/products/${initialData.id}` : "/api/products", {
      method: initialData ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast(initialData ? "تم تحديث المنتج" : "تم إنشاء المنتج", "success");
      onSuccess?.();
    } else {
      const err = await res.json();
      showToast(err.error || "حدث خطأ", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Product" className="h-20 w-20 object-cover rounded-lg" />}
      <Input name="name" placeholder="اسم المنتج" defaultValue={initialData?.name} required />
      <Textarea name="description" placeholder="وصف المنتج" defaultValue={initialData?.description} />
      <div className="grid grid-cols-2 gap-4">
        <Input name="price" type="number" step="0.01" placeholder="سعر التجزئة" defaultValue={initialData?.price} required />
        <Input name="wholesalePrice" type="number" step="0.01" placeholder="سعر الجملة" defaultValue={initialData?.wholesalePrice} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input name="stock" type="number" placeholder="الكمية" defaultValue={initialData?.stock} required />
        <Select name="category" defaultValue={initialData?.category}>
          <option value="electronics">إلكترونيات</option>
          <option value="clothing">ملابس</option>
          <option value="food">مواد غذائية</option>
          <option value="general">مواد عامة</option>
        </Select>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "جارٍ الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة المنتج"}
      </Button>
    </form>
  );
}
