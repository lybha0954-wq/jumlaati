"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Truck, CheckCircle2, Clock, Wallet, ArrowLeft, MapPin } from "lucide-react";

export default function DeliveryOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, completed: 0, today: 0, earnings: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const orders = res.ok ? await res.json() : [];
      const list = Array.isArray(orders) ? orders : [];

      const active = list.filter((o: any) => o.status === "delivering").length;
      const completed = list.filter((o: any) => o.status === "completed").length;
      const today = list.filter((o: any) => {
        const d = new Date(o.created_at);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length;
      const earnings = list
        .filter((o: any) => o.status === "completed")
        .reduce((s: number, o: any) => s + (Number(o.total) || 0) * 0.05, 0);

      setStats({ active, completed, today, earnings });
      setTasks(list.filter((o: any) => o.status === "delivering").slice(0, 5));
    } catch { showToast("فشل تحميل المهام", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مرحباً بك 👋</h1>
          <p className="text-sm text-gray-500">مهامك وأرباحك اليوم</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard icon={<Truck className="h-5 w-5" />} label="مهام نشطة" value={String(stats.active)} color="purple" highlight={stats.active > 0} />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="مكتملة" value={String(stats.completed)} color="emerald" />
          <KpiCard icon={<Clock className="h-5 w-5" />} label="اليوم" value={String(stats.today)} color="amber" />
          <KpiCard icon={<Wallet className="h-5 w-5" />} label="الأرباح" value={formatCurrency(stats.earnings)} color="blue" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">المهام النشطة</h2>
            <Link href="/delivery/tasks"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73] hover:text-[#1e6b57]">
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
                <Truck className="h-6 w-6 text-[#2e8b73]" />
              </div>
              <p className="text-sm text-gray-500">لا توجد مهام نشطة</p>
              <p className="mt-1 text-xs text-gray-400">سيتم إشعارك عند وصول مهمة</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {tasks.map((t: any) => (
                <li key={t.id}>
                  <Link href={`/orders/${t.id}`}
                    className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">#{String(t.id).slice(0, 8)}</p>
                        <p className="truncate text-xs text-gray-500">
                          {t.delivery_address || t.retailer_name || "وجهة"}
                        </p>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-sm font-black text-[#2e8b73]">{formatCurrency(t.total)}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color, highlight }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
  };
  return (
    <div className={`rounded-2xl border bg-white p-4 ${highlight ? "border-[#2e8b73]/30 shadow-sm" : "border-gray-100"}`}>
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}
