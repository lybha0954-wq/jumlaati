"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function AdminMatchingPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setMatches([
      { id: "M1", retailer: "متجر الأمل", wholesaler: "شركة النور", status: "pending" },
      { id: "M2", retailer: "متجر السلام", wholesaler: "مؤسسة الخير", status: "approved" },
    ]);
  }, []);

  const handleAction = (id: string, status: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, status } : m));
    showToast(`تم تحديث حالة المطابقة إلى ${status}`, "success");
  };

  const columns = [
    { key: "id", header: "رقم المطابقة" },
    { key: "retailer", header: "تاجر التجزئة" },
    { key: "wholesaler", header: "تاجر الجملة" },
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
        <h1 className="text-3xl font-bold mb-6">مطابقة الطلبات</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable data={matches} columns={columns} />
        </div>
      </div>
    </div>
  );
}
