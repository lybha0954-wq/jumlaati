'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { ShoppingBag, Search, Calendar, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const loadOrders = async () => {
    try {
      const all = await orderService.getAll();
      setOrders(all);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const ok = await orderService.updateStatus(id, status);
    if (ok) {
      toast.success('تم تحديث حالة الطلب بنجاح');
      loadOrders();
    } else {
      toast.error('تعذر تحديث حالة الطلب');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const numMatch = (o.orderNumber || '').toLowerCase().includes(search.toLowerCase());
    const storeMatch = (o.buyer?.storeName || '').toLowerCase().includes(search.toLowerCase());
    const buyerMatch = (o.buyer?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && (numMatch || storeMatch || buyerMatch);
  });

  return (
    <AppLayout activeRoute="/admin-hub">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">سجل الطلبيات المركزي</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              مراقبة جميع عمليات الشراء والتوريد بين المحلات والموردين في كافة المحافظات
            </p>
          </div>
          <div className="text-xs bg-card border border-border px-3.5 py-2 rounded-xl text-muted-foreground font-arabic">
            إجمالي الطلبيات: <span className="font-bold text-foreground">{orders.length}</span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الطلب، اسم المحل، أو اسم العميل..."
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'جميع الطلبات' },
              { id: 'pending', label: 'قيد الانتظار' },
              { id: 'delivering', label: 'قيد التوصيل' },
              { id: 'completed', label: 'المكتملة' },
              { id: 'cancelled', label: 'الملغاة' },
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
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد طلبيات مطابقة للبحث</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ord) => {
              const isExp = expanded[ord.id];
              return (
                <div
                  key={ord.id}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">{ord.orderNumber}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary font-arabic">
                          {ord.buyer.storeName}
                        </span>
                        <span className="text-xs text-muted-foreground font-arabic">
                          ({ord.delivery.city})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-arabic mt-1">
                        <span>العميل: {ord.buyer.name}</span>
                        <span>•</span>
                        <span dir="ltr">{ord.buyer.phone}</span>
                        <span>•</span>
                        <span>{ord.items.length} أصناف</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">
                          عمولة المنصة: {(ord.commission || Math.round(ord.total * 0.025)).toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground font-arabic">إجمالي الفاتورة</p>
                        <p className="text-base font-black text-foreground font-arabic">
                          {ord.total.toLocaleString()} د.ع
                        </p>
                      </div>

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-arabic font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="pending">قيد المراجعة</option>
                        <option value="delivering">جاري الشحن</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setExpanded((p) => ({ ...p, [ord.id]: !p[ord.id] }))}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {isExp && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <h4 className="text-xs font-bold text-foreground font-arabic">أصناف الفاتورة:</h4>
                      <div className="bg-background rounded-xl border border-border divide-y divide-border overflow-hidden">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs font-arabic">
                            <div>
                              <span className="font-bold text-foreground">{it.name}</span>
                              <span className="text-muted-foreground mr-2">
                                ({it.qty} {it.unit} × {it.unitPrice.toLocaleString()} د.ع)
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
                        <span>عنوان التوصيل المسجل: {ord.delivery.address}، {ord.delivery.city}</span>
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
