"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Check, X } from "lucide-react";

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchRefunds = async () => {
    const res = await fetch("/api/refunds");
    if (res.ok) setRefunds(await res.json());
  };

  useEffect(() => { fetchRefunds(); }, []);

  const handleStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/refunds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast(`تم ${status === 'approved' ? 'قبول' : 'رفض'} الطلب`, "success");
      fetchRefunds();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "reason", header: "السبب" },
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleDateString('ar-IQ') },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleStatus(row.id, 'approved')}><Check size={14} /> قبول</Button>
              <Button size="sm" variant="destructive" onClick={() => handleStatus(row.id, 'rejected')}><X size={14} /> رفض</Button>
            </>
          )}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة طلبات الاسترجاع</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {refunds.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد طلبات استرجاع حالياً.</div>
          ) : (
            <DataTable data={refunds} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
