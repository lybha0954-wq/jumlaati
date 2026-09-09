"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Printer } from "lucide-react";

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders(await res.json());
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl"><head><title>فاتورة طلب #${order.id}</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: right;">
        <h1 style="color: #f59e0b; text-align: center;">جُمْلَتِي</h1>
        <h3>فاتورة طلب رقم: ${order.id}</h3>
        <p>العنوان: ${order.address}</p>
        <hr><p>الإجمالي: <strong>${formatCurrency(order.total)}</strong></p>
        <hr><p style="text-align: center; color: #888;">شكراً لتعاملكم معنا</p>
      </body></html>
    `);
    printWindow.document.close(); printWindow.focus(); printWindow.print();
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "total", header: "المجموع", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <Button size="sm" variant="outline" onClick={() => handlePrint(row)}><Printer size={14} /> طباعة</Button>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {orders.length === 0 ? <p className="text-center text-gray-500 py-10">لا توجد طلبات.</p> : <DataTable data={orders} columns={columns} />}
        </div>
      </div>
    </div>
  );
}
