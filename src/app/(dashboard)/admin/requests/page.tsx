import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Topbar } from "@/components/shared/Topbar";

export default function AdminRequestsPage() {
  const requests = [
    { id: "REQ-1", user: "تاجر جديد", type: "تسجيل", status: "pending" },
    { id: "REQ-2", user: "متجر 1", type: "تعديل بيانات", status: "approved" },
  ];

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "user", header: "المستخدم" },
    { key: "type", header: "نوع الطلب" },
    { key: "status", header: "الحالة" },
    { key: "actions", header: "إجراءات", render: () => (
        <div className="flex gap-2">
            <Button size="sm" variant="outline">قبول</Button>
            <Button size="sm" variant="destructive">رفض</Button>
        </div>
    )},
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">طلبات المساعدة</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={requests} columns={columns} />
      </div>
    </div>
  );
}
