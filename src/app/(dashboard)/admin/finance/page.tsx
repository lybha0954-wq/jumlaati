"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Wallet, TrendingUp, Store, Info, CreditCard, Calendar, Download, Coins, Banknote } from "lucide-react";

interface Order {
  id: number;
  status: string;
  supplier_name?: string;
  total_amount: number;
  created_at: string;
}

interface Payment {
  id: number;
  order_id: number;
  amount: number;
  method: string;
  note: string | null;
  created_at: string;
}

interface Commission {
  id: string;
  order_id: number | null;
  retailer_id: string | null;
  supplier_id: string | null;
  amount: number;
  rate: number | null;
  status: string;
  created_at: string;
}

interface Payout {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  note: string | null;
  created_at: string;
}

type Tab = "overview" | "payments" | "commissions" | "payouts";

export default function AdminFinancePage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, paymentsRes, commRes, payoutsRes] = await Promise.all([
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/payments").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/commissions").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/payouts").then((r) => (r.ok ? r.json() : [])),
      ]);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setPayments(Array.isArray(paymentsRes) ? paymentsRes : (paymentsRes.payments || []));
      setCommissions(Array.isArray(commRes) ? commRes : []);
      setPayouts(Array.isArray(payoutsRes) ? payoutsRes : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

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
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">المالية</h1>
            <p className="text-sm text-gray-500">العمولات والإيرادات والدفعات</p>
          </div>
          <a href="/api/export/payments"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#2e8b73]/40 hover:text-[#2e8b73]">
            <Download size={14} /> CSV
          </a>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "overview",    label: "الإيرادات",   icon: TrendingUp, count: 0 },
            { key: "payments",    label: "الدفعات",     icon: CreditCard, count: payments.length },
            { key: "commissions", label: "العمولات",    icon: Coins,      count: commissions.length },
            { key: "payouts",     label: "المستحقات",   icon: Banknote,   count: payouts.length },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key as Tab)}
                className={`flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  active ? "bg-[#2e8b73] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
                }`}>
                <Icon size={14} /> {t.label}
                {t.count > 0 && (
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab === "overview"    && <OverviewView orders={orders} />}
        {tab === "payments"    && <PaymentsView payments={payments} />}
        {tab === "commissions" && <CommissionsView commissions={commissions} />}
        {tab === "payouts"     && <PayoutsView payouts={payouts} />}
      </div>
    </div>
  );
}

function OverviewView({ orders }: { orders: Order[] }) {
  const completed = orders.filter((o) => o.status === "delivered");
  const totalVolume = completed.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
  const totalCommission = Math.round(totalVolume * 0.01);
  const suppliers = new Set(orders.map((o) => o.supplier_name).filter(Boolean));
  const subscriptionRevenue = suppliers.size * 25000;
  const expectedMonthly = totalCommission + subscriptionRevenue;

  return (
    <>
      <div className="mb-6 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-white shadow-lg shadow-[#2e8b73]/20">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Wallet size={18} />
          </div>
          <span className="text-sm font-bold text-white/90">الإيراد الشهري المتوقع</span>
        </div>
        <div className="text-3xl font-black">{formatCurrency(expectedMonthly)}</div>
        <p className="mt-1 text-xs text-white/70">تقديري بناءً على العمولات والاشتراكات</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
            <TrendingUp size={16} />
          </div>
          <p className="mb-1 text-xs text-gray-500">عمولة 1%</p>
          <p className="text-lg font-black text-gray-900">{formatCurrency(totalCommission)}</p>
          <p className="mt-1 text-[10px] text-gray-400">من {completed.length} طلب</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Store size={16} />
          </div>
          <p className="mb-1 text-xs text-gray-500">اشتراكات متوقعة</p>
          <p className="text-lg font-black text-gray-900">{formatCurrency(subscriptionRevenue)}</p>
          <p className="mt-1 text-[10px] text-gray-400">25K × {suppliers.size} تاجر</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-3 text-sm font-black text-gray-900">حجم التجارة الكلي</h2>
        <p className="mb-1 text-3xl font-black text-[#2e8b73]">{formatCurrency(totalVolume)}</p>
        <p className="text-xs text-gray-500">إجمالي الطلبات المكتملة في النظام</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#2e8b73]/20 bg-[#e8f4f0]/50 p-4">
        <Info size={18} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
        <div className="text-xs leading-relaxed text-gray-700">
          <strong className="text-[#1e6b57]">نموذج الإيراد</strong>
          <br />• السوبرماركت والمندوب: مجاني تماماً
          <br />• تاجر الجملة: 1% عمولة أو 25,000 د.ع/شهر اشتراك
        </div>
      </div>
    </>
  );
}

