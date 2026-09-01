"use client";
import { useUserStore } from "@/lib/stores/userStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RetailerSettingsPage() {
  const user = useUserStore((state) => state.user);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // منطق الحفظ
    showToast("تم حفظ الإعدادات بنجاح", "success");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-6">إعدادات المتجر</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="storeName" placeholder="اسم المتجر" defaultValue={`متجر ${user?.name}`} />
        <Input name="phone" placeholder="رقم الهاتف" defaultValue={user?.phone} />
        <Input name="address" placeholder="العنوان" />
        <Button type="submit">حفظ التغييرات</Button>
      </form>
    </div>
  );
}
