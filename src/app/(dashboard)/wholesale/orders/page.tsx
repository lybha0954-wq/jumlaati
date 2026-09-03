"use client";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Topbar } from "@/components/dashboard/Topbar";

export default function WholesaleOrdersPage() {
  const orders = [
    { id: "W-ORD-1", buyer: "متجر الأمل", total: 500000, status: "pending" },
    { id: "W-ORD-2", buyer: "متجر السلام", total: 250000, status: "shipped" },
  ];

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "buyer", header: "المشتري" },
    { key: "total", header: "المجموع" },
    { key: "status", header: "الحالة", render: (r: any) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">طلبات الجملة</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={orders} columns={columns} />
      </div>
    </div>
  );
}
