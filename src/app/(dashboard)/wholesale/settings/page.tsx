"use client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Topbar } from "@/components/dashboard/Topbar";

export default function WholesaleSettingsPage() {
  const { showToast } = useToast();
  return (
    <div>
      <Topbar />
      <div className="bg-white p-6 rounded-lg shadow max-w-lg">
        <h1 className="text-2xl font-bold mb-6">إعدادات الجملة</h1>
        <div className="space-y-4">
          <Input name="companyName" placeholder="اسم الشركة" />
          <Input name="commercialLicense" placeholder="رقم السجل التجاري" />
          <Button onClick={() => showToast("تم حفظ إعدادات الجملة", "success")}>حفظ</Button>
        </div>
      </div>
    </div>
  );
}
