"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { getStatusInfo } from "@/lib/constants/order-status";
import { usePaginatedOrders } from "@/hooks/usePaginatedOrders";
import {
  ShoppingCart, Search, ArrowLeft, Store, Truck, User,
  Package, Loader2,
} from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
  retailer_name?: string;
  supplier_name?: string;
  delivery_name?: string;
}

type Filter = "all" | "pending" | "active" | "delivered" | "cancelled";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all", label: "الكل", color: "bg-gray-100" },
  { key: "pending", label: "جديدة", color: "bg-amber-500" },
  { key: "active", label: "قيد التنفيذ", color: "bg-purple-500" },
  { key: "delivered", label: "مكتملة", color: "bg-[#2e8b73]" },
  { key: "cancelled", label: "ملغية", color: "bg-red-500" },
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const {
    items: orders,
    total,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  } = usePaginatedOrders<Order>({ limit: 20 });

  if (error) showToast(error, "error");

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) => ["accepted", "shipped", "picked_up"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter === "pending") list = list.filter((o) => o.status === "pending");
    else if (filter === "active") list = list.filter((o) => ["accepted", "shipped", "picked_up"].includes(o.status));
    else if (filter === "delivered") list = list.filter((o) => o.status === "delivered");
    else if (filter === "cancelled") list = list.filter((o) => o.status === "cancelled");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        String(o.id).includes(q) ||
        (o.order_number || "").toLowerCase().includes(q) ||
        (o.retailer_name || "").toLowerCase().includes(q) ||
        (o.supplier_name || "").toLowerCase().includes(q) ||
        (o.delivery_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filter, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mb-5"><KPISkeleton count={5} /></div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
            <ShoppingCart size={22} className="text-[#2e8b73]" /> الطلبات
          </h1>
          <p className="text-sm text-gray-500">{total} طلب في النظام</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-2xl border p-3 text-right transition-all ${
                filter === f.key
                  ? "border-[#2e8b73]/40 bg-[#e8f4f0]"
                  : "border-gray-100 bg-white hover:border-[#2e8b73]/20"
              }`}>
              <div className={`mb-1.5 h-1.5 w-6 rounded-full ${f.color}`} />
              <p className="text-[10px] text-gray-500">{f.label}</p>
              <p className="text-lg font-black text-gray-900">{counts[f.key]}</p>
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 focus-within:border-[#2e8b73]/40">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو الأسماء..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="لا توجد طلبات"
            description={search || filter !== "all" ? "جرّب تغيير الفلتر أو البحث" : "ستظهر الطلبات هنا عند إنشائها"}
            color="gray"
          />
        ) : (
          <>
            <div className="space-y-2">
              {filtered.map((o) => {
                const st = getStatusInfo(o.status);
                const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
                return (
                  <Link key={o.id} href={`/orders/${o.id}`}
                    className="block rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-gray-900">{orderLabel}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                          {o.supplier_name && (
                            <span className="inline-flex items-center gap-1">
                              <Store size={11} /> <span className="truncate">{o.supplier_name}</span>
                            </span>
                          )}
                          {o.retailer_name && (
                            <span className="inline-flex items-center gap-1">
                              <User size={11} /> <span className="truncate">{o.retailer_name}</span>
                            </span>
                          )}
                          {o.delivery_name && (
                            <span className="inline-flex items-center gap-1">
                              <Truck size={11} /> <span className="truncate">{o.delivery_name}</span>
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {String(o.created_at || "").slice(0, 16)}
                        </p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-base font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</p>
                        <ArrowLeft size={14} className="mt-1 ml-auto text-gray-300" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e8b73] bg-white px-6 py-3 text-sm font-bold text-[#2e8b73] transition-all hover:bg-[#e8f4f0] active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      تحميل المزيد ({orders.length} من {total})
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
