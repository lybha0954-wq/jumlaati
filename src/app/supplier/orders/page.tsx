'use client';

import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, type OrderSummary } from '@/lib/services/orderService';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';

export default function SupplierOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const result = await orderService.getSupplierOrders(user.id);
      setOrders(result.data);
      setLoading(false);
    })();
  }, [user]);

  const handleUpdate = async (id: string, status: string) => {
    const ok = await orderService.updateStatus(id, status);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold font-arabic">الطلبات الواردة</h2>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-16 text-center">
          <ClipboardList size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-arabic text-muted-foreground text-sm">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-arabic font-bold text-sm tabular-nums">{o.orderNumber}</span>
                <StatusBadge status={o.status} size="sm" />
              </div>
              <p className="font-arabic text-xs text-muted-foreground mb-2">
                {o.buyerStoreName} · {o.itemsCount} منتجات · {formatRelativeTime(o.placedAt)}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-arabic font-bold text-primary tabular-nums">
                  {formatCurrency(o.total)}
                </span>
                {o.status === 'reviewing' && (
                  <button
                    onClick={() => handleUpdate(o.id, 'delivering')}
                    className="bg-primary text-white text-xs font-arabic px-3 py-1.5 rounded-lg"
                  >
                    قبول الطلب
                  </button>
                )}
                {o.status === 'delivering' && (
                  <button
                    onClick={() => handleUpdate(o.id, 'completed')}
                    className="bg-emerald-500 text-white text-xs font-arabic px-3 py-1.5 rounded-lg"
                  >
                    تأكيد التسليم
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
