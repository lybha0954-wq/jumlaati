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
  CheckCircle2, Clock, XCircle, FileText,
} from "lucide-react";

interface OrderItem {
  id: string; product_name: string; quantity: number;
  price: number; unit_price?: number; subtotal: number;
}

interface Order {
  id: string; status: string; total: number; created_at: string;
  retailer_name?: string; retailer_phone?: string;
  supplier_name?: string; supplier_phone?: string;
  delivery_name?: string; delivery_phone?: string;
  delivery_address?: string;
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
                طلب #{String(order.id).slice(0, 8)}
              </h1>
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

          <a href={`/invoice.html?id=${order.id}`} target="_blank" rel="noreferrer"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
            <FileText size={18} />
          </a>
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
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ status, order }: { status: string; order: Order }) {
  const steps = [
    { key: "reviewing",  label: "تم إنشاء الطلب",    icon: Package,      time: order.created_at },
    { key: "delivering", label: "قيد التوصيل",        icon: Truck,        time: null },
    { key: "completed",  label: "تم التسليم",         icon: CheckCircle2, time: null },
  ];

  const orderIdx: Record<string, number> = {
    reviewing: 0, delivering: 1, completed: 2,
  };
  const currentIdx = orderIdx[status] ?? -1;

  if (status === "cancelled") {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
          <XCircle size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">تم إلغاء الطلب</p>
          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative space-y-4">
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const Icon = step.icon;
        return (
          <li key={step.key} className="relative flex items-start gap-3">
            {idx < steps.length - 1 && (
              <span
                className={`absolute right-4 top-10 w-0.5 ${done ? "bg-[#2e8b73]" : "bg-gray-100"}`}
                style={{ height: "calc(100% - 8px)" }}
              />
            )}
            <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all ${
              done ? "bg-[#2e8b73] text-white"
                : active ? "bg-[#e8f4f0] text-[#2e8b73] ring-2 ring-[#2e8b73]/30"
                : "bg-gray-100 text-gray-400"
            }`}>
              <Icon size={16} strokeWidth={done ? 2.5 : 2} />
            </div>
            <div className="flex-1 pt-1.5">
              <p className={`text-sm font-bold ${done || active ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              {step.time && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={10} /> {formatDate(step.time)}
                </p>
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

function getStatusInfo(status: string) {
  const map: Record<string, any> = {
    reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700" },
    delivering: { label: "قيد التوصيل", className: "bg-purple-50 text-purple-700" },
    completed: { label: "تم التسليم", className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي", className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("ar-IQ", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch { return s; }
}
