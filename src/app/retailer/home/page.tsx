'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { productService, Product } from '@/lib/services/productService';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import {
  ShoppingBag,
  Store,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Package,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RetailerHomePage() {
  const { user, profile } = useAuth();
  const { addItem, itemCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, ords] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
        ]);
        setProducts(prods.slice(0, 8));
        // Filter orders for this retailer if uid exists
        const userOrders = user?.uid ? ords.filter((o) => o.retailerId === user.uid) : ords;
        setOrders(userOrders.slice(0, 5));
      } catch (e) {
        console.error('Error loading retailer home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleAddToCart = (product: Product) => {
    addItem(product, product.minOrderQty || 1);
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const storeName = profile?.businessName || profile?.fullName || user?.user_metadata?.business_name || 'محلي';
  const activeOrdersCount = orders.filter((o) => ['pending', 'reviewing', 'delivering'].includes(o.status)).length;

  return (
    <AppLayout activeRoute="/retailer-shop">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store size={22} className="text-white/80" />
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">بوابة أصحاب المحلات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-arabic">
              أهلاً بك، {storeName} 👋
            </h1>
            <p className="text-white/80 text-sm mt-1 max-w-xl font-arabic">
              اطلب بضائعك بالجملة مباشرة من الموردين بأفضل الأسعار وبدون وساطة
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/retailer/catalog"
              className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2 font-arabic"
            >
              <ShoppingBag size={16} />
              تصفح البضائع
            </Link>
            <Link
              href="/retailer/cart"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 font-arabic"
            >
              السلة ({itemCount})
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">الطلبات النشطة</p>
              <p className="text-xl font-black text-foreground font-arabic">{activeOrdersCount}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">عناصر السلة</p>
              <p className="text-xl font-black text-foreground font-arabic">{itemCount}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">إجمالي الطلبات</p>
              <p className="text-xl font-black text-foreground font-arabic">{orders.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center flex-shrink-0">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-arabic">المنتجات المتوفرة</p>
              <p className="text-xl font-black text-foreground font-arabic">{products.length}</p>
            </div>
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground font-arabic">بضائع ومنتجات الجملة المتاحة</h2>
            </div>
            <Link
              href="/retailer/catalog"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1 font-arabic"
            >
              عرض الكل
              <ArrowLeft size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Package size={36} className="mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-bold text-foreground font-arabic">لا توجد منتجات معروضة حالياً</p>
              <p className="text-xs text-muted-foreground font-arabic mt-1">
                سيقوم الموردون بإضافة المنتجات والمخزون قريباً
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-border rounded-xl p-4 bg-background hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-arabic">
                        {p.category}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded font-arabic ${
                          p.stock <= 0
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {p.stock <= 0 ? 'نفد' : 'متوفر'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground font-arabic mb-1 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-arabic mb-3">
                      {p.supplierName} • {p.unit}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-arabic">السعر</p>
                      <p className="text-base font-black text-primary font-arabic">
                        {p.finalPrice.toLocaleString()} <span className="text-xs">د.ع</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      disabled={p.stock <= 0}
                      className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      title="إضافة إلى السلة"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground font-arabic">طلباتي الأخيرة</h2>
            <Link
              href="/retailer/orders"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1 font-arabic"
            >
              جميع الطلبات
              <ArrowLeft size={14} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-xl">
              <ShoppingBag size={32} className="mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-xs text-muted-foreground font-arabic">لم تقم بإجراء أي طلبات حتى الآن</p>
              <Link
                href="/retailer/catalog"
                className="inline-block mt-3 text-xs font-bold text-primary hover:underline font-arabic"
              >
                تصفح المنتجات وابدأ أول طلب
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono font-bold text-foreground">{ord.orderNumber}</p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {ord.items.length} أصناف • {ord.placedAt.substring(0, 10)}
                    </p>
                  </div>
                  <div className="text-left flex items-center gap-4">
                    <span className="text-sm font-bold text-foreground font-arabic">
                      {ord.total.toLocaleString()} د.ع
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold font-arabic ${
                        ord.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : ord.status === 'delivering'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {ord.status === 'completed'
                        ? 'مكتمل'
                        : ord.status === 'delivering'
                        ? 'جاري التوصيل'
                        : 'قيد المراجعة'}
                    </span>
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
