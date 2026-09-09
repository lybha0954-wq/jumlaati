"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Topbar } from "@/components/dashboard/Topbar";

export default function AdminMatchingPage() {
  const matches = [
    { id: "M1", retailer: "متجر الأمل", wholesaler: "شركة النور", status: "pending" },
    { id: "M2", retailer: "متجر السلام", wholesaler: "مؤسسة الخير", status: "approved" },
  ];

  const columns = [
    { key: "id", header: "رقم المطابقة" },
    { key: "retailer", header: "تاجر التجزئة" },
    { key: "wholesaler", header: "تاجر الجملة" },
    { key: "status", header: "الحالة" },
    { key: "actions", header: "إجراءات", render: () => (
        <div className="flex gap-2">
            <Button size="sm" variant="outline">قبول</Button>
            <Button size="sm" variant="destructive">رفض</Button>
        </div>
    )},
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">مطابقة الطلبات</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={matches} columns={columns} />
      </div>
    </div>
  );
}
