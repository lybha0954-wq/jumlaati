"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { FileText } from "lucide-react";

export default function RetailerInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    // مؤقت حتى يتم إنشاء جدول الفواتير أو استخدام الطلبات
    setInvoices([]);
  }, []);

  const columns = [
    { key: "id", header: "رقم الفاتورة" },
    { key: "date", header: "التاريخ" },
    { key: "amount", header: "المبلغ", render: (row: any) => formatCurrency(row.amount) },
    { key: "status", header: "الحالة", render: (row: any) => <Badge variant="secondary">مدفوعة</Badge> },
    { key: "actions", header: "تحميل", render: () => <Button size="sm" variant="outline">PDF</Button> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">الفواتير</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {invoices.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <FileText className="mx-auto mb-4 text-gray-300" size={48} />
              لا توجد فواتير حالياً.
            </div>
          ) : (
            <DataTable data={invoices} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
