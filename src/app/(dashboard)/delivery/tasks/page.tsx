"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function DeliveryTasksPage() {
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/delivery/tasks");
      if (res.ok) setTasks(await res.json());
    } catch (error) {
      showToast("خطأ في جلب المهام", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/delivery/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      showToast("تم تحديث حالة الطلب", "success");
      fetchTasks();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "address", header: "العنوان" },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
          {row.status === "processing" && <Button size="sm" onClick={() => updateStatus(row.id, "shipped")}>بدء التسليم</Button>}
          {row.status === "shipped" && <Button size="sm" variant="outline" onClick={() => updateStatus(row.id, "delivered")}>تم التوصيل</Button>}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">مهام التوصيل</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لا توجد مهام حالياً.</p>
          ) : (
            <DataTable data={tasks} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
