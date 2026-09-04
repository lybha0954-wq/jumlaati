"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export default function RetailerCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        // ملاحظة: يجب أن يكون الـ API الخاص بالعمولات يدعم جلب عمولات المستخدم الحالي
        const res = await fetch("/api/commissions", { method: "GET" });
        if (res.ok) setCommissions(await res.json());
      } catch (error) {
        showToast("خطأ في جلب العمولات", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  const columns = [
    { key: "order_id", header: "رقم الطلب" },
    { key: "amount", header: "المبلغ", render: (row: any) => formatCurrency(row.amount) },
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleDateString('ar-IQ') },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">العمولات المستحقة</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {commissions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد عمولات حالياً.</div>
          ) : (
            <DataTable data={commissions} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
