"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Truck, Package, MapPin, CheckCircle2, Store, Calendar, History } from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  delivery_address?: string;
  supplier_name?: string;
  retailer_name?: string;
  delivered_at?: string;
  picked_up_at?: string;
  created_at: string;
}

type TopTab = "active" | "history";
type FilterKey = "active" | "shipped" | "picked_up" | "delivered";

export default function DeliveryTasksPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("active");
  const [filter, setFilter] = useState<FilterKey>("active");
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

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast("تم التحديث ✅", "success");
      fetchOrders();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "فشل التحديث", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  const delivered = orders.filter((o) => o.status === "delivered");
  const shipped = orders.filter((o) => o.status === "shipped");
  const pickedUp = orders.filter((o) => o.status === "picked_up");
  const active = [...shipped, ...pickedUp];
  const counts = {
    active: active.length,
    shipped: shipped.length,
    picked_up: pickedUp.length,
    delivered: delivered.length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مهامي</h1>
          <p className="text-sm text-gray-500">تابع مهام التوصيل وأكّد التسليم</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTopTab("active")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${topTab === "active" ? "bg-[#2e8b73] text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"}`}>
            <Truck size={14} /> المهام {counts.active > 0 && `(${counts.active})`}
          </button>
          <button onClick={() => setTopTab("history")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${topTab === "history" ? "bg-[#2e8b73] text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"}`}>
            <History size={14} /> السجل {counts.delivered > 0 && `(${counts.delivered})`}
          </button>
        </div>

        {topTab === "active" ? (
          <ActiveTasksView
            counts={counts} filter={filter} setFilter={setFilter}
            shipped={shipped} pickedUp={pickedUp} delivered={delivered}
            updateStatus={updateStatus}
          />
        ) : (
          <HistoryView orders={delivered} />
        )}
      </div>
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "active",    label: "النشطة" },
  { key: "shipped",   label: "بانتظار الاستلام" },
  { key: "picked_up", label: "معي الآن" },
  { key: "delivered", label: "المسلّمة" },
];

function ActiveTasksView({ counts, filter, setFilter, shipped, pickedUp, delivered, updateStatus }: any) {
  const filtered =
    filter === "active" ? [...shipped, ...pickedUp] :
    filter === "shipped" ? shipped :
    filter === "picked_up" ? pickedUp : delivered;

  return (
    <>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === f.key
                ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
                : "border border-gray-100 bg-white text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#1e6b57]"
            }`}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <span className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === f.key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
            <Package className="h-7 w-7 text-[#2e8b73]" />
          </div>
          <p className="text-sm font-bold text-gray-800">لا توجد مهام في هذا التصنيف</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o: Order) => {
            const st = getStatusInfo(o.status);
            const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
            return (
              <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">{orderLabel}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>{st.label}</span>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Store size={11} />
                      <span className="truncate">{o.supplier_name || "تاجر جملة"}</span>
                    </p>
                    {o.delivery_address && (
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-gray-600">
                        <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{o.delivery_address}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-left flex-shrink-0">
                    <div className="text-base font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</div>
                  </div>
                </div>

                {o.status === "shipped" && (
                  <div className="flex gap-2 border-t border-gray-50 pt-3">
                    <button onClick={() => updateStatus(o.id, "picked_up")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95">
                      <Package size={14} /> استلمت الطلب
                    </button>
                  </div>
                )}

                {o.status === "picked_up" && (
                  <div className="flex gap-2 border-t border-gray-50 pt-3">
                    <button onClick={() => updateStatus(o.id, "delivered")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95">
                      <CheckCircle2 size={14} /> تم التسليم
                    </button>
                  </div>
                )}

                {o.status === "delivered" && (
                  <div className="flex items-center justify-center gap-1.5 border-t border-gray-50 pt-3 text-xs font-bold text-[#1e6b57]">
                    <CheckCircle2 size={14} /> تم التسليم بنجاح
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

function HistoryView({ orders }: { orders: Order[] }) {
  const totalValue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
          <CheckCircle2 className="h-7 w-7 text-[#2e8b73]" />
        </div>
        <p className="text-sm font-bold text-gray-800">لا توجد مهام مكتملة بعد</p>
        <p className="mt-1 text-xs text-gray-500">ستظهر هنا عند إتمام أول مهمة</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-4">
        <p className="text-xs text-[#1e6b57]">إجمالي قيمة المهام المكتملة</p>
        <p className="mt-1 text-2xl font-black text-[#1e6b57]">{formatCurrency(totalValue)}</p>
        <p className="mt-0.5 text-[11px] text-[#1e6b57]/70">{orders.length} مهمة</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => {
          const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
          const deliveredDate = o.delivered_at || o.created_at;
          return (
            <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#2e8b73]" />
                    <span className="text-sm font-black text-gray-900">{orderLabel}</span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Store size={11} />
                    <span className="truncate">{o.supplier_name || "تاجر جملة"}</span>
                  </p>
                  {o.delivery_address && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={11} />
                      <span className="truncate">{o.delivery_address}</span>
                    </p>
                  )}
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="text-base font-black text-[#2e8b73]">
                    {formatCurrency(o.total_amount)}
                  </div>
                  <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-gray-400">
                    <Calendar size={10} />
                    {new Date(deliveredDate).toLocaleDateString("ar-IQ")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
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
