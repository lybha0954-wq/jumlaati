'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { productService, Product } from '@/lib/services/productService';
import {
  Truck,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SupplierDashboardPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [allOrders, allProducts] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
    } catch (e) {
      console.error('Error loading supplier dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const ok = await orderService.updateStatus(orderId, newStatus);
    if (ok) {
      toast.success('تم تحديث حالة الطلب بنجاح');
      loadData();
    } else {
      toast.error('تعذر تحديث حالة الطلب');
    }
  };

  const businessName = profile?.businessName || profile?.fullName || 'المورد';
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'reviewing');
  const lowStockProducts = products.filter((p) => p.status === 'منخفض' || p.stock <= (p.minOrderQty * 2));

  return (
    <AppLayout activeRoute="/">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck size={20} className="text-blue-300" />
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">بوابة كبار الموردين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-arabic">
              لوحة تحكم، {businessName} 📦
            </h1>
            <p className="text-white/80 text-sm mt-1 max-w-xl font-arabic">
              أدر طلبيات محلات التجزئة، المخزون، والعمليات المالية بدقة وسرعة
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/supplier/inventory"
              className="bg-white text-blue-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2 font-arabic"
            >
              <Plus size={16} />
              إضافة بضاعة جديدة
            </Link>
            <Link
              href="/supplier/orders"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors font-arabic"
            >
              الطلبات الواردة ({pendingOrders.length})
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">طلبات بانتظار الموافقة</p>
              <p className="text-xl font-black text-foreground font-arabic">{pendingOrders.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">حجم المبيعات الإجمالي</p>
              <p className="text-lg font-black text-foreground font-arabic truncate">
                {totalRevenue.toLocaleString()} د.ع
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">إجمالي المنتجات</p>
              <p className="text-xl font-black text-foreground font-arabic">{products.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">تنبيهات انخفاض المخزون</p>
              <p className="text-xl font-black text-foreground font-arabic">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>

        {/* Recent Incoming Orders */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground font-arabic">الطلبات الواردة الحديثة</h2>
            <Link
              href="/supplier/orders"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1 font-arabic"
            >
              عرض جميع الطلبات
              <ArrowLeft size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="h-36 bg-muted/40 rounded-xl animate-pulse" />
          ) : orders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl">
              <Truck size={36} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground font-arabic">لا توجد طلبيات واردة بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.slice(0, 6).map((ord) => (
                <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">{ord.orderNumber}</span>
                      <span className="text-xs font-bold text-primary font-arabic">{ord.buyer.storeName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                      {ord.buyer.name} • {ord.delivery.city} • {ord.items.length} أصناف
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm font-black text-foreground font-arabic">
                      {ord.total.toLocaleString()} د.ع
                    </span>

                    {ord.status === 'pending' || ord.status === 'reviewing' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'delivering')}
                          className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold font-arabic hover:bg-primary/90"
                        >
                          شحن الطلب
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                          className="bg-rose-500/10 text-rose-600 text-xs px-2.5 py-1.5 rounded-lg font-bold font-arabic hover:bg-rose-500/20"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold font-arabic ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : ord.status === 'delivering'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {ord.status === 'completed'
                          ? 'مكتمل'
                          : ord.status === 'delivering'
                          ? 'جاري الشحن'
                          : ord.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
