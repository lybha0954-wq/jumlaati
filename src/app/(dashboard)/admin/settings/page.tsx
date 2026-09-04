"use client";
import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast("تم حفظ إعدادات المنصة بنجاح", "success");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow max-w-lg">
          <h1 className="text-2xl font-bold mb-6">إعدادات المنصة</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
