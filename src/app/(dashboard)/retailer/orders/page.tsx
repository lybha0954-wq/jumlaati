import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Topbar } from "@/components/shared/Topbar";

export default function RetailerOrdersPage() {
  const orders = [
    { id: "ORD-1", customer: "أحمد", total: 25000, status: "pending" },
    { id: "ORD-2", customer: "سارة", total: 15000, status: "shipped" },
  ];

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "customer", header: "العميل" },
    { key: "total", header: "المجموع" },
    {
      key: "status",
      header: "الحالة",
      render: (row: any) => <Badge variant={row.status === "pending" ? "secondary" : "default"}>{row.status}</Badge>,
    },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={orders} columns={columns} />
      </div>
    </div>
  );
}
