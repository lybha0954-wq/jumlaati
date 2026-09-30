"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Package, ArrowLeft, Store, Check, X, Truck, Download, UserPlus,
} from "lucide-react";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_number?: string;
  retailer_name?: string;
  delivery_name?: string;
}

interface JoinRequest {
  id: number;
  retailer_name?: string;
  retailer_phone?: string;
  status?: string;
}

type TopTab = "orders" | "requests";
type FilterKey = "all" | "pending" | "active" | "delivered";

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("orders");
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, requestsRes] = await Promise.all([
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/relationships").then((r) => (r.ok ? r.json() : [])),
      ]);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setRequests(Array.isArray(requestsRes) ? requestsRes : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateOrderStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { showToast("تم التحديث ✅", "success"); fetchData(); }
    else showToast("فشل التحديث", "error");
  };

  const handleRequest = async (id: number, action: "accept" | "reject") => {
    const res = await fetch(`/api/relationships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      showToast(action === "accept" ? "تم قبول الطلب" : "تم رفض الطلب", "success");
      fetchData();
    } else {
      showToast("حدث خطأ", "error");
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">الطلبات</h1>
            <p className="text-sm text-gray-500">تابع الطلبات الواردة وطلبات الانضمام</p>
          </div>
          <a href="/api/export/my-orders"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#2e8b73]/40 hover:text-[#2e8b73]">
            <Download size={14} /> CSV
          </a>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTopTab("orders")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              topTab === "orders" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Package size={14} /> الطلبات ({orders.length})
          </button>
          <button onClick={() => setTopTab("requests")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              topTab === "requests" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <UserPlus size={14} /> طلبات الانضمام {requests.length > 0 && `(${requests.length})`}
          </button>
        </div>

        {topTab === "orders" ? (
          <OrdersView
            orders={orders}
            filter={filter}
            setFilter={setFilter}
            updateStatus={updateOrderStatus}
          />
        ) : (
          <RequestsView requests={requests} onAction={handleRequest} />
        )}
      </div>
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "جديدة" },
  { key: "active", label: "قيد التنفيذ" },
  { key: "delivered", label: "مكتملة" },
];

function OrdersView({ orders, filter, setFilter, updateStatus }: any) {
  const counts = {
    all: orders.length,
    pending: orders.filter((o: Order) => o.status === "pending").length,
    active: orders.filter((o: Order) => ["accepted","shipped","picked_up"].includes(o.status)).length,
    delivered: orders.filter((o: Order) => o.status === "delivered").length,
  };
  const filtered = orders.filter((o: Order) => {
    if (filter === "all") return true;
    if (filter === "pending") return o.status === "pending";
    if (filter === "active") return ["accepted","shipped","picked_up"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
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
                        <span className="truncate">{o.retailer_name || "سوبرماركت"}</span>
                      </p>
                      {o.delivery_name && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                          <Truck size={11} />
                          <span className="truncate">{o.delivery_name}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-base font-black text-[#2e8b73]">
                        {formatCurrency(o.total_amount)}
                      </div>
                      <ArrowLeft size={14} className="mt-1 ml-auto text-gray-300" />
                    </div>
                  </div>
                </Link>

                {o.status === "pending" && (
                  <div className="flex gap-2 border-t border-gray-50 pt-3">
                    <button onClick={() => updateStatus(o.id, "accepted")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95">
                      <Check size={14} /> قبول الطلب
                    </button>
                    <button onClick={() => updateStatus(o.id, "cancelled")}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95">
                      <X size={14} /> رفض
                    </button>
                  </div>
                )}

                {o.status === "accepted" && (
                  <div className="border-t border-gray-50 pt-3">
                    <button onClick={() => updateStatus(o.id, "shipped")}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95">
                      <Truck size={14} /> إرسال للتوصيل
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

function RequestsView({ requests, onAction }: any) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
          <UserPlus className="h-7 w-7 text-[#2e8b73]" />
        </div>
        <p className="text-sm font-bold text-gray-800">لا توجد طلبات انضمام</p>
        <p className="mt-1 text-xs text-gray-400">عندما يرسل سوبرماركت طلباً، سيظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((r: JoinRequest) => {
        const name = r.retailer_name || "سوبرماركت";
        const initial = name.charAt(0);
        return (
          <div key={r.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e8f4f0] text-lg font-black text-[#2e8b73]">
                {initial}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-gray-900">{name}</h3>
                {r.retailer_phone && (
                  <p className="truncate text-xs text-gray-500" dir="ltr">{r.retailer_phone}</p>
                )}
                <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  بانتظار الرد
                </span>
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-1.5">
              <button onClick={() => onAction(r.id, "accept")}
                className="flex items-center gap-1 rounded-lg bg-[#2e8b73] px-3 py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95">
                <Check size={13} /> قبول
              </button>
              <button onClick={() => onAction(r.id, "reject")}
                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95">
                <X size={13} /> رفض
              </button>
            </div>
          </div>
        );
      })}
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
