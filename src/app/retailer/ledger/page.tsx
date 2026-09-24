'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { rpc } from '@/lib/supabase/rpc';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/format';

interface Transaction {
  id: string;
  transaction_number: string;
  supplier_id: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: string;
  due_date?: string;
  created_at: string;
}

export default function RetailerLedgerPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const supabase = createClient();
      if (!supabase) { setLoading(false); return; }

      try {
        const [txRes, sum] = await Promise.all([
          supabase
            .from('transactions')
            .select('id, transaction_number, supplier_id, total_amount, paid_amount, remaining_amount, payment_status, due_date, created_at')
            .eq('retailer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50),
          rpc.userDebtSummary(user.id),
        ]);

        setTransactions(txRes.data ?? []);
        setSummary(sum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const cards = [
    { label: 'إجمالي الديون', value: summary?.total_debt || 0, color: 'text-red-600 bg-red-50', icon: AlertCircle },
    { label: 'ديون متأخرة', value: summary?.overdue_debt || 0, color: 'text-amber-600 bg-amber-50', icon: TrendingUp },
    { label: 'ديون معلقة', value: summary?.pending_debt || 0, color: 'text-blue-600 bg-blue-50', icon: Wallet },
  ];

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold font-arabic">كشف الحساب</h2>
        <p className="text-xs text-muted-foreground font-arabic mt-0.5">
          الديون والمدفوعات مع تجار الجملة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-arabic">{c.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-lg font-bold font-arabic tabular-nums">
                {formatCurrency(c.value)}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-arabic font-bold text-sm mb-3">سجل المعاملات</h3>
        {transactions.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl py-12 text-center">
            <Wallet size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-arabic text-muted-foreground text-sm">لا توجد معاملات بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => {
              const statusColor =
                t.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700'
                : t.payment_status === 'overdue' ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700';
              const statusLabel =
                t.payment_status === 'paid' ? 'مدفوع'
                : t.payment_status === 'overdue' ? 'متأخر'
                : t.payment_status === 'partial' ? 'جزئي'
                : 'معلق';

              return (
                <div key={t.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-arabic font-bold text-sm tabular-nums">
                      {t.transaction_number}
                    </span>
                    <span className={`text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-arabic text-xs text-muted-foreground">
                      الإجمالي: {formatCurrency(t.total_amount)}
                    </span>
                    <span className="font-arabic font-bold text-red-600 tabular-nums">
                      متبقي: {formatCurrency(t.remaining_amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
