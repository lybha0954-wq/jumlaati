'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { rpc } from '@/lib/supabase/rpc';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/format';

export default function SupplierFinancePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await rpc.supplierStats(user.id);
      setStats(s);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const cards = [
    { label: 'إجمالي المبيعات', value: stats?.total_sales || 0, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'أرباح اليوم', value: stats?.today_sales || 0, icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
    { label: 'منتجات منخفضة', value: stats?.low_stock_products || 0, icon: Package, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold font-arabic">المالية</h2>

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
              <p className="text-xl font-bold font-arabic tabular-nums">
                {c.label.includes('منتجات') ? c.value : formatCurrency(c.value)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="font-arabic text-muted-foreground text-sm">
          سيتم عرض تفاصيل الحسابات والديون هنا
        </p>
      </div>
    </div>
  );
}
