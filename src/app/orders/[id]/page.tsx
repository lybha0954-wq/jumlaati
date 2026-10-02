"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ArrowRight, Package, Store, Truck, User,
  MapPin, Calendar, Phone, MessageCircle,
  CheckCircle2, Clock, XCircle, FileText, Copy, Share2,
} from "lucide-react";
import { getStatusInfo } from "@/lib/constants/order-status";

interface OrderItem {
  id: string; product_name: string; quantity: number;
  price: number; unit_price?: number; subtotal: number;
}

interface Order {
  id: string; status: string; total_amount: number; created_at: string;
  retailer_name?: string; retailer_phone?: string;
  supplier_name?: string; supplier_phone?: string;
  delivery_name?: string; delivery_phone?: string;
  delivery_address?: string;
  accepted_at?: string | null;
  shipped_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const orderNumber = order ? String(order.id).slice(0, 8) : "";
  const fullNumber = order ? String(order.id) : "";

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(fullNumber);
      setCopied(true);
      showToast("✅ تم نسخ رقم الطلب", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("فشل النسخ", "error");
    }
  };

  const shareWhatsapp = () => {
    if (!order) return;
    if (!order) return;
    const text = `مرحباً، تابع طلبي في جُمْلَتِي\n\n📦 رقم الطلب: ${orderNumber}\n📅 التاريخ: ${new Date(order.created_at).toLocaleDateString("ar-IQ")}\n💰 الإجمالي: ${order.total_amount} د.ع\n📌 الحالة: ${getStatusInfo(order.status).label}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

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
      .catch(() => showToast("فشل تحميل الطلب", "error"))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Link href="/retailer/orders"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#2e8b73]">
            <ArrowRight size={16} /> رجوع
          </Link>
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
            <p className="text-sm font-bold text-gray-700">الطلب غير موجود</p>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="javascript:history.back()"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
            <ArrowRight size={18} />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-gray-900">
                طلب #{orderNumber}
              </h1>
              <button onClick={copyNumber}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-[#2e8b73]"
                aria-label="نسخ الرقم">
                <Copy size={12} />
              </button>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={11} />
              {new Date(order.created_at).toLocaleDateString("ar-IQ", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-shrink-0 gap-1">
            <button onClick={shareWhatsapp}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
              aria-label="مشاركة عبر واتساب">
              <Share2 size={16} />
            </button>
            <a href={`/invoice/${order.id}`} target="_blank" rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]"
              aria-label="الفاتورة">
              <FileText size={18} />
            </a>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-black text-gray-900">مراحل الطلب</h2>
          <Timeline status={order.status} order={order} />
        </div>

        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-sm font-black text-gray-900">الأطراف</h2>
          <PartyRow icon={<Store size={16} />} label="تاجر الجملة" name={order.supplier_name} phone={order.supplier_phone} color="emerald" />
          <PartyRow icon={<User size={16} />} label="السوبرماركت" name={order.retailer_name} phone={order.retailer_phone} color="blue" />
          {order.delivery_name && (
            <PartyRow icon={<Truck size={16} />} label="المندوب" name={order.delivery_name} phone={order.delivery_phone} color="amber" />
          )}
        </div>

        {order.delivery_address && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
              <MapPin size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-xs font-bold text-gray-500">عنوان التوصيل</p>
              <p className="text-sm text-gray-800">{order.delivery_address}</p>
            </div>
          </div>
        )}

        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-sm font-black text-gray-900">الأصناف ({items.length})</h2>
          </div>

          {items.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">لا توجد أصناف مسجّلة</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((it) => {
                const price = Number(it.unit_price ?? it.price ?? 0);
                return (
                  <li key={it.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                        <Package size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{it.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(price)} × {it.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#2e8b73]">
                      {formatCurrency(it.subtotal)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4">
            <span className="text-sm font-bold text-gray-700">الإجمالي</span>
            <span className="text-lg font-black text-[#2e8b73]">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ status, order }: { status: string; order: Order }) {
  const steps = [
    {
      key: "pending",
      label: "تم إنشاء الطلب",
      desc: "استلمنا طلبك بنجاح",
      icon: Package,
      time: order.created_at,
    },
    {
      key: "accepted",
      label: "قبله المورد",
      desc: "تاجر الجملة وافق على طلبك",
      icon: CheckCircle2,
      time: order.accepted_at,
    },
    {
      key: "shipped",
      label: "قيد التوصيل",
      desc: "الطلب في الطريق إليك",
      icon: Truck,
      time: order.shipped_at,
    },
    {
      key: "picked_up",
      label: "مع المندوب",
      desc: "المندوب استلم الطلب",
      icon: User,
      time: order.picked_up_at,
    },
    {
      key: "delivered",
      label: "تم التسليم",
      desc: "وصل الطلب إلى الموقع",
      icon: CheckCircle2,
      time: order.delivered_at,
    },
  ];

  const orderIdx: Record<string, number> = {
    pending: 0, accepted: 1, shipped: 2, picked_up: 3, delivered: 4,
  };
  const currentIdx = orderIdx[status] ?? -1;

  // ═══ حالة ملغي ═══
  if (status === "cancelled") {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/60 dark:bg-red-950/30">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
          <XCircle size={28} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-red-700 dark:text-red-300">
            تم إلغاء الطلب
          </p>
          <p className="mt-1 text-xs text-red-600/70 dark:text-red-400/70">
            {formatDate(order.cancelled_at || order.created_at)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative space-y-1">
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const pending = idx > currentIdx;
        const Icon = step.icon;
        const isLast = idx === steps.length - 1;

        // ═══ ألوان الحالة ═══
        const circleClass = done
          ? "bg-gradient-to-br from-[#3a9d82] to-[#1e6b57] text-white shadow-md shadow-[#2e8b73]/30"
          : active
            ? "bg-[#e8f4f0] text-[#2e8b73] ring-4 ring-[#2e8b73]/20 dark:bg-[#1e3a33] dark:text-[#6ecdb0]"
            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600";

        return (
          <li key={step.key} className="relative flex gap-4">
            {/* ═══ الخط الرأسي ═══ */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute right-[21px] top-11 w-0.5 rounded-full transition-all ${
                  done
                    ? "bg-gradient-to-b from-[#2e8b73] to-[#2e8b73]/40"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                style={{ bottom: "-4px" }}
              />
            )}

            {/* ═══ الدائرة + الأيقونة ═══ */}
            <div className="relative flex-shrink-0">
              <div
                className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${circleClass}`}
              >
                <Icon size={20} strokeWidth={done || active ? 2.5 : 2} />

                {/* علامة ✓ صغيرة للمكتمل */}
                {done && (
                  <span className="absolute -bottom-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#2e8b73] dark:border-gray-900">
                    <CheckCircle2 size={9} className="text-white" strokeWidth={3} />
                  </span>
                )}

                {/* نبض للحالة النشطة */}
                {active && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#2e8b73]/20" />
                )}
              </div>
            </div>

            {/* ═══ المحتوى ═══ */}
            <div
              className={`flex-1 pb-5 transition-opacity ${
                pending ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p
                  className={`text-sm font-black ${
                    done || active
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {/* شارة الوقت */}
                {step.time && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      done
                        ? "bg-[#e8f4f0] text-[#1e6b57] dark:bg-[#1e3a33] dark:text-[#6ecdb0]"
                        : active
                          ? "bg-[#2e8b73] text-white"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    }`}
                  >
                    <Clock size={9} />
                    {formatDate(step.time)}
                  </span>
                )}
              </div>

              <p
                className={`mt-1 text-xs leading-relaxed ${
                  done || active
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {step.desc}
              </p>

              {/* ملاحظة "قيد التنفيذ" للحالة النشطة */}
              {active && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e8f4f0] px-2.5 py-1 text-[10px] font-bold text-[#1e6b57] dark:bg-[#1e3a33] dark:text-[#6ecdb0]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e8b73] opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2e8b73]"></span>
                  </span>
                  قيد التنفيذ الآن
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function PartyRow({ icon, label, name, phone, color }: any) {
  if (!name) return null;
  const colors: any = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };
  const waLink = phone
    ? `https://wa.me/${String(phone).replace(/\D/g, "").replace(/^0+/, "964")}`
    : null;

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500">{label}</p>
          <p className="truncate text-sm font-bold text-gray-900">{name}</p>
        </div>
      </div>
      {phone && (
        <div className="flex items-center gap-1">
          <a href={`tel:${phone}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
            <Phone size={13} />
          </a>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600">
              <MessageCircle size={13} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
function formatDate(s: string | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("ar-IQ", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch { return s; }
}
