"use client";

import { useCallback, useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Coins, Sparkles, TrendingUp } from "lucide-react";

export default function RetailerPointsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch("/api/points");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const total = items.reduce((s, p) => s + Number(p.points || 0), 0);
  const earned = items.filter((p) => Number(p.points) > 0).length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
            <Coins size={22} className="text-amber-500" /> نقاطي
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            اجمع النقاط مع كل طلب واستبدلها بمكافآت
          </p>
        </div>

        {/* بطاقة الرصيد */}
        <div className="mb-5 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-center text-white shadow-lg">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Coins size={26} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">
            رصيدك الحالي
          </p>
          <p className="mt-2 text-4xl font-black">{total}</p>
          <p className="mt-1 text-[11px] text-white/70">نقطة ولاء</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <TrendingUp size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">معاملات مكتسبة</p>
            <p className="text-xl font-black text-gray-900 dark:text-gray-100">{earned}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Sparkles size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">إجمالي المعاملات</p>
            <p className="text-xl font-black text-gray-900 dark:text-gray-100">
              {items.length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-4 dark:border-gray-800">
            <h2 className="text-sm font-black text-gray-900 dark:text-gray-100">
              سجل النقاط
            </h2>
          </div>
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <Coins className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                لا توجد نقاط بعد
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                اجمع النقاط مع كل طلب
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-gray-800">
              {items.map((item: any) => {
                const pts = Number(item.points || 0);
                const isGain = pts > 0;
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {item.reason || (isGain ? "نقاط مكتسبة" : "استبدال نقاط")}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {String(item.created_at || "").slice(0, 16)}
                      </p>
                    </div>
                    <p
                      className={`text-base font-black ${
                        isGain
                          ? "text-[#2e8b73] dark:text-[#6ecdb0]"
                          : "text-red-500"
                      }`}
                    >
                      {isGain ? "+" : ""}
                      {pts}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
