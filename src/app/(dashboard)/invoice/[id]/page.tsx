"use client";

import { use, useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ArrowRight, Printer, Package, Store, User, Truck, MapPin,
  Calendar, CheckCircle2, XCircle, Phone, Shield, Percent, Heart,
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
  unpaid:   { label: "غير مدفوع",   cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900" },
  partial:  { label: "جزئي",         cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900" },
  paid:     { label: "مدفوع",        cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" },
  refunded: { label: "مسترد",        cls: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Topbar />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Topbar />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">الفاتورة غير موجودة</p>
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
  const dateStr = new Date(order.created_at).toLocaleDateString("ar-IQ", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  // ═══ QR Code — يُولَّد عبر خدمة مجانية ═══
  const invoiceUrl = typeof window !== "undefined"
    ? `${window.location.origin}/invoice/${order.id}`
    : `https://jumlati.pages.dev/invoice/${order.id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(invoiceUrl)}&color=2e8b73&bgcolor=ffffff`;

  return (
    <div className="min-h-screen bg-gray-100 pb-20 dark:bg-gray-950">
      <Topbar />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* أزرار — تختفي عند الطباعة */}
        <div className="print-btn-bar mb-5 flex flex-wrap gap-2">
          <Link href={`/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:border-[#2e8b73]/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <ArrowRight size={14} /> رجوع للطلب
          </Link>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1e6b57] active:scale-95">
            <Printer size={14} /> طباعة الفاتورة
          </button>
        </div>

        {/* ═══════════ الفاتورة ═══════════ */}
        <div className="invoice-container overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">

          {/* ═══════════ الرأس ═══════════ */}
          <div className="relative overflow-hidden bg-gradient-to-l from-[#2e8b73] via-[#26795f] to-[#1e6b57] p-6 text-white">
            {/* زخرفة */}
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between gap-4">
              {/* الشعار */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-white/40">
                  <img
                    src="/icons/icon-192.png"
                    alt="جُمْلَتِي"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">جُمْلَتِي</h1>
                  <p className="text-[11px] font-medium text-white/80">نظام الطلبات بين السوبرماركت والجملة</p>
                  <p className="mt-1 text-[10px] text-white/60">jumlati.iq</p>
                </div>
              </div>

              {/* رقم الفاتورة */}
              <div className="text-left">
                <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">فاتورة رقم</p>
                  <p className="mt-0.5 font-mono text-base font-black text-white" dir="ltr">
                    {orderLabel}
                  </p>
                </div>
                <p className="mt-2 text-[10px] text-white/70">فاتورة إلكترونية</p>
              </div>
            </div>
          </div>

          {/* ═══════════ QR + رقم التحقق ═══════════ */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <img
                src={qrSrc}
                alt="QR"
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700"
              />
              <div>
                <p className="flex items-center gap-1.5 text-xs font-black text-gray-900 dark:text-gray-100">
                  <Shield size={12} className="text-[#2e8b73]" />
                  تحقق من صحة الفاتورة
                </p>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                  امسح الرمز للتأكد من مصدرها
                </p>
                <p className="mt-1 font-mono text-[10px] text-gray-400" dir="ltr">
                  ID: {String(order.id).padStart(8, "0")}
                </p>
              </div>
            </div>
            <div className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${payStatus.cls}`}>
              {payStatus.label}
            </div>
          </div>

          {/* ═══════════ البيانات الأساسية ═══════════ */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 p-5 md:grid-cols-4 dark:border-gray-800">
            <InfoBox
              icon={<Calendar size={14} />}
              label="التاريخ"
              value={dateStr}
            />
            <InfoBox
              icon={<Store size={14} />}
              label="تاجر الجملة"
              value={order.supplier_name || "—"}
            />
            <InfoBox
              icon={<User size={14} />}
              label="السوبرماركت"
              value={order.retailer_name || "—"}
            />
            <InfoBox
              icon={<Truck size={14} />}
              label="المندوب"
              value={order.delivery_name || "—"}
            />
          </div>

          {/* ═══════════ العنوان ═══════════ */}
          {order.delivery_address && (
            <div className="border-b border-gray-100 p-5 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#e8f4f0] dark:bg-[#1e3a33]">
                  <MapPin size={14} className="text-[#2e8b73]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    عنوان التوصيل
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {order.delivery_address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ الأصناف — الجدول ═══════════ */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between bg-gradient-to-l from-[#2e8b73] to-[#26795f] px-5 py-3">
              <h2 className="flex items-center gap-2 text-sm font-black text-white">
                <Package size={14} />
                الأصناف
              </h2>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
                {items.length} صنف
              </span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-xs text-gray-400">لا توجد أصناف مسجّلة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-100/80 text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300">
                      <th className="px-4 py-3 text-right">#</th>
                      <th className="px-4 py-3 text-right">المنتج</th>
                      <th className="border-r border-gray-300 px-4 py-3 text-center dark:border-gray-600">الكمية</th>
                      <th className="px-4 py-3 text-center">سعر الوحدة</th>
                      <th className="px-4 py-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
                    {items.map((it, idx) => {
                      const price = Number(it.unit_price ?? it.price ?? 0);
                      return (
                        <tr
                          key={it.id}
                          className="bg-white transition-colors hover:bg-[#e8f4f0]/40 dark:bg-gray-900 dark:hover:bg-[#1e3a33]/40"
                        >
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100">
                            {it.product_name}
                          </td>
                          <td className="border-r border-gray-200 px-4 py-3 text-center dark:border-gray-700">
                            <span className="inline-flex items-center rounded-full bg-[#e8f4f0] px-2.5 py-0.5 text-xs font-black text-[#1e6b57] dark:bg-[#1e3a33] dark:text-[#6ecdb0]">
                              {it.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400" dir="ltr">
                            {formatCurrency(price)}
                          </td>
                          <td className="px-4 py-3 text-left font-black text-[#2e8b73] dark:text-[#6ecdb0]" dir="ltr">
                            {formatCurrency(it.subtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ═══════════ الإجمالي ═══════════ */}
          <div className="border-b border-gray-100 p-5 dark:border-gray-800">
            <div className="ml-auto max-w-sm space-y-2.5">
              {order.subtotal !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">المجموع الفرعي</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100" dir="ltr">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
              )}
              {order.delivery_fee !== undefined && order.delivery_fee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Truck size={12} />
                    رسوم التوصيل
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100" dir="ltr">
                    {formatCurrency(order.delivery_fee)}
                  </span>
                </div>
              )}
              {order.commission !== undefined && order.commission > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Percent size={10} />
                    عمولة المنصة
                  </span>
                  <span className="text-gray-500 dark:text-gray-500" dir="ltr">
                    - {formatCurrency(order.commission)}
                  </span>
                </div>
              )}

              {/* الإجمالي النهائي — بارز */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] px-4 py-3 text-white shadow-md">
                <span className="text-sm font-black">الإجمالي المستحق</span>
                <span className="text-xl font-black" dir="ltr">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════ طريقة الدفع ═══════════ */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-5 dark:bg-gray-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                <CheckCircle2 size={18} className="text-[#2e8b73]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  طريقة الدفع
                </p>
                <p className="mt-0.5 text-sm font-black text-gray-900 dark:text-gray-100">
                  {paymentLabel}
                </p>
              </div>
            </div>
            {(order.retailer_phone || order.supplier_phone) && (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <Phone size={11} />
                <span dir="ltr">{order.supplier_phone || order.retailer_phone}</span>
              </div>
            )}
          </div>

          {/* ═══════════ الشروط القانونية ═══════════ */}
          <div className="border-t border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-gray-700 dark:text-gray-300">
              <Shield size={12} className="text-[#2e8b73]" />
              شروط وأحكام مختصرة
            </h3>
            <ul className="space-y-1 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              <li>• يُقبل الاسترداد خلال 48 ساعة من الاستلام مع إرفاق صور للمنتج.</li>
              <li>• هذه فاتورة إلكترونية — لا تحتاج ختم أو توقيع.</li>
              <li>• لأي استفسار: <span className="font-bold text-[#2e8b73]">support@jumlati.iq</span></li>
            </ul>
          </div>

          {/* ═══════════ الفوتر ═══════════ */}
          <div className="border-t border-dashed border-gray-200 bg-gradient-to-l from-[#f8fbf9] to-white p-6 text-center dark:border-gray-800 dark:from-gray-900 dark:to-gray-900">
            <p className="flex items-center justify-center gap-1.5 text-sm font-black text-[#2e8b73] dark:text-[#6ecdb0]">
              <Heart size={14} />
              شكراً لتعاملكم مع جُمْلَتِي
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              منصة الجملة والتوصيل في العراق — jumlati.iq
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-gray-400">
              <span>فاتورة إلكترونية معتمدة</span>
              <span className="text-gray-300">•</span>
              <span className="font-mono" dir="ltr">#{String(order.id).padStart(8, "0")}</span>
            </div>
          </div>
        </div>

        {/* ═══════════ Footer صغير ═══════════ */}
        <p className="mt-4 text-center text-[10px] text-gray-400 print-hidden">
          بُني بـ ❤️ في العراق — جُمْلَتِي © 2026
        </p>
      </div>

      {/* ═══════════ Print Styles ═══════════ */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          html, body {
            background: white !important;
          }
          header,
          .print-btn-bar,
          .print-hidden,
          nav.fixed {
            display: none !important;
          }
          .invoice-container {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0 !important;
            page-break-inside: avoid;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════ مكون فرعي ═══════════════ */

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-gray-400">
        <span className="text-[#2e8b73]">{icon}</span>
        <p className="text-[9px] font-black uppercase tracking-wider">{label}</p>
      </div>
      <p className="truncate text-xs font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
