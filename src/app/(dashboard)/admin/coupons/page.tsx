"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Ticket, Plus, Trash2, X, Percent, AlertTriangle,
  Calendar, Hash, CheckCircle2,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/coupons");
      const d = res.ok ? await res.json() : [];
      setCoupons(Array.isArray(d) ? d : (d.coupons || []));
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  const active = coupons.filter((c) => c.is_active).length;
  const totalUsed = coupons.reduce((s, c) => s + (c.used_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
              <Ticket size={22} className="text-amber-500" /> الكوبونات
            </h1>
            <p className="text-sm text-gray-500">{coupons.length} كوبون — {active} نشط</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95">
            <Plus size={14} /> جديد
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <KPI icon={<Ticket size={16} />} label="الإجمالي" value={coupons.length} color="blue" />
          <KPI icon={<CheckCircle2 size={16} />} label="نشطة" value={active} color="emerald" />
          <KPI icon={<Hash size={16} />} label="مستخدمة" value={totalUsed} color="amber" />
        </div>

        {coupons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Ticket className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-bold text-gray-700">لا توجد كوبونات</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1e6b57]">
              <Plus size={14} /> أضف أول كوبون
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
          </div>
        )}
      </div>

      {showForm && (
        <AddCouponModal
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchCoupons(); }}
        />
      )}
    </div>
  );
}

function KPI({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const usage = coupon.max_uses > 0 ? Math.round((coupon.used_count / coupon.max_uses) * 100) : 0;
  const isExpired = coupon.valid_to && new Date(coupon.valid_to) < new Date();
  const toDate = (s: string | null) => s ? new Date(s).toLocaleDateString("ar-IQ") : "—";

  return (
    <div className={`rounded-2xl border bg-white p-4 ${isExpired ? "border-gray-100 opacity-60" : coupon.is_active ? "border-[#2e8b73]/30" : "border-gray-100"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <p className="rounded-lg bg-gray-100 px-2 py-0.5 font-mono text-sm font-black text-gray-900" dir="ltr">
              {coupon.code}
            </p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${coupon.is_active && !isExpired ? "bg-[#e8f4f0] text-[#1e6b57]" : "bg-gray-100 text-gray-500"}`}>
              {isExpired ? "منتهي" : coupon.is_active ? "نشط" : "معطّل"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 font-bold text-amber-600">
              <Percent size={11} />
              {coupon.discount_type === "percent"
                ? `${coupon.discount_value}%`
                : formatCurrency(coupon.discount_value)}
            </span>
            {coupon.min_order > 0 && (
              <span>حد أدنى: {formatCurrency(coupon.min_order)}</span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar size={10} /> حتى {toDate(coupon.valid_to)}
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px] text-gray-500">
              <span>الاستخدام</span>
              <span>{coupon.used_count} / {coupon.max_uses}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className={`h-full rounded-full ${usage >= 90 ? "bg-red-500" : "bg-[#2e8b73]"}`}
                style={{ width: `${Math.min(usage, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCouponModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("100");
  const [minOrder, setMinOrder] = useState("0");
  const [validTo, setValidTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSave = async () => {
    setError("");
    if (!code.trim()) return setError("أدخل كود الكوبون");
    if (!discountValue || Number(discountValue) <= 0) return setError("أدخل قيمة خصم صحيحة");
    if (discountType === "percent" && Number(discountValue) > 100) return setError("النسبة لا تتجاوز 100%");

    setSaving(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_type: discountType,
          discount_value: Number(discountValue),
          max_uses: Number(maxUses) || 100,
          min_order: Number(minOrder) || 0,
          valid_to: validTo || null,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || d.message || "فشل");
      showToast("✅ تم إنشاء الكوبون", "success");
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "خطأ");
    } finally {
      setSaving(false);
    }
  };

  const randomCode = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setCode(out);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">كوبون جديد</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">كود الكوبون</label>
            <div className="flex gap-2">
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER20" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-mono outline-none focus:border-[#2e8b73] focus:bg-white" />
              <button type="button" onClick={randomCode}
                className="flex-shrink-0 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 hover:bg-gray-50">
                🎲
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">نوع الخصم</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73]">
                <option value="percent">نسبة %</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">
                {discountType === "percent" ? "النسبة (%)" : "المبلغ (د.ع)"}
              </label>
              <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percent" ? "20" : "5000"} dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">حد الاستخدام</label>
              <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">حد أدنى للطلب</label>
              <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)}
                placeholder="0" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">ينتهي في (اختياري)</label>
            <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white" />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            className="w-full rounded-xl bg-[#2e8b73] py-3.5 text-sm font-black text-white hover:bg-[#1e6b57] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400">
            {saving ? "جارٍ الحفظ..." : "إنشاء الكوبون"}
          </button>
        </div>
      </div>
    </div>
  );
}
