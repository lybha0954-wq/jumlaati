'use client';
import React, { useState } from 'react';
import { X, DollarSign, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

export interface DebtEntry {
  id: string;
  counterparty: string; // supplier name (for retailer) or store name (for supplier)
  total: number;
  paid: number;
  due: string;
  status: 'مسدد' | 'جزئي' | 'متأخر';
}

interface DebtPaymentModalProps {
  onClose: () => void;
  role?: 'retailer' | 'supplier' | 'admin';
  entries?: DebtEntry[];
}

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

const defaultRetailerEntries: DebtEntry[] = [
  { id: 'd1', counterparty: 'شركة الفرات للتوزيع', total: 1_200_000, paid: 850_000, due: '٢٠٢٦/٠٨/١٥', status: 'جزئي' },
  { id: 'd2', counterparty: 'مستودع النخيل', total: 650_000, paid: 650_000, due: '٢٠٢٦/٠٨/٠٥', status: 'مسدد' },
  { id: 'd3', counterparty: 'مجمع الرافدين', total: 980_000, paid: 0, due: '٢٠٢٦/٠٨/٢٠', status: 'متأخر' },
  { id: 'd4', counterparty: 'شركة بابل للمواد الغذائية', total: 430_000, paid: 200_000, due: '٢٠٢٦/٠٨/٢٥', status: 'جزئي' },
];

const defaultSupplierEntries: DebtEntry[] = [
  { id: 's1', counterparty: 'سوبرماركت الأمل', total: 850_000, paid: 200_000, due: '٢٠٢٦/٠٨/١٠', status: 'متأخر' },
  { id: 's2', counterparty: 'متجر النور', total: 620_000, paid: 620_000, due: '٢٠٢٦/٠٨/١٥', status: 'مسدد' },
  { id: 's3', counterparty: 'متجر الرافدين', total: 980_000, paid: 0, due: '٢٠٢٦/٠٨/٢٠', status: 'متأخر' },
  { id: 's4', counterparty: 'بقالة الزهراء', total: 340_000, paid: 100_000, due: '٢٠٢٦/٠٨/٢٥', status: 'جزئي' },
];

export default function DebtPaymentModal({ onClose, role = 'retailer', entries }: DebtPaymentModalProps) {
  const defaultEntries = role === 'supplier' ? defaultSupplierEntries : defaultRetailerEntries;
  const [debtEntries, setDebtEntries] = useState<DebtEntry[]>(entries ?? defaultEntries);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentInput, setPaymentInput] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const totalDebt = debtEntries.reduce((s, d) => s + d.total, 0);
  const totalPaid = debtEntries.reduce((s, d) => s + d.paid, 0);
  const totalRemaining = totalDebt - totalPaid;

  const selectedEntry = debtEntries.find((d) => d.id === selectedId);

  const handlePayment = () => {
    if (!selectedEntry) return;
    const amount = parseInt(paymentInput.replace(/,/g, ''), 10);
    if (!amount || amount <= 0) return;
    const remaining = selectedEntry.total - selectedEntry.paid;
    const actualPay = Math.min(amount, remaining);

    setDebtEntries((prev) =>
      prev.map((d) => {
        if (d.id !== selectedId) return d;
        const newPaid = d.paid + actualPay;
        const newStatus: DebtEntry['status'] =
          newPaid >= d.total ? 'مسدد' : newPaid > 0 ? 'جزئي' : 'متأخر';
        return { ...d, paid: newPaid, status: newStatus };
      })
    );

    setPaymentSuccess(selectedEntry.counterparty);
    setPaymentInput('');
    setSelectedId(null);
    setTimeout(() => setPaymentSuccess(null), 3000);
  };

  const statusColor = (s: string) =>
    s === 'مسدد' ?'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
      : s === 'متأخر' ?'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400' :'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400';

  const headerGradient =
    role === 'supplier' ?'bg-gradient-to-l from-blue-700 to-blue-500'
      : role === 'admin' ?'bg-gradient-to-l from-violet-700 to-purple-500' :'bg-gradient-to-l from-red-600 to-rose-500';

  const title =
    role === 'supplier' ?'ديون العملاء والمدفوعات'
      : role === 'admin' ?'الرقابة المالية والديون' :'سجل الديون والمدفوعات';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      dir="rtl"
    >
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className={`${headerGradient} px-5 py-4 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-arabic font-bold text-white text-base">{title}</h2>
              <p className="text-white/70 text-xs font-arabic">بالدينار العراقي (د.ع)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 border-b border-border flex-shrink-0">
          {[
            { label: 'إجمالي الديون', value: fmt(totalDebt), color: 'text-red-600 dark:text-red-400' },
            { label: 'المدفوع', value: fmt(totalPaid), color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'المتبقي', value: fmt(totalRemaining), color: 'text-amber-600 dark:text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className={`text-sm font-bold font-arabic tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-arabic mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Payment success toast */}
        {paymentSuccess && (
          <div className="mx-4 mt-3 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2.5 flex-shrink-0">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
            <p className="font-arabic text-sm text-emerald-700 dark:text-emerald-400">
              تم تسجيل الدفعة لـ <strong>{paymentSuccess}</strong> بنجاح
            </p>
          </div>
        )}

        {/* Entries list */}
        <div className="overflow-y-auto flex-1 divide-y divide-border">
          {debtEntries.map((d) => {
            const pct = d.total > 0 ? Math.round((d.paid / d.total) * 100) : 100;
            const remaining = d.total - d.paid;
            const isSelected = selectedId === d.id;

            return (
              <div key={d.id} className="px-4 py-3 space-y-2">
                {/* Row header */}
                <div className="flex items-center justify-between">
                  <p className="font-arabic font-semibold text-sm text-foreground">{d.counterparty}</p>
                  <span className={`text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full border ${statusColor(d.status)}`}>
                    {d.status}
                  </span>
                </div>

                {/* Amounts */}
                <div className="flex justify-between text-xs font-arabic text-muted-foreground">
                  <span>الإجمالي: <span className="font-bold text-foreground tabular-nums">{fmt(d.total)}</span></span>
                  <span>الاستحقاق: {d.due}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-arabic">
                    <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">مدفوع: {fmt(d.paid)}</span>
                    <span className="text-red-500 dark:text-red-400 tabular-nums">متبقي: {fmt(remaining)}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Pay button — only if not fully paid */}
                {d.status !== 'مسدد' && (
                  <div>
                    {!isSelected ? (
                      <button
                        onClick={() => { setSelectedId(d.id); setPaymentInput(''); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-arabic font-semibold hover:bg-primary/20 active:scale-95 transition-all"
                      >
                        <TrendingDown size={13} />
                        تسجيل دفعة تسديد
                      </button>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="1"
                            max={remaining}
                            placeholder={`الحد الأقصى: ${fmt(remaining)}`}
                            value={paymentInput}
                            onChange={(e) => setPaymentInput(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-xl text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
                            dir="ltr"
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={handlePayment}
                          disabled={!paymentInput || parseInt(paymentInput) <= 0}
                          className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-arabic font-bold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {d.status === 'مسدد' && (
                  <div className="flex items-center gap-1.5 text-[10px] font-arabic text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={12} />
                    تم السداد الكامل
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-arabic text-muted-foreground">
            <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
            <span>الأرقام المعروضة تقريبية — للتسوية الرسمية تواصل مع المحاسب</span>
          </div>
        </div>
      </div>
    </div>
  );
}
