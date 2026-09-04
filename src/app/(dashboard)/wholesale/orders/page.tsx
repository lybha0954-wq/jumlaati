"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Send, Printer, Eye } from "lucide-react";

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
    await updateStatus(orderId, "shipped");
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
        showToast("تم فتح واتساب لإرسال التفاصيل", "success");
      } else {
        showToast("لا يوجد رقم هاتف للتاجر", "error");
      }
    } catch (error) {
      showToast("تعذر إرسال الواتساب", "error");
    }
  };

  // دالة الطباعة (تفتح نافذة جديدة للطباعة)
  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl">
        <head><title>فاتورة طلب #${order.id}</title></head>
        <body style="font-family: sans-serif; padding: 20px; text-align: right;">
          <h1 style="color: #f59e0b; text-align: center;">جُمْلَتِي</h1>
          <h3>فاتورة طلب رقم: ${order.id}</h3>
          <p>التاريخ: ${new Date(order.created_at).toLocaleDateString('ar-IQ')}</p>
          <p>العنوان: ${order.address}</p>
          <hr>
          <p>الإجمالي: <strong>${formatCurrency(order.total)}</strong></p>
          <hr>
          <p style="text-align: center; color: #888;">شكراً لتعاملكم معنا</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "total", header: "القيمة", render: (row: any) => formatCurrency(row.total) },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(row)}><Eye size={14} /></Button>
            <Button size="sm" variant="outline" onClick={() => handlePrint(row)}><Printer size={14} /></Button>
            {row.status === 'pending' && (
                <Button size="sm" onClick={() => updateStatus(row.id, 'processing')}>قبول</Button>
            )}
            {row.status === 'processing' && (
                <Button size="sm" variant="secondary" onClick={() => handleShipAndWhatsApp(row.id)} className="gap-2">
                    <Send size={14} /> شحن
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
            <div className="py-10 text-center text-gray-500">لا توجد طلبات واردة بعد.</div>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </div>

      {/* نافذة عرض التفاصيل */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="تفاصيل الطلب">
        {selectedOrder && (
          <div className="space-y-4">
            <p><strong>رقم الطلب:</strong> {selectedOrder.id}</p>
            <p><strong>العنوان:</strong> {selectedOrder.address}</p>
            <p><strong>الإجمالي:</strong> {formatCurrency(selectedOrder.total)}</p>
            <div className="flex gap-2">
              <Button onClick={() => handlePrint(selectedOrder)} className="w-full"><Printer size={16} className="ml-2" /> طباعة الفاتورة</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
