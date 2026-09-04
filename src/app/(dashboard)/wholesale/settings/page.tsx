"use client";
import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

export default function WholesaleSettingsPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // هنا يتم إرسال الإعدادات إلى الـ API المخصص لاحقاً
    showToast("تم حفظ الإعدادات بنجاح", "success");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow max-w-lg">
          <h1 className="text-2xl font-bold mb-6">إعدادات الجملة</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="companyName" placeholder="اسم الشركة" />
            <Input name="commercialLicense" placeholder="رقم السجل التجاري" />
            <Input name="phone" placeholder="رقم الهاتف (بالصيغة الدولية)" />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
