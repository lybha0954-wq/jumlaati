"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { formatCurrency } from "@/lib/utils/currency";
import { getStatusInfo } from "@/lib/constants/order-status";
import { usePaginatedOrders } from "@/hooks/usePaginatedOrders";
import { useToast } from "@/hooks/useToast";
import {
  Package, ArrowLeft, Store, Truck, XCircle, Loader2,
} from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  total_amount: number;
  status: string;
  created_at: string;
  supplier_name?: string;
  delivery_name?: string;
}

type FilterKey = "all" | "pending" | "active" | "delivered" | "cancelled";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "جديدة" },
  { key: "active", label: "قيد التنفيذ" },
  { key: "delivered", label: "تم التسليم" },
  { key: "cancelled", label: "ملغية" },
];

export default function RetailerOrdersPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  const {
    items: orders,
    total,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedOrders<Order>({ limit: 20 });

  const cancelOrder = async (id: number) => {
    if (!confirm("هل أنت متأكد من إلغاء الطلب؟")) return;

    // ═══ Optimistic: نُخفي الطلب فوراً ═══
    const previousOrders = [...orders];
    setOptimisticHidden((prev) => new Set(prev).add(id));

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (res.ok) {
        showToast("تم إلغاء الطلب", "success");
        await refresh();
        // نظّف after refresh
        setOptimisticHidden((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        // ═══ Rollback على الفشل ═══
        setOptimisticHidden((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        showToast("فشل الإلغاء", "error");
      }
    } catch {
      setOptimisticHidden((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("فشل الإلغاء", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
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

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) =>
      ["accepted", "shipped", "picked_up"].includes(o.status)
    ).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filtered = orders.filter((o) => {
    if (optimisticHidden.has(o.id)) return false;
    if (filter === "all") return true;
    if (filter === "pending") return o.status === "pending";
    if (filter === "active")
      return ["accepted", "shipped", "picked_up"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
            <Package size={22} className="text-[#2e8b73]" /> طلباتي
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} طلب — تابع حالة كل طلب
          </p>
        </div>

        {/* الفلاتر */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-2xl border p-3 text-right transition-all ${
                filter === f.key
                  ? "border-[#2e8b73]/40 bg-[#e8f4f0] dark:bg-[#1e3a33]"
                  : "border-gray-100 bg-white hover:border-[#2e8b73]/20 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                {f.label}
              </p>
              <p className="mt-0.5 text-lg font-black text-gray-900 dark:text-gray-100">
                {counts[f.key]}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0] dark:bg-[#1e3a33]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              لا توجد طلبات في هذا التصنيف
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filtered.map((o) => {
                const st = getStatusInfo(o.status);
                const orderLabel =
                  o.order_number || `#${String(o.id).slice(0, 8)}`;
                const canCancel = o.status === "pending";
                return (
                  <div
                    key={o.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <Link href={`/orders/${o.id}`} className="block">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                              {orderLabel}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Store size={11} />
                            <span className="truncate">
                              {o.supplier_name || "تاجر جملة"}
                            </span>
                          </p>
                          {o.delivery_name && (
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                              <Truck size={11} />
                              <span className="truncate">{o.delivery_name}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-left flex-shrink-0">
                          <div className="text-base font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                            {formatCurrency(o.total_amount)}
                          </div>
                          <ArrowLeft
                            size={14}
                            className="mt-1 ml-auto text-gray-300"
                          />
                        </div>
                      </div>
                    </Link>

                    {canCancel && (
                      <div className="border-t border-gray-50 pt-3 dark:border-gray-800">
                        <button
                          onClick={() => cancelOrder(o.id)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 active:scale-95 dark:border-red-900 dark:hover:bg-red-950/30"
                        >
                          <XCircle size={14} /> إلغاء الطلب
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e8b73] bg-white px-6 py-3 text-sm font-bold text-[#2e8b73] transition-all hover:bg-[#e8f4f0] active:scale-95 disabled:opacity-50 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>تحميل المزيد ({orders.length} من {total})</>
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
