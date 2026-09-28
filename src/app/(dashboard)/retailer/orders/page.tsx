"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, ArrowLeft, Store, ShoppingCart } from "lucide-react";

interface Order {
  id: string; total: number; status: string; created_at: string;
  supplier_name?: string;
}

type FilterKey = "all" | "active" | "completed" | "cancelled";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "active", label: "قيد التنفيذ" },
  { key: "completed", label: "مكتملة" },
  { key: "cancelled", label: "ملغية" },
];

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch { showToast("فشل تحميل الطلبات", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const isActive = (s: string) => ["reviewing", "delivering"].includes(s);

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return isActive(o.status);
    if (filter === "completed") return o.status === "completed";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => isActive(o.status)).length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">طلباتي</h1>
          <p className="text-sm text-gray-500">تابع كل طلباتك من هنا</p>
        </div>

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

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">
              {filter === "all" ? "لا توجد طلبات بعد" : "لا توجد طلبات في هذا التصنيف"}
            </p>
            {filter === "all" && (
              <Link href="/retailer/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95">
                <ShoppingCart size={16} /> تصفّح التجار
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => {
              const status = getStatusInfo(o.status);
              return (
                <Link key={o.id} href={`/orders/${o.id}`}
                  className="group block rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md hover:shadow-[#2e8b73]/5 active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">
                          #{String(o.id).slice(0, 8)}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      {o.supplier_name && (
                        <p className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Store size={11} className="flex-shrink-0" />
                          <span className="truncate">{o.supplier_name}</span>
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        {new Date(o.created_at).toLocaleDateString("ar-IQ", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-base font-black text-[#2e8b73]">
                        {formatCurrency(o.total)}
                      </div>
                      <ArrowLeft size={14}
                        className="mt-1 ml-auto text-gray-300 transition-all group-hover:-translate-x-1 group-hover:text-[#2e8b73]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusInfo(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700" },
    delivering: { label: "قيد التوصيل", className: "bg-purple-50 text-purple-700" },
    completed: { label: "تم التسليم", className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي", className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}
