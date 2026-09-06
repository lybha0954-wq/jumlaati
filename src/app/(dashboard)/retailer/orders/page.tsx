"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      showToast("خطأ في جلب الطلبات", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "total", header: "المجموع", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleDateString('ar-IQ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لا توجد طلبات حالياً.</p>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
