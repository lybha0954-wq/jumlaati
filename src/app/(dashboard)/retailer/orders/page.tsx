"use client";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function RetailerOrdersPage() {
  const orders = [
    { id: "ORD-1", created_at: "2026-08-01", total: 45000, status: "pending" },
    { id: "ORD-2", created_at: "2026-08-05", total: 120000, status: "delivered" },
    { id: "ORD-3", created_at: "2026-08-10", total: 75000, status: "shipped" },
  ];

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "created_at", header: "التاريخ" },
    { key: "total", header: "المجموع", render: (row: any) => `${row.total.toLocaleString()} د.ع` },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={orders} columns={columns} />
      </div>
    </div>
  );
}
