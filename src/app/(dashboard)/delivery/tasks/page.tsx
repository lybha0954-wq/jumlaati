"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, ArrowLeft, MapPin, Check, Store, User } from "lucide-react";

interface Order {
  id: string; total: number; status: string; created_at: string;
  retailer_name?: string; supplier_name?: string; delivery_address?: string;
}

export default function DeliveryTasksPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      const list = Array.isArray(data) ? data : [];
      setOrders(list.filter((o) => o.status === "delivering"));
    } catch { showToast("فشل التحميل", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDeliver = async (id: string) => {
    if (!confirm("تأكيد التسليم؟")) return;
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    if (res.ok) { showToast("تم التسليم ✅", "success"); fetchOrders(); }
    else showToast("فشل التحديث", "error");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مهامي</h1>
          <p className="text-sm text-gray-500">
            {orders.length > 0 ? `${orders.length} مهمة نشطة` : "لا توجد مهام حالياً"}
          </p>
        </div>

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا توجد مهام نشطة</p>
            <p className="mt-1 text-xs text-gray-500">سيتم إشعارك عند وصول مهمة جديدة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30">
                <Link href={`/orders/${o.id}`} className="block">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">
                          #{String(o.id).slice(0, 8)}
                        </span>
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                          قيد التوصيل
                        </span>
                      </div>
                      {o.supplier_name && (
                        <p className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Store size={11} />
                          <span className="truncate">من: {o.supplier_name}</span>
                        </p>
                      )}
                      {o.retailer_name && (
                        <p className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <User size={11} />
                          <span className="truncate">إلى: {o.retailer_name}</span>
                        </p>
                      )}
                      {o.delivery_address && (
                        <p className="flex items-start gap-1.5 text-xs text-gray-500">
                          <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{o.delivery_address}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-left">
                      <div className="text-base font-black text-[#2e8b73]">
                        {formatCurrency(o.total)}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <button onClick={() => handleDeliver(o.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95">
                    <Check size={14} /> تم التسليم
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
