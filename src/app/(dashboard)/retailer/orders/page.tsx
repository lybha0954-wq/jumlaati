"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Package, ArrowLeft, Store, Truck, XCircle, FileText, Printer,
  CheckCircle2, Wallet, TrendingUp, ShoppingBag,
} from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  created_at: string;
  delivered_at?: string;
  supplier_name?: string;
  delivery_name?: string;
}

type TopTab = "orders" | "invoices" | "purchases";
type FilterKey = "all" | "pending" | "active" | "delivered" | "cancelled";

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("orders");
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const cancelOrder = async (id: number) => {
    if (!confirm("هل أنت متأكد من إلغاء الطلب؟")) return;
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      showToast("تم إلغاء الطلب", "success");
      fetchOrders();
    } else {
      showToast("فشل الإلغاء", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  const invoiceOrders = orders.filter((o) =>
    ["shipped", "picked_up", "delivered"].includes(o.status)
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">طلباتي</h1>
          <p className="text-sm text-gray-500">تابع الطلبات، الفواتير، والمشتريات</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTopTab("orders")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "orders" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Package size={14} /> الطلبات ({orders.length})
          </button>
          <button onClick={() => setTopTab("invoices")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "invoices" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <FileText size={14} /> الفواتير ({invoiceOrders.length})
          </button>
          <button onClick={() => setTopTab("purchases")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "purchases" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Wallet size={14} /> المشتريات
          </button>
        </div>

        {topTab === "orders" && (
          <OrdersView orders={orders} filter={filter} setFilter={setFilter} onCancel={cancelOrder} />
        )}
        {topTab === "invoices" && <InvoicesView orders={invoiceOrders} />}
        {topTab === "purchases" && <PurchasesView orders={orders} />}
      </div>
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",        label: "الكل" },
  { key: "pending",    label: "جديدة" },
  { key: "active",     label: "قيد التنفيذ" },
  { key: "delivered",  label: "تم التسليم" },
  { key: "cancelled",  label: "ملغية" },
];

function OrdersView({ orders, filter, setFilter, onCancel }: any) {
  const counts = {
    all: orders.length,
    pending: orders.filter((o: Order) => o.status === "pending").length,
    active: orders.filter((o: Order) => ["accepted","shipped","picked_up"].includes(o.status)).length,
    delivered: orders.filter((o: Order) => o.status === "delivered").length,
    cancelled: orders.filter((o: Order) => o.status === "cancelled").length,
  };
  const filtered = orders.filter((o: Order) => {
    if (filter === "all") return true;
    if (filter === "pending") return o.status === "pending";
    if (filter === "active") return ["accepted","shipped","picked_up"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  return (
    <>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === f.key
                ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
                : "border border-gray-100 bg-white text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#1e6b57]"
            }`}>
            {f.label}
            {counts[f.key] > 0 && (
              <span className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === f.key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
              }`}>{counts[f.key]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
            <Package className="h-7 w-7 text-[#2e8b73]" />
          </div>
          <p className="text-sm font-bold text-gray-800">لا توجد طلبات في هذا التصنيف</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o: Order) => {
            const st = getStatusInfo(o.status);
            const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
            const canCancel = o.status === "pending";
            return (
              <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-[#2e8b73]/30">
                <Link href={`/orders/${o.id}`} className="block">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">{orderLabel}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Store size={11} />
                        <span className="truncate">{o.supplier_name || "تاجر جملة"}</span>
                      </p>
                      {o.delivery_name && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                          <Truck size={11} />
                          <span className="truncate">{o.delivery_name}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-base font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</div>
                      <ArrowLeft size={14} className="mt-1 ml-auto text-gray-300" />
                    </div>
                  </div>
                </Link>

                {canCancel && (
                  <div className="border-t border-gray-50 pt-3">
                    <button onClick={() => onCancel(o.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95">
                      <XCircle size={14} /> إلغاء الطلب
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function InvoicesView({ orders }: { orders: Order[] }) {
  const totalInvoiced = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
          <FileText className="h-7 w-7 text-[#2e8b73]" />
        </div>
        <p className="text-sm font-bold text-gray-800">لا توجد فواتير بعد</p>
        <p className="mt-1 text-xs text-gray-500">ستظهر هنا عند استلام أول طلب</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-4">
        <p className="text-xs text-[#1e6b57]">إجمالي قيمة الفواتير</p>
        <p className="mt-1 text-2xl font-black text-[#1e6b57]">{formatCurrency(totalInvoiced)}</p>
        <p className="mt-0.5 text-[11px] text-[#1e6b57]/70">{orders.length} فاتورة</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => {
          const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
          const isDelivered = o.status === "delivered";
          return (
            <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-[#2e8b73]/30">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                    isDelivered ? "bg-[#e8f4f0] text-[#2e8b73]" : "bg-blue-50 text-blue-600"
                  }`}>
                    {isDelivered ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900">{orderLabel}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                      <Store size={11} />
                      <span className="truncate">{o.supplier_name || "تاجر جملة"}</span>
                    </p>
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="text-base font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isDelivered ? "bg-[#e8f4f0] text-[#1e6b57]" :
                    o.status === "picked_up" ? "bg-indigo-50 text-indigo-700" : "bg-purple-50 text-purple-700"
                  }`}>
                    {isDelivered ? "مسلّمة" : o.status === "picked_up" ? "مع المندوب" : "قيد التوصيل"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 border-t border-gray-50 pt-3">
                <Link href={`/orders/${o.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-700 hover:border-[#2e8b73]/30 hover:bg-[#e8f4f0] hover:text-[#1e6b57]">
                  <ArrowLeft size={13} /> التفاصيل
                </Link>
                <Link href={`/invoices/${o.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57]">
                  <Printer size={13} /> طباعة
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PurchasesView({ orders }: { orders: Order[] }) {
  const delivered = orders.filter((o) => o.status === "delivered");
  const active = orders.filter((o) => ["pending", "accepted", "shipped", "picked_up"].includes(o.status));
  const totalSpent = delivered.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const activeAmount = active.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const avgOrder = delivered.length > 0 ? Math.round(totalSpent / delivered.length) : 0;

  const bySupplier: Record<string, { name: string; count: number; total: number }> = {};
  delivered.forEach((o) => {
    const key = o.supplier_name || "غير معروف";
    if (!bySupplier[key]) bySupplier[key] = { name: key, count: 0, total: 0 };
    bySupplier[key].count += 1;
    bySupplier[key].total += Number(o.total_amount || 0);
  });
  const suppliers = Object.values(bySupplier).sort((a, b) => b.total - a.total);

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <KpiBox icon={<Wallet size={16} />} label="إجمالي المشتريات" value={formatCurrency(totalSpent)} color="emerald" />
        <KpiBox icon={<TrendingUp size={16} />} label="متوسط الطلب" value={formatCurrency(avgOrder)} color="amber" />
        <KpiBox icon={<Package size={16} />} label="طلبات نشطة" value={String(active.length)} sub={activeAmount > 0 ? formatCurrency(activeAmount) : undefined} color="blue" />
        <KpiBox icon={<ShoppingBag size={16} />} label="طلبات مكتملة" value={String(delivered.length)} color="purple" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900">المشتريات حسب التاجر</h2>
        </div>
        {suppliers.length === 0 ? (
          <div className="p-8 text-center">
            <Store className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد مشتريات مكتملة بعد</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {suppliers.map((s, i) => {
              const percent = totalSpent > 0 ? Math.round((s.total / totalSpent) * 100) : 0;
              return (
                <li key={i} className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-sm font-black text-[#2e8b73]">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.count} طلب</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(s.total)}</p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#2e8b73] transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function KpiBox({ icon, label, value, sub, color }: any) {
  const colors: Record<string, string> = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}

function getStatusInfo(status: string) {
  const map: Record<string, any> = {
    pending:   { label: "جديد",           className: "bg-amber-50 text-amber-700" },
    accepted:  { label: "مقبول",          className: "bg-blue-50 text-blue-700" },
    shipped:   { label: "قيد التوصيل",    className: "bg-purple-50 text-purple-700" },
    picked_up: { label: "مع المندوب",     className: "bg-indigo-50 text-indigo-700" },
    delivered: { label: "تم التسليم",     className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي",           className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}
