import { Topbar } from "@/components/dashboard/Topbar";

export default function AdminCommissionsPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة العمولات</h1>
      <p className="text-gray-500">سيتم عرض تقارير العمولات هنا بعد ربط قاعدة البيانات.</p>
    </div>
  );
}
