"use client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-6">إعدادات المنصة</h1>
      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 block">نسبة العمولة العامة</label>
            <Input type="number" defaultValue="5" />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 block">طرق الدفع المتاحة</label>
            <Select defaultValue="card">
                <option value="card">بطاقة ائتمان</option>
                <option value="cod">الدفع عند الاستلام</option>
            </Select>
        </div>
        <Button onClick={() => showToast("تم حفظ إعدادات المنصة", "success")}>حفظ التغييرات</Button>
      </div>
    </div>
  );
}
