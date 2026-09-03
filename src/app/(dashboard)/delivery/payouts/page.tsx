"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DeliveryPayoutsPage() {
  const payouts = [
    { id: "PAY-1", date: "2023-10-20", amount: 50000, status: "paid" },
    { id: "PAY-2", date: "2023-11-01", amount: 75000, status: "pending" },
  ];

  const columns = [
    { key: "id", header: "رقم الدفعة" },
    { key: "date", header: "التاريخ" },
    { key: "amount", header: "المبلغ" },
    { key: "status", header: "الحالة", render: (r: any) => <Badge>{r.status === 'paid' ? 'مدفوع' : 'معلق'}</Badge> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">المدفوعات والمستحقات</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={payouts} columns={columns} />
      </div>
    </div>
  );
}