function PaymentsView({ payments }: { payments: Payment[] }) {
  const total = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const today = payments.filter((p) =>
    String(p.created_at || "").slice(0, 10) === new Date().toISOString().slice(0, 10)
  );
  const methodAr: Record<string, string> = {
    cash: "نقداً", transfer: "حوالة",
    zaincash: "زين كاش", fastpay: "فاست باي",
  };

  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <KpiCard icon={<CreditCard size={18} />} label="عدد الدفعات" value={String(payments.length)} color="blue" />
        <KpiCard icon={<TrendingUp size={18} />} label="إجمالي المبالغ" value={formatCurrency(total)} color="emerald" />
        <KpiCard icon={<Calendar size={18} />} label="دفعات اليوم" value={String(today.length)} color="amber" />
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <CreditCard className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">لا توجد دفعات بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.slice(0, 100).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73]">
                  <CreditCard size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">دفعة #{p.id} — طلب #{p.order_id}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {methodAr[p.method] || p.method || "—"}{p.note ? ` • ${p.note}` : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{String(p.created_at || "").slice(0, 16)}</p>
                </div>
              </div>
              <p className="flex-shrink-0 text-base font-black text-[#2e8b73]">{formatCurrency(Number(p.amount))}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function KpiCard({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-lg font-black text-gray-900">{value}</p>
    </div>
  );
}

function CommissionsView({ commissions }: { commissions: Commission[] }) {
  const total = commissions.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const pending = commissions.filter((c) => c.status === "pending");
  const paid = commissions.filter((c) => c.status === "paid");

  const statusAr: Record<string, string> = {
    pending: "قيد الانتظار",
    paid: "مدفوع",
    cancelled: "ملغي",
  };
  const statusCls: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    paid: "bg-[#e8f4f0] text-[#1e6b57]",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <KpiCard icon={<Coins size={18} />} label="إجمالي العمولات" value={formatCurrency(total)} color="emerald" />
        <KpiCard icon={<Calendar size={18} />} label="قيد الانتظار" value={String(pending.length)} color="amber" />
        <KpiCard icon={<TrendingUp size={18} />} label="مدفوعة" value={String(paid.length)} color="blue" />
      </div>

      {commissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <Coins className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">لا توجد عمولات بعد</p>
          <p className="mt-1 text-xs text-gray-400">ستُسجَّل تلقائياً مع كل طلب مكتمل</p>
        </div>
      ) : (
        <div className="space-y-2">
          {commissions.slice(0, 100).map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73]">
                  <Coins size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    عمولة {c.order_id ? `— طلب #${c.order_id}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {c.rate ? `${c.rate}%` : "—"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{String(c.created_at || "").slice(0, 16)}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-base font-black text-[#2e8b73]">{formatCurrency(c.amount)}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCls[c.status] || "bg-gray-50 text-gray-600"}`}>
                  {statusAr[c.status] || c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PayoutsView({ payouts }: { payouts: Payout[] }) {
  const total = payouts.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const pending = payouts.filter((p) => p.status === "pending");
  const paid = payouts.filter((p) => p.status === "paid");

  const statusAr: Record<string, string> = {
    pending: "قيد المراجعة",
    approved: "مقبول",
    paid: "مدفوع",
    rejected: "مرفوض",
  };
  const statusCls: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-blue-50 text-blue-700",
    paid: "bg-[#e8f4f0] text-[#1e6b57]",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <KpiCard icon={<Banknote size={18} />} label="إجمالي المستحقات" value={formatCurrency(total)} color="emerald" />
        <KpiCard icon={<Calendar size={18} />} label="قيد المراجعة" value={String(pending.length)} color="amber" />
        <KpiCard icon={<TrendingUp size={18} />} label="مدفوعة" value={String(paid.length)} color="blue" />
      </div>

      {payouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <Banknote className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">لا توجد طلبات مستحقات بعد</p>
          <p className="mt-1 text-xs text-gray-400">ستظهر هنا عندما يطلب التجار سحب أرباحهم</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payouts.slice(0, 100).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73]">
                  <Banknote size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">مستحقات #{p.id.slice(0, 8)}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {p.method === "cash" ? "نقداً" : p.method === "transfer" ? "حوالة" : p.method}
                    {p.note ? ` • ${p.note}` : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{String(p.created_at || "").slice(0, 16)}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-base font-black text-[#2e8b73]">{formatCurrency(p.amount)}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCls[p.status] || "bg-gray-50 text-gray-600"}`}>
                  {statusAr[p.status] || p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
