"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Send } from "lucide-react";

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { method: "GET" });
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      showToast("خطأ في جلب الطلبات", "error");
    } finally {
      setLoading(false);
    }
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

  const handleShipAndWhatsApp = async (orderId: string) => {
    // 1. تحديث الحالة إلى شحن
    await updateStatus(orderId, "shipped");

    // 2. جلب رابط واتساب
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (data.url) {
        // فتح واتساب
        window.open(data.url, '_blank');
        showToast("تم فتح واتساب لإرسال تفاصيل الطلب!", "success");
      } else {
        showToast("لا يوجد رقم هاتف مسجل لهذا التاجر", "error");
      }
    } catch (error) {
      showToast("تعذر إرسال الواتساب", "error");
    }
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "total", header: "القيمة", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            {row.status === 'pending' && (
                <Button size="sm" onClick={() => updateStatus(row.id, 'processing')}>قبول الطلب</Button>
            )}
            {row.status === 'processing' && (
                <Button size="sm" variant="secondary" onClick={() => handleShipAndWhatsApp(row.id)} className="gap-2">
                    <Send size={14} /> تم الشحن واتساب
                </Button>
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
            </div>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
