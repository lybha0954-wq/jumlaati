"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Crown, Check, Calendar, Wallet, Info,
  CheckCircle2, AlertTriangle, X, Gift, Sparkles, Rocket,
} from "lucide-react";

interface Plan {
  key: string;
  name: string;
  description: string | null;
  price_iqd: number;
  period_days: number;
  feature_keys: string[];
  is_recommended: boolean;
}

interface Subscription {
  id: string;
  plan_key: string;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  paid_amount: number;
}

const FEATURE_LABELS: Record<string, string> = {
  reports_advanced: "تقارير متقدمة",
  offers: "نشر العروض",
  push_manual: "إشعارات يدوية",
  matching: "مطابقة",
};

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Plan | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [plansRes, myRes] = await Promise.all([
        fetch("/api/subscriptions/plans").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/subscriptions/my").then((r) => (r.ok ? r.json() : {})),
      ]);
      setPlans(Array.isArray(plansRes) ? plansRes : []);
      setCurrent((myRes as any)?.subscription || null);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const doSubscribe = async (plan: Plan) => {
    setSubscribing(plan.key);
    try {
      const res = await fetch("/api/subscriptions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_key: plan.key,
          payment_method: "manual",
          payment_ref: "demo-" + Date.now(),
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "فشل");
      showToast("✅ تم تفعيل الاشتراك", "success");
      setConfirming(null);
      fetchData();
    } catch (e: any) {
      showToast(e?.message || "خطأ", "error");
    } finally {
      setSubscribing(null);
    }
  };

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
        {/* ═══ 🎁 عرض الإطلاق ═══ */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-l from-amber-50 via-white to-amber-50 shadow-md dark:border-amber-900/40 dark:from-amber-950/40 dark:via-gray-900 dark:to-amber-950/40">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/30">
              <Gift size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-amber-600 dark:text-amber-400" />
                <p className="text-[10px] font-black uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  عرض الإطلاق
                </p>
              </div>
              <p className="mt-0.5 text-base font-black text-gray-900 dark:text-gray-100">
                أول 3 أشهر مجاناً لجميع التجار
              </p>
              <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                جرّب التطبيق مجاناً 3 أشهر — بدون التزام
              </p>
            </div>
            <Rocket size={22} className="hidden flex-shrink-0 text-amber-500 sm:block" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0] dark:bg-[#1e3a33]">
            <Crown className="h-7 w-7 text-[#2e8b73]" />
          </div>
          <h1 className="mb-1 text-2xl font-black text-gray-900 dark:text-gray-100">الباقات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            اختر الباقة المناسبة لنشاطك
          </p>
        </div>

        {/* الاشتراك الحالي */}
        {current && (
          <div className="mb-6 rounded-2xl border border-[#2e8b73]/30 bg-gradient-to-br from-[#e8f4f0] to-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2e8b73]" />
              <h2 className="text-sm font-black text-[#1e6b57]">اشتراكك الحالي</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <InfoBox label="الباقة" value={current.plan_key} />
              <InfoBox
                label="ينتهي في"
                value={current.expires_at
                  ? new Date(current.expires_at).toLocaleDateString("ar-IQ")
                  : "—"}
              />
              <InfoBox label="المبلغ المدفوع" value={formatCurrency(current.paid_amount)} />
            </div>
          </div>
        )}

        {/* الباقات */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isCurrent = current?.plan_key === plan.key && current?.status === "active";
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl border-2 bg-white p-5 transition-all dark:bg-gray-900 ${
                  plan.is_recommended
                    ? "border-[#2e8b73] shadow-md shadow-[#2e8b73]/10"
                    : "border-gray-100 dark:border-gray-800"
                }`}
              >
                {plan.is_recommended && (
                  <div className="absolute -top-3 right-5 rounded-full bg-[#2e8b73] px-3 py-0.5 text-[10px] font-bold text-white">
                    الأكثر اختياراً
                  </div>
                )}

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-black text-gray-900">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-left">
                    {plan.price_iqd === 0 ? (
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">مجاناً</p>
                    ) : (
                      <>
                        <p className="text-xl font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                          {formatCurrency(plan.price_iqd)}
                        </p>
                        <p className="text-[10px] text-gray-400">/{plan.period_days} يوم</p>
                        <p className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          🎁 مجاناً 3 أشهر
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {plan.feature_keys.length > 0 && (
                  <ul className="mb-4 space-y-2 border-t border-gray-50 pt-4">
                    {plan.feature_keys.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={14} className="flex-shrink-0 text-[#2e8b73]" />
                        {FEATURE_LABELS[f] || f}
                      </li>
                    ))}
                  </ul>
                )}

                {isCurrent ? (
                  <button disabled
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-500 cursor-not-allowed">
                    ✓ اشتراكك الحالي
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirming(plan)}
                    disabled={subscribing === plan.key}
                    className={`w-full rounded-xl py-3 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
                      plan.is_recommended
                        ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/25 hover:bg-[#1e6b57] hover:shadow-lg"
                        : "border-2 border-[#2e8b73] bg-white text-[#2e8b73] hover:bg-[#e8f4f0] dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                    }`}>
                    {subscribing === plan.key ? (
                      "جاري..."
                    ) : plan.price_iqd === 0 ? (
                      "ابدأ مجاناً"
                    ) : (
                      <>
                        اشترك الآن
                        <span className="ml-1.5 rounded-full bg-white/25 px-2 py-0.5 text-[9px]">
                          3 أشهر مجاناً
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ملاحظة */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div className="text-xs leading-relaxed text-blue-800">
            <strong>الدفع:</strong> حالياً الدفع يدوي (تحويل/نقدي). بعد الاتفاق مع مزود الدفع (زين كاش/فاست باي) سيتفعّل الدفع الإلكتروني تلقائياً.
          </div>
        </div>
      </div>

      {/* Modal تأكيد */}
      {confirming && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">تأكيد الاشتراك</h2>
              <button onClick={() => setConfirming(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">الباقة</span>
                <span className="font-black text-gray-900">{confirming.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">المدة</span>
                <span className="font-bold text-gray-900">{confirming.period_days} يوم</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-sm font-bold text-gray-700">الإجمالي</span>
                <span className="text-lg font-black text-[#2e8b73]">
                  {confirming.price_iqd === 0 ? "مجاناً" : formatCurrency(confirming.price_iqd)}
                </span>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                هذه نسخة تجريبية. الدفع الإلكتروني سيتفعّل قريباً. يمكنك التجربة الآن بحرية.
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setConfirming(null)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
                إلغاء
              </button>
              <button
                onClick={() => doSubscribe(confirming)}
                disabled={subscribing !== null}
                className="flex-1 rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white hover:bg-[#1e6b57] disabled:opacity-50">
                {subscribing ? "جاري التفعيل..." : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 p-3 backdrop-blur-sm">
      <p className="mb-1 text-[10px] text-gray-500">{label}</p>
      <p className="truncate text-sm font-black text-gray-900">{value}</p>
    </div>
  );
}
