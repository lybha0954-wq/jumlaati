'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, TrendingUp, AlertCircle, Clock, ChevronDown, ChevronUp, CreditCard, Banknote, ArrowUpRight, Filter, Building2, ReceiptText } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import { financialService, type LedgerEntry } from '@/lib/services/financialService';
import { supplierService, type Supplier } from '@/lib/services/supplierService';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SupplierCredit {
  id: string;
  name: string;
  region: string;
  creditLimit: number;
  creditUsed: number;
  pendingDebt: number;
  dueDays: number;
  status: 'good' | 'warning' | 'overdue';
}

interface PaymentRecord extends LedgerEntry {
  balance: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `${n.toLocaleString('ar-IQ')} ${CURRENCY}`;

const statusConfig = {
  good: { label: 'جيد', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  warning: { label: 'تحذير', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  overdue: { label: 'متأخر', color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
};

const txnTypeConfig = {
  order: { label: 'طلب', icon: ReceiptText, color: 'text-blue-600', bg: 'bg-blue-50' },
  payment: { label: 'دفعة', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  adjustment: { label: 'تسوية', icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function CreditBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SupplierCreditCard({ supplier }: { supplier: SupplierCredit }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[supplier.status];
  const available = supplier.creditLimit - supplier.creditUsed;
  const usedPct = Math.round((supplier.creditUsed / supplier.creditLimit) * 100);

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all duration-200 ${supplier.status === 'overdue' ? 'border-red-200' : supplier.status === 'warning' ? 'border-amber-200' : 'border-border'}`}>
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-center gap-3 p-4 text-right hover:bg-muted/40 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="font-arabic font-semibold text-foreground text-sm">{supplier.name}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-arabic px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{supplier.region}</p>
        </div>
        <div className="text-left flex-shrink-0">
          <p className="text-xs text-muted-foreground font-arabic">المتاح</p>
          <p className={`font-bold text-sm tabular-nums ${available <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>{fmt(available)}</p>
        </div>
        <div className="text-muted-foreground flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <div className="px-4 pb-3">
        <div className="flex justify-between text-xs text-muted-foreground font-arabic mb-1">
          <span className="tabular-nums">{usedPct}% مستخدم</span>
          <span className="tabular-nums">الحد: {fmt(supplier.creditLimit)}</span>
        </div>
        <CreditBar used={supplier.creditUsed} limit={supplier.creditLimit} />
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-3 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-arabic mb-1">الحد الائتماني</p>
            <p className="font-bold text-foreground tabular-nums text-sm">{fmt(supplier.creditLimit)}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-arabic mb-1">المستخدم</p>
            <p className="font-bold text-foreground tabular-nums text-sm">{fmt(supplier.creditUsed)}</p>
          </div>
          <div className={`rounded-lg p-3 border ${supplier.pendingDebt > 0 ? 'bg-red-50 border-red-200' : 'bg-card border-border'}`}>
            <p className="text-xs text-muted-foreground font-arabic mb-1">الديون المعلقة</p>
            <p className={`font-bold tabular-nums text-sm ${supplier.pendingDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {supplier.pendingDebt > 0 ? fmt(supplier.pendingDebt) : 'لا يوجد'}
            </p>
          </div>
          <div className={`rounded-lg p-3 border ${supplier.dueDays < 0 ? 'bg-red-50 border-red-200' : supplier.dueDays <= 3 ? 'bg-amber-50 border-amber-200' : 'bg-card border-border'}`}>
            <p className="text-xs text-muted-foreground font-arabic mb-1">موعد الاستحقاق</p>
            <p className={`font-bold text-sm font-arabic ${supplier.dueDays < 0 ? 'text-red-600' : supplier.dueDays <= 3 ? 'text-amber-600' : 'text-foreground'}`}>
              {supplier.dueDays < 0 ? `متأخر ${Math.abs(supplier.dueDays)} أيام` : supplier.dueDays === 0 ? 'اليوم' : `خلال ${supplier.dueDays} أيام`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ txn }: { txn: PaymentRecord }) {
  const typeCfg = txnTypeConfig[txn.entryType];
  const TxnIcon = typeCfg.icon;
  const isDebit = txn.direction === 'debit';
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeCfg.bg}`}>
        <TxnIcon size={16} className={typeCfg.color} />
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-arabic text-sm font-medium text-foreground truncate">{txn.description}</p>
        <div className="flex items-center gap-2 mt-0.5 justify-end">
          <span className="text-xs text-muted-foreground font-arabic">{txn.supplierName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground tabular-nums">{txn.entryDate}</span>
          {txn.status === 'overdue' && <span className="text-xs text-red-600 font-arabic bg-red-50 px-1.5 py-0.5 rounded-full">متأخر</span>}
          {txn.status === 'pending' && <span className="text-xs text-amber-600 font-arabic bg-amber-50 px-1.5 py-0.5 rounded-full">معلق</span>}
          {txn.status === 'completed' && <span className="text-xs text-emerald-600 font-arabic bg-emerald-50 px-1.5 py-0.5 rounded-full">مكتمل</span>}
        </div>
      </div>
      <div className="text-left flex-shrink-0">
        <p className={`font-bold tabular-nums text-sm ${isDebit ? 'text-red-600' : 'text-emerald-600'}`}>
          {isDebit ? '-' : '+'}{fmt(txn.amount)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RetailerLedgerContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [filterSupplier, setFilterSupplier] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [ledgerEntries, setLedgerEntries] = useState<PaymentRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [entries, sups] = await Promise.all([
        financialService.getLedgerEntries(),
        supplierService.getAll(),
      ]);
      setLedgerEntries(entries.map((e) => ({ ...e, balance: 0 })));
      setSuppliers(sups);
    } catch {
      // silent fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build supplier credits from DB data
  const supplierCredits: SupplierCredit[] = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    region: s.region,
    creditLimit: s.creditLimit,
    creditUsed: s.creditUsed,
    pendingDebt: s.pendingDebt,
    dueDays: s.dueDays,
    status: s.creditStatus,
  }));

  const totalDebt = supplierCredits.reduce((s, c) => s + c.pendingDebt, 0);
  const totalCreditLimit = supplierCredits.reduce((s, c) => s + c.creditLimit, 0);
  const totalCreditUsed = supplierCredits.reduce((s, c) => s + c.creditUsed, 0);
  const totalAvailable = totalCreditLimit - totalCreditUsed;
  const overdueCount = supplierCredits.filter((c) => c.status === 'overdue').length;
  const totalPaid = ledgerEntries.filter((t) => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);

  const filteredHistory = ledgerEntries.filter((t) => {
    const matchSupplier = filterSupplier === 'all' || t.supplierId === filterSupplier;
    const matchType = filterType === 'all' || t.entryType === filterType;
    return matchSupplier && matchType;
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Page header */}
      <div className="bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-arabic font-bold text-foreground text-lg leading-tight">كشف الحساب والديون</h1>
            <p className="text-xs text-muted-foreground font-arabic">تتبع رصيدك وحدودك الائتمانية مع الموردين</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* KPI summary row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className={`rounded-xl border p-4 ${totalDebt > 0 ? 'bg-red-50 border-red-200' : 'bg-card border-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle size={16} className={totalDebt > 0 ? 'text-red-500' : 'text-muted-foreground'} />
                  <span className="text-xs text-muted-foreground font-arabic">إجمالي الديون</span>
                </div>
                <p className={`font-bold tabular-nums text-lg ${totalDebt > 0 ? 'text-red-600' : 'text-foreground'}`}>{fmt(totalDebt)}</p>
                {overdueCount > 0 && <p className="text-xs text-red-500 font-arabic mt-1">{overdueCount} موردين متأخرين</p>}
              </div>

              <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-xs text-muted-foreground font-arabic">الرصيد المتاح</span>
                </div>
                <p className="font-bold tabular-nums text-lg text-emerald-600">{fmt(totalAvailable)}</p>
                <p className="text-xs text-muted-foreground font-arabic mt-1">من أصل {fmt(totalCreditLimit)}</p>
              </div>

              <div className="rounded-xl border bg-card border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard size={16} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-arabic">الائتمان المستخدم</span>
                </div>
                <p className="font-bold tabular-nums text-lg text-foreground">{fmt(totalCreditUsed)}</p>
                <p className="text-xs text-muted-foreground font-arabic mt-1">
                  {totalCreditLimit > 0 ? Math.round((totalCreditUsed / totalCreditLimit) * 100) : 0}% من الحد
                </p>
              </div>

              <div className="rounded-xl border bg-card border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 size={16} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-arabic">الموردون</span>
                </div>
                <p className="font-bold tabular-nums text-lg text-foreground">{supplierCredits.length}</p>
                <p className="text-xs text-muted-foreground font-arabic mt-1">
                  {supplierCredits.filter((c) => c.status === 'good').length} بحالة جيدة
                </p>
              </div>
            </div>

            {/* Overdue alert banner */}
            {overdueCount > 0 && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-right">
                  <p className="font-arabic font-semibold text-red-700 text-sm">تنبيه: لديك مدفوعات متأخرة</p>
                  <p className="font-arabic text-xs text-red-600 mt-0.5">
                    يوجد {overdueCount} موردين بمبالغ متأخرة. يرجى التسوية في أقرب وقت لتجنب تعليق الائتمان.
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-muted rounded-xl p-1">
              {[
                { key: 'overview', label: 'الحدود الائتمانية', icon: CreditCard },
                { key: 'history', label: 'سجل المعاملات', icon: Clock },
              ].map(({ key, label, icon: TabIcon }) => (
                <button key={key} onClick={() => setActiveTab(key as 'overview' | 'history')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-arabic font-medium transition-all duration-150 ${activeTab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {React.createElement(TabIcon, { size: 15 })}
                  {label}
                </button>
              ))}
            </div>

            {/* Tab: Credit overview */}
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-arabic px-1">
                  {supplierCredits.length} موردين — اضغط على أي مورد لعرض التفاصيل
                </p>
                {supplierCredits.map((s) => (
                  <SupplierCreditCard key={s.id} supplier={s} />
                ))}
              </div>
            )}

            {/* Tab: Payment history */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                    <Building2 size={14} className="text-muted-foreground" />
                    <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}
                      className="text-sm font-arabic bg-transparent text-foreground outline-none cursor-pointer">
                      <option value="all">كل الموردين</option>
                      {supplierCredits.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                    <Filter size={14} className="text-muted-foreground" />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                      className="text-sm font-arabic bg-transparent text-foreground outline-none cursor-pointer">
                      <option value="all">كل العمليات</option>
                      <option value="order">طلبات</option>
                      <option value="payment">دفعات</option>
                      <option value="adjustment">تسويات</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-arabic text-muted-foreground px-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />مدين (طلب)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />دائن (دفعة)</span>
                </div>

                <div className="bg-card border border-border rounded-xl px-4 divide-y divide-border">
                  {filteredHistory.length === 0 ? (
                    <div className="py-10 text-center">
                      <ReceiptText size={32} className="text-muted-foreground mx-auto mb-2" />
                      <p className="font-arabic text-muted-foreground text-sm">لا توجد معاملات</p>
                    </div>
                  ) : (
                    filteredHistory.map((txn) => <TransactionRow key={txn.id} txn={txn} />)
                  )}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-arabic">إجمالي الرصيد المستحق</p>
                    <p className="font-bold text-red-600 tabular-nums text-lg">{fmt(totalDebt)}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-arabic">إجمالي المدفوع</p>
                    <p className="font-bold text-emerald-600 tabular-nums text-lg">{fmt(totalPaid)}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
