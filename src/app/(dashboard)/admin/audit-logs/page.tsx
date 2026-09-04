"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/hooks/useToast";
import { ShieldAlert } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const { showToast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) setLogs(await res.json());
    } catch (error) {
      showToast("خطأ في جلب السجلات", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const columns = [
    { key: "id", header: "المعرف" },
    { key: "action", header: "الإجراء" },
    { key: "users", header: "المستخدم", render: (row: any) => row.users?.name || row.user_id },
    { key: "details", header: "التفاصيل", render: (row: any) => JSON.stringify(row.details) },
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleString('ar-IQ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><ShieldAlert className="text-red-500" size={28} /> سجل الأمان</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {logs.length === 0 ? (<div className="py-10 text-center text-gray-500">لا توجد سجلات أمان حالياً.</div>) : (<DataTable data={logs} columns={columns} />)}
        </div>
      </div>
    </div>
  );
}
