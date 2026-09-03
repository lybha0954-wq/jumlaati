"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Topbar } from "@/components/dashboard/Topbar";

export default function WholesaleInventoryPage() {
  const inventory = [
    { id: "P1", name: "منتج 1", stock: 100, alert: false },
    { id: "P2", name: "منتج 2", stock: 5, alert: true },
  ];

  const columns = [
    { key: "name", header: "المنتج" },
    { key: "stock", header: "الكمية" },
    { key: "alert", header: "الحالة", render: (r: any) => (
        r.alert ? <Badge variant="destructive">مخزون منخفض</Badge> : <Badge>متوفر</Badge>
    )},
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة المخزون</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={inventory} columns={columns} />
      </div>
    </div>
  );
}
