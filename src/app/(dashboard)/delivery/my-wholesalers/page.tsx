"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Store, Package, CheckCircle2, Phone } from "lucide-react";

interface Order {
  id: number;
  status: string;
  supplier_name?: string;
  total_amount: number;
  created_at: string;
}

interface Wholesaler {
  name: string;
  totalOrders: number;
  deliveredOrders: number;
  activeOrders: number;
  revenue: number;
}

export default function DeliveryMyWholesalersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  const map = new Map<string, Wholesaler>();
  orders.forEach((o) => {
    const name = o.supplier_name;
    if (!name) return;
    if (!map.has(name)) {
      map.set(name, { name, totalOrders: 0, deliveredOrders: 0, activeOrders: 0, revenue: 0 });
    }
    const w = map.get(name)!;
    w.totalOrders++;
    if (o.status === "delivered") {
      w.deliveredOrders++;
      w.revenue += Number(o.total_amount) || 0;
    } else if (["shipped", "picked_up"].includes(o.status)) {
      w.activeOrders++;
    }
  });
  const wholesalers = Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">تجاري</h1>
          <p className="text-sm text-gray-500">
            {wholesalers.length > 0
              ? `${wholesalers.length} تاجر جملة تعاملت معهم`
              : "تجار الجملة المرتبطون بك"}
          </p>
        </div>

        {wholesalers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Store className="h-8 w-8 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا يوجد تجار بعد</p>
            <p className="mt-1 text-xs text-gray-500">عندما تنفّذ مهام توصيل، سيظهر التجار هنا</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wholesalers.map((w, i) => (
              <WholesalerCard key={w.name} wholesaler={w} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WholesalerCard({ wholesaler, rank }: { wholesaler: Wholesaler; rank: number }) {
  const { name, totalOrders, deliveredOrders, activeOrders, revenue } = wholesaler;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0]">
          <Store className="h-6 w-6 text-[#2e8b73]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-black text-gray-900">{name}</p>
            {rank <= 3 && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                #{rank}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500">
            {deliveredOrders} مهمة مكتملة
          </p>
        </div>

        {activeOrders > 0 && (
          <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
            {activeOrders} نشطة
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
        <Stat label="إجمالي" value={String(totalOrders)} icon={<Package size={12} />} color="blue" />
        <Stat label="مكتملة" value={String(deliveredOrders)} icon={<CheckCircle2 size={12} />} color="emerald" />
        <Stat label="المبالغ" value={revenue > 0 ? `${(revenue / 1000).toFixed(0)}K` : "—"} icon={<Phone size={12} />} color="amber" />
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: string; icon: any; color: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-600",
    emerald: "text-[#2e8b73]",
    amber: "text-amber-600",
  };
  return (
    <div className="text-center">
      <div className={`mb-1 inline-flex items-center gap-1 text-[10px] font-bold ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-sm font-black text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
