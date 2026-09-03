"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DeliveryCommissionsPage() {
  const commissions = [
    { id: "DC-1", order: "ORD-501", amount: 2500, date: "2026-09-01", status: "pending" },
    { id: "DC-2", order: "ORD-502", amount: 4500, date: "2026-09-02", status: "paid" },
  ];

  const columns = [
    { key: "id", header: "رقم العمولة" },
    { key: "order", header: "رقم الطلب" },
    { key: "amount", header: "المبلغ" },
    { key: "date", header: "التاريخ" },
    { key: "status", header: "الحالة", render: (r: any) => <Badge>{r.status === 'paid' ? 'مدفوعة' : 'معلقة'}</Badge> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">عمولاتي</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={commissions} columns={columns} />
      </div>
    </div>
  );
}
