"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Topbar } from "@/components/shared/Topbar";

export default function RetailerInvoicesPage() {
  const invoices = [
    { id: "INV-001", date: "2023-10-25", amount: 150000, status: "paid" },
    { id: "INV-002", date: "2023-10-26", amount: 75000, status: "pending" },
  ];

  const columns = [
    { key: "id", header: "رقم الفاتورة" },
    { key: "date", header: "التاريخ" },
    { key: "amount", header: "المبلغ" },
    { key: "status", header: "الحالة" },
    { key: "download", header: "تحميل", render: (r: any) => <Button size="sm" variant="outline">PDF</Button> },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">الفواتير</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <DataTable data={invoices} columns={columns} />
      </div>
    </div>
  );
}
