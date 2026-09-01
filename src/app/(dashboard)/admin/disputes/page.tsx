import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Topbar } from "@/components/shared/Topbar";

export default function AdminDisputesPage() {
  const disputes = [
    { id: "D1", user: "أحمد", order: "ORD-1", status: "pending" },
    { id: "D2", user: "سارة", order: "ORD-2", status: "approved" },
  ];

  const columns = [
    { key: "id", header: "رقم النزاع" },
    { key: "user", header: "المستخدم" },
    { key: "order", header: "الطلب" },
    { key: "status", header: "الحالة", render: (r: any) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة النزاعات</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={disputes} columns={columns} />
      </div>
    </div>
  );
}
