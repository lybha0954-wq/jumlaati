"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export default function WholesalePayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await fetch("/api/payouts");
        if (res.ok) setPayouts(await res.json());
      } catch (error) {
        showToast("خطأ في جلب المدفوعات", "error");
      }
    };
    fetchPayouts();
  }, []);

  const columns = [
    { key: "id", header: "رقم الدفعة" },
    { key: "amount", header: "المبلغ", render: (row: any) => formatCurrency(row.amount) },
    { key: "status", header: "الحالة", render: (row: any) => <Badge variant={row.status === 'processed' ? 'success' : 'secondary'}>{row.status === 'processed' ? 'مدفوع' : 'معلق'}</Badge> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">المدفوعات والمستحقات</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable data={payouts} columns={columns} />
        </div>
      </div>
    </div>
  );
}
