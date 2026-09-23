'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { rpc } from '@/lib/supabase/rpc';
import { formatCurrency } from '@/lib/utils/format';
import Spinner from '@/components/ui/Spinner';

export default function DeliveryEarningsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await rpc.deliveryStats(user.id);
      setStats(s);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold font-arabic">أرباحي</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-arabic">إجمالي الأرباح</p>
            <Wallet size={16} className="text-violet-600" />
          </div>
          <p className="text-lg font-bold font-arabic tabular-nums">
            {formatCurrency(stats?.total_earnings || 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-arabic">أرباح اليوم</p>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-lg font-bold font-arabic tabular-nums">
            {formatCurrency(stats?.earnings_today || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
