"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const { showToast } = useToast();

  // مؤقت حتى يتم ربطها بقاعدة البيانات
  useEffect(() => {
    setDisputes([
      { id: "D1", user: "أحمد", order: "ORD-1", status: "pending" },
      { id: "D2", user: "سارة", order: "ORD-2", status: "approved" },
    ]);
  }, []);

  const handleAction = (id: string, status: string) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status } : d));
    showToast(`تم تحديث حالة النزاع إلى ${status}`, "success");
  };

  const columns = [
    { key: "id", header: "رقم النزاع" },
    { key: "user", header: "المستخدم" },
    { key: "order", header: "الطلب" },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleAction(row.id, "approved")}>قبول</Button>
          <Button size="sm" variant="destructive" onClick={() => handleAction(row.id, "rejected")}>رفض</Button>
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة النزاعات</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable data={disputes} columns={columns} />
        </div>
      </div>
    </div>
  );
}
