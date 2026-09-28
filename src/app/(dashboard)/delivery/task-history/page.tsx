"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function DeliveryHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      const list = Array.isArray(data) ? data : [];
      setOrders(list.filter((o) => o.status === "completed"));
    } catch { showToast("فشل التحميل", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">السجل</h1>
          <p className="text-sm text-gray-500">{orders.length} مهمة مكتملة</p>
        </div>

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <CheckCircle2 className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا يوجد سجل بعد</p>
            <p className="mt-1 text-xs text-gray-500">ستظهر المهام المكتملة هنا</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/orders/${o.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 active:scale-[0.99]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f0]">
                    <CheckCircle2 className="h-5 w-5 text-[#2e8b73]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">#{String(o.id).slice(0, 8)}</p>
                    <p className="truncate text-xs text-gray-500">
                      {o.retailer_name || "—"}
                    </p>
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="text-sm font-black text-[#2e8b73]">{formatCurrency(o.total)}</div>
                  <ArrowLeft size={12} className="ml-auto mt-1 text-gray-300 transition-all group-hover:-translate-x-1 group-hover:text-[#2e8b73]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
