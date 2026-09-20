'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { DollarSign, Percent, TrendingUp, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function AdminFinancialsPage() {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await orderService.getAll();
        setOrders(all);
      } catch (e) {
        console.error('Failed to load financial records:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCommission = orders.reduce(
    (sum, o) => sum + (o.commission || Math.round((o.total || 0) * 0.025)),
    0
  );
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const collectedCommission = completedOrders.reduce(
    (sum, o) => sum + (o.commission || Math.round((o.total || 0) * 0.025)),
    0
  );
  const pendingCommission = totalCommission - collectedCommission;

  return (
    <AppLayout activeRoute="/admin-hub">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground font-arabic">التقارير والمعاملات المالية</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-1">
            إجمالي التداولات التجارية، عمولات المنصة، وأرصدة التسوية
          </p>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-arabic">إجمالي حجم التعاملات (GMV)</span>
              <DollarSign size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-black text-foreground font-arabic">
              {totalGMV.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-arabic">إجمالي عمولات المنصة (2.5%)</span>
              <Percent size={18} className="text-violet-500" />
            </div>
            <p className="text-2xl font-black text-foreground font-arabic">
              {totalCommission.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-arabic">العمولات المحصلة (المكتملة)</span>
              <CheckCircle size={18} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 font-arabic">
              {collectedCommission.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-arabic">عمولات قيد التسليم</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600 font-arabic">
              {pendingCommission.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
            </p>
          </div>
        </div>

        {/* Financial Transactions List */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-base text-foreground font-arabic">سجل المعاملات والعمولات</h2>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-muted-foreground font-arabic py-8 text-center">
              لا توجد عمليات مالية مسجلة حتى الآن.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((ord) => {
                const comm = ord.commission || Math.round(ord.total * 0.025);
                return (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs font-arabic">
                    <div>
                      <p className="font-mono font-bold text-foreground">{ord.orderNumber}</p>
                      <p className="text-muted-foreground mt-0.5">
                        {ord.buyer.storeName} • {ord.placedAt.substring(0, 10)}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="font-bold text-foreground">قيمة الطلب: {ord.total.toLocaleString()} د.ع</p>
                      <p className="text-primary font-semibold">
                        العمولة: +{comm.toLocaleString()} د.ع
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
