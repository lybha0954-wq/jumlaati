"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import {
  Activity, Database, Zap, Users, Package, Bell, ShoppingCart,
  RefreshCw, CheckCircle2, AlertTriangle,
} from "lucide-react";

interface Health {
  ok: boolean;
  latency_ms: number;
  counts: {
    profiles: number;
    orders: number;
    products: number;
    notifications: number;
  };
  last_activity: string | null;
  checked_at: string;
  status: "healthy" | "degraded" | "slow";
}

export default function AdminHealthPage() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error("فشل الفحص");
      setData(await res.json());
      if (isRefresh) showToast("تم التحديث", "success");
    } catch {
      showToast("فشل الفحص", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  const statusColor = data?.status === "healthy"
    ? "text-emerald-600"
    : data?.status === "degraded"
    ? "text-amber-600"
    : "text-red-600";

  const statusLabel = data?.status === "healthy"
    ? "ممتازة"
    : data?.status === "degraded"
    ? "مقبولة"
    : "بطيئة";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
              <Activity size={22} className="text-[#2e8b73]" /> صحة النظام
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              آخر فحص: {data?.checked_at ? new Date(data.checked_at).toLocaleString("ar-IQ") : "—"}
            </p>
          </div>
          <button
            onClick={() => fetchHealth(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1e6b57] active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "..." : "تحديث"}
          </button>
        </div>

        {/* حالة الاتصال */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              data?.status === "healthy" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}>
              {data?.status === "healthy" ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">حالة قاعدة البيانات</p>
              <p className={`text-lg font-black ${statusColor}`}>{statusLabel}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-400">الاستجابة</p>
              <p className="text-lg font-black text-gray-900 dark:text-gray-100">
                {data?.latency_ms} ms
              </p>
            </div>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={16} />}
            label="المستخدمون"
            value={data?.counts.profiles || 0}
            color="blue"
          />
          <StatCard
            icon={<ShoppingCart size={16} />}
            label="الطلبات"
            value={data?.counts.orders || 0}
            color="emerald"
          />
          <StatCard
            icon={<Package size={16} />}
            label="المنتجات"
            value={data?.counts.products || 0}
            color="amber"
          />
          <StatCard
            icon={<Bell size={16} />}
            label="الإشعارات"
            value={data?.counts.notifications || 0}
            color="purple"
          />
        </div>

        {/* آخر نشاط */}
        {data?.last_activity && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#2e8b73]" />
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                آخر طلب: {new Date(data.last_activity).toLocaleString("ar-IQ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    emerald: "bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33] dark:text-[#6ecdb0]",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-black text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
