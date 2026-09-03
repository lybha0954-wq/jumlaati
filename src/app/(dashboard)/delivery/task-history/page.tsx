"use client";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DeliveryTaskHistoryPage() {
  const tasks = [
    { id: "TH-1", address: "بغداد - زيونة", date: "2026-09-01", status: "delivered" },
    { id: "TH-2", address: "بغداد - المنصور", date: "2026-09-02", status: "delivered" },
  ];

  const columns = [
    { key: "id", header: "رقم المهمة" },
    { key: "address", header: "العنوان" },
    { key: "date", header: "التاريخ" },
    { key: "status", header: "الحالة", render: (r: any) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">سجل المهام</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={tasks} columns={columns} />
      </div>
    </div>
  );
}
