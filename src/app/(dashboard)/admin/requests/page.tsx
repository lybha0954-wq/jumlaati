"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setRequests([
      { id: "REQ-1", user: "تاجر جديد", type: "تسجيل", status: "pending" },
      { id: "REQ-2", user: "متجر 1", type: "تعديل بيانات", status: "approved" },
    ]);
  }, []);

  const handleAction = (id: string, status: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    showToast(`تم تحديث حالة الطلب إلى ${status}`, "success");
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "user", header: "المستخدم" },
    { key: "type", header: "نوع الطلب" },
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
        <h1 className="text-3xl font-bold mb-6">طلبات المساعدة</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable data={requests} columns={columns} />
        </div>
      </div>
    </div>
  );
}
