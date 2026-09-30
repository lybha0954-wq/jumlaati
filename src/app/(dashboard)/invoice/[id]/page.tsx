"use client";

import { use, useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ArrowRight, Printer, Package, Store, User, Truck, MapPin,
  Calendar, CheckCircle2, XCircle,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number?: string;
  status: string;
  payment_status?: string;
  payment_method?: string;
  total_amount: number;
  subtotal?: number;
  delivery_fee?: number;
  commission?: number;
  created_at: string;
  delivery_address?: string;
  retailer_name?: string;
  retailer_phone?: string;
  supplier_name?: string;
  supplier_phone?: string;
  delivery_name?: string;
  delivery_phone?: string;
  buyer_name?: string;
}

const PAYMENT_METHODS: Record<string, string> = {
  cash: "الدفع عند الاستلام",
  zaincash: "زين كاش",
  fastpay: "فاست باي",
  fib: "FIB / Qi Card",
  bank_transfer: "حوالة بنكية",
};

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  unpaid:   { label: "غير مدفوع",   cls: "bg-red-50 text-red-700" },
  partial:  { label: "جزئي",         cls: "bg-amber-50 text-amber-700" },
  paid:     { label: "مدفوع",        cls: "bg-[#e8f4f0] text-[#1e6b57]" },
  refunded: { label: "مسترد",        cls: "bg-gray-100 text-gray-600" },
};

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          setOrder(res.order);
          setItems(res.items || []);
        } else {
          showToast("لم يتم العثور على الطلب", "error");
        }
      })
      .catch(() => showToast("فشل تحميل الفاتورة", "error"))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <p className="text-sm font-bold text-gray-700">الفاتورة غير موجودة</p>
          <Link href="/retailer/orders"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1e6b57]">
            <ArrowRight size={14} /> رجوع للطلبات
          </Link>
        </div>
      </div>
    );
  }

  const orderLabel = order.order_number || `#${order.id}`;
  const paymentLabel = PAYMENT_METHODS[order.payment_method || "cash"] || "الدفع عند الاستلام";
  const payStatus = PAYMENT_STATUS[order.payment_status || "unpaid"] || PAYMENT_STATUS.unpaid;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Topbar />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* أزرار */}
        <div className="print-btn-bar mb-5 flex flex-wrap gap-2">
          <Link href={`/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-[#2e8b73]/40">
            <ArrowRight size={14} /> رجوع للطلب
          </Link>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e6b57]">
            <Printer size={14} /> طباعة الفاتورة
          </button>
        </div>

        {/* الفاتورة */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* الرأس */}
          <div className="border-b-2 border-[#2e8b73] bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black">جُمْلَتِي</h1>
                <p className="mt-1 text-xs opacity-90">نظام الطلبات بين السوبرماركت والجملة</p>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-90">فاتورة رقم</p>
                <p className="text-lg font-black">#{orderLabel}</p>
              </div>
            </div>
          </div>

          {/* البيانات الأساسية */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 p-5 md:grid-cols-4">
            <InfoBox icon={<Calendar size={14} />} label="التاريخ" value={String(order.created_at || "").slice(0, 16)} />
            <InfoBox icon={<Store size={14} />} label="تاجر الجملة" value={order.supplier_name || "—"} />
            <InfoBox icon={<User size={14} />} label="السوبرماركت" value={order.retailer_name || "—"} />
            <InfoBox icon={<Truck size={14} />} label="المندوب" value={order.delivery_name || "—"} />
          </div>

          {/* العنوان */}
          {order.delivery_address && (
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
                <div>
                  <p className="text-[10px] font-bold text-gray-500">عنوان التوصيل</p>
                  <p className="mt-0.5 text-sm text-gray-800">{order.delivery_address}</p>
                </div>
              </div>
            </div>
          )}

          {/* الأصناف */}
          <div className="border-b border-gray-100">
            <div className="bg-gray-50 px-5 py-3">
              <h2 className="text-sm font-black text-gray-900">الأصناف ({items.length})</h2>
            </div>
            {items.length === 0 ? (
              <p className="p-6 text-center text-xs text-gray-400">لا توجد أصناف</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-right">المنتج</th>
                    <th className="px-3 py-2 text-center">الكمية</th>
                    <th className="px-3 py-2 text-center">السعر</th>
                    <th className="px-3 py-2 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {items.map((it) => {
                    const price = Number(it.unit_price ?? it.price ?? 0);
                    return (
                      <tr key={it.id}>
                        <td className="px-3 py-3 text-right font-medium text-gray-800">{it.product_name}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{it.quantity}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{formatCurrency(price)}</td>
                        <td className="px-3 py-3 text-left font-bold text-[#2e8b73]">{formatCurrency(it.subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* الإجمالي */}
          <div className="border-b border-gray-100 p-5">
            <div className="ml-auto max-w-sm space-y-2 text-sm">
              {order.subtotal !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المجموع الفرعي</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
              )}
              {order.delivery_fee !== undefined && order.delivery_fee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">التوصيل</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
              {order.commission !== undefined && order.commission > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">عمولة المنصة (تُحسب للتاجر)</span>
                  <span className="text-gray-500">- {formatCurrency(order.commission)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t-2 border-[#2e8b73] pt-2">
                <span className="text-base font-black text-gray-900">الإجمالي</span>
                <span className="text-xl font-black text-[#2e8b73]">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#2e8b73]" />
              <div>
                <p className="text-[10px] font-bold text-gray-500">طريقة الدفع</p>
                <p className="text-sm font-bold text-gray-900">{paymentLabel}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${payStatus.cls}`}>
              {payStatus.label}
            </span>
          </div>

          {/* الفوتر */}
          <div className="border-t border-dashed border-gray-200 p-5 text-center">
            <p className="text-xs text-gray-500">
              شكراً لتعاملكم مع جُمْلَتِي 🌿
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              فاتورة إلكترونية — لا تحتاج ختم أو توقيع
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          .print-btn-bar { display: none !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-gray-400">
        {icon}
        <p className="text-[10px] font-bold">{label}</p>
      </div>
      <p className="truncate text-xs font-bold text-gray-900">{value}</p>
    </div>
  );
}
