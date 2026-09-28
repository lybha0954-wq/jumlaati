"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, ArrowLeft, Store, Check, X } from "lucide-react";

interface Order {
  id: string; total: number; status: string; created_at: string;
  retailer_name?: string; delivery_name?: string;
}

type FilterKey = "all" | "reviewing" | "delivering" | "completed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "reviewing", label: "جديدة" },
  { key: "delivering", label: "قيد التوصيل" },
  { key: "completed", label: "مكتملة" },
];

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch { showToast("فشل التحميل", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const counts = {
    all: orders.length,
    reviewing: orders.filter((o) => o.status === "reviewing").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { showToast("تم التحديث ✅", "success"); fetchOrders(); }
    else showToast("فشل التحديث", "error");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">الطلبات الواردة</h1>
          <p className="text-sm text-gray-500">تابع وأدر كل طلباتك من هنا</p>
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
            <p className="text-sm font-bold text-gray-800">لا توجد طلبات في هذا التصنيف</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => {
              const st = getStatusInfo(o.status);
              return (
                <div key={o.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30">
                  <Link href={`/orders/${o.id}`} className="block">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900">
                            #{String(o.id).slice(0, 8)}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Store size={11} />
                          <span className="truncate">{o.retailer_name || "سوبرماركت"}</span>
                        </p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <div className="text-base font-black text-[#2e8b73]">
                          {formatCurrency(o.total)}
                        </div>
                        <ArrowLeft size={14}
                          className="mt-1 ml-auto text-gray-300" />
                      </div>
                    </div>
                  </Link>

                  {/* الإجراءات */}
                  {o.status === "reviewing" && (
                    <div className="flex gap-2 border-t border-gray-50 pt-3">
                      <button onClick={() => updateStatus(o.id, "delivering")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95">
                        <Check size={14} /> قبول وإرسال
                      </button>
                      <button onClick={() => updateStatus(o.id, "cancelled")}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50 active:scale-95">
                        <X size={14} /> رفض
                      </button>
                    </div>
                  )}

                  {o.status === "delivering" && (
                    <div className="border-t border-gray-50 pt-3">
                      <button onClick={() => updateStatus(o.id, "completed")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95">
                        <Check size={14} /> تأكيد التسليم
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusInfo(status: string) {
  const map: Record<string, any> = {
    reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700" },
    delivering: { label: "قيد التوصيل", className: "bg-purple-50 text-purple-700" },
    completed: { label: "مكتمل", className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي", className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}
