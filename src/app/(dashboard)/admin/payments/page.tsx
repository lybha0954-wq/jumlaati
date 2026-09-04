"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { CreditCard } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/admin/payments");
        if (res.ok) setPayments(await res.json());
      } catch (error) {
        showToast("خطأ في جلب المدفوعات", "error");
      }
    };
    fetchPayments();
  }, []);

  const columns = [
    { key: "id", header: "معرف الدفع" },
    { key: "order_id", header: "رقم الطلب" },
    { key: "amount", header: "المبلغ", render: (row: any) => formatCurrency(row.amount) },
    { key: "gateway", header: "البوابة", render: (row: any) => row.gateway },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleString('ar-IQ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="text-primary" size={28} /> سجل المدفوعات
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {payments.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد مدفوعات حالياً.</div>
          ) : (
            <DataTable data={payments} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
