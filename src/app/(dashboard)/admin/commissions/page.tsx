"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setCommissions([
      { id: "C1", order: "ORD-101", amount: 5000, status: "pending" },
      { id: "C2", order: "ORD-102", amount: 7500, status: "paid" },
    ]);
  }, []);

  const columns = [
    { key: "id", header: "رقم العمولة" },
    { key: "order", header: "رقم الطلب" },
    { key: "amount", header: "المبلغ", render: (row: any) => formatCurrency(row.amount) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة العمولات</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable data={commissions} columns={columns} />
        </div>
      </div>
    </div>
  );
}
