'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { ShoppingBag, Clock, PackageCheck, Truck, ChevronDown, ChevronUp, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function RetailerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadOrders() {
      try {
        const all = await orderService.getAll();
        const retailerOrders = user?.uid ? all.filter((o) => o.retailerId === user.uid) : all;
        setOrders(retailerOrders);
      } catch (e) {
        console.error('Failed to load orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <AppLayout activeRoute="/orders">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">سجل طلباتي</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              تتبع مسار طلباتك من الموردين وحالة التوصيل
            </p>
          </div>
          <Link
            href="/retailer/catalog"
            className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold font-arabic hover:bg-primary/90 transition-colors self-start sm:self-auto"
          >
            طلب بضاعة جديدة
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'جميع الطلبات' },
            { id: 'pending', label: 'قيد المراجعة' },
            { id: 'delivering', label: 'جاري التوصيل' },
            { id: 'completed', label: 'المكتملة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-arabic transition-colors ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد طلبات في هذا التصنيف</h3>
            <p className="text-xs text-muted-foreground font-arabic mt-1 mb-4">
              يمكنك بدء طلب جديد من الموردين الآن
            </p>
            <Link
              href="/retailer/catalog"
              className="inline-flex text-xs font-bold text-primary hover:underline font-arabic"
            >
              الانتقال إلى الكتالوج
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const isExpanded = expandedOrders[ord.id];
              return (
                <div
                  key={ord.id}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
                        #
                      </div>
                      <div>
                        <p className="font-mono font-bold text-sm text-foreground">{ord.orderNumber}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-arabic mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {ord.placedAt.substring(0, 10)}
                          </span>
                          <span>•</span>
                          <span>{ord.items.length} أصناف</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground font-arabic">المبلغ الإجمالي</p>
                        <p className="text-sm font-black text-foreground font-arabic">
                          {ord.total.toLocaleString()} د.ع
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold font-arabic ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : ord.status === 'delivering'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {ord.status === 'completed'
                          ? 'تم التسليم'
                          : ord.status === 'delivering'
                          ? 'جاري التوصيل'
                          : 'قيد المراجعة'}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleExpand(ord.id)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items & Address */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <h4 className="text-xs font-bold text-foreground font-arabic">تفاصيل الأصناف:</h4>
                      <div className="bg-background rounded-xl border border-border divide-y divide-border overflow-hidden">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs font-arabic">
                            <div>
                              <span className="font-bold text-foreground">{it.name}</span>
                              <span className="text-muted-foreground mr-2">
                                ({it.qty} {it.unit})
                              </span>
                            </div>
                            <span className="font-semibold text-foreground">
                              {(it.qty * it.unitPrice).toLocaleString()} د.ع
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic bg-muted/40 p-3 rounded-xl">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        <span>عنوان التوصيل: {ord.delivery.address}، {ord.delivery.city}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
