"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { XCircle, RotateCcw } from "lucide-react";

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast("تم تحديث حالة الطلب", "success");
      fetchOrders();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("هل أنت متأكد من إلغاء الطلب؟")) return;
    await updateStatus(id, "cancelled");
  };

  const handleRefund = async (id: string) => {
    const reason = prompt("يرجى كتابة سبب طلب الاسترجاع:");
    if (!reason) return;
    const res = await fetch("/api/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, reason }),
    });
    if (res.ok) {
      showToast("تم إرسال طلب الاسترجاع للإدارة", "success");
    } else {
      showToast("حدث خطأ في إرسال الطلب", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "total", header: "المجموع", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            {row.status === 'pending' && (
                <Button size="sm" variant="destructive" onClick={() => handleCancel(row.id)}><XCircle size={14} /> إلغاء</Button>
            )}
            {row.status === 'delivered' && (
                <Button size="sm" variant="outline" onClick={() => handleRefund(row.id)}><RotateCcw size={14} /> استرجاع</Button>
            )}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {orders.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد طلبات حالياً.</div>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
