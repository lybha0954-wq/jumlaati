"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const { showToast } = useToast();

  const fetchDisputes = useCallback(async () => {
    try {
      const res = await fetch("/api/refunds");
      if (res.ok) setDisputes(await res.json());
    } catch (error) {
      showToast("خطأ في جلب النزاعات", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  const handleStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/refunds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast("تم تحديث الحالة بنجاح", "success");
      fetchDisputes();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم النزاع" },
    { key: "reason", header: "السبب" },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
          {row.status === "pending" && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleStatus(row.id, "approved")}>قبول</Button>
              <Button size="sm" variant="destructive" onClick={() => handleStatus(row.id, "rejected")}>رفض</Button>
            </>
          )}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة النزاعات</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {disputes.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لا توجد نزاعات حالياً.</p>
          ) : (
            <DataTable data={disputes} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
