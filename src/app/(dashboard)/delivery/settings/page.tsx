"use client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DeliverySettingsPage() {
  const { showToast } = useToast();
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-6">إعدادات مندوب التوصيل</h1>
      <div className="space-y-4">
        <Input name="vehicle" placeholder="نوع المركبة (دراجة، سيارة...)" />
        <Input name="area" placeholder="منطقة التغطية" />
        <Button onClick={() => showToast("تم حفظ إعدادات التوصيل", "success")}>حفظ</Button>
      </div>
    </div>
  );
}
