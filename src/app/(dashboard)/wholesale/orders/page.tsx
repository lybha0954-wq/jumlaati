"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { method: "GET" });
      if (res.ok) setOrders(await res.json());
      else showToast("خطأ في جلب الطلبات", "error");
    } catch (error) {
      showToast("تعذر الاتصال", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      showToast("تم تحديث حالة الطلب بنجاح", "success");
      fetchOrders();
    } else {
      const data = await res.json();
      showToast(data.error || "حدث خطأ", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "user_id", header: "رقم التاجر", render: (row: any) => row.user_id.slice(0, 6) + "..." },
    { key: "total", header: "القيمة", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            {row.status === 'pending' && (
                <Button size="sm" onClick={() => updateStatus(row.id, 'processing')}>قبول الطلب</Button>
            )}
            {row.status === 'processing' && (
                <Button size="sm" variant="secondary" onClick={() => updateStatus(row.id, 'shipped')}>تم الشحن</Button>
            )}
            {row.status === 'shipped' && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(row.id, 'delivered')}>تم التوصيل</Button>
            )}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">الطلبات الواردة</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {orders.length === 0 ? (
            <div className="py-10 text-center">
              <h3 className="text-xl font-bold text-gray-500">لا توجد طلبات واردة بعد</h3>
              <p className="text-gray-400 mt-2">عندما يطلب تاجر تجزئة منتجاتك، سيظهر طلبه هنا.</p>
            </div>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
