import { Topbar } from "@/components/shared/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";

export default function AdminUsersPage() {
  const users = [
    { id: "1", name: "مدير النظام", role: "admin" },
    { id: "2", name: "تاجر 1", role: "retailer" },
  ];

  const columns = [
    { key: "name", header: "الاسم" },
    { key: "role", header: "الدور", render: (row: any) => <Badge>{row.role}</Badge> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={users} columns={columns} />
      </div>
    </div>
  );
}
