'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Percent, Activity, BarChart2, Package, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { userService } from '@/lib/services/userService';
import { productService } from '@/lib/services/productService';
import type { UserProfile } from '@/contexts/AuthContext';

export default function AdminHubContent() {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [allOrders, allUsers, allProducts] = await Promise.all([
          orderService.getAll(),
          userService.getAllUsers(),
          productService.getAll(),
        ]);
        setOrders(allOrders);
        setUsers(allUsers);
        setProductCount(allProducts.length);
      } catch (err) {
        console.error('Failed to load admin hub stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCommission = orders.reduce((sum, o) => sum + (o.commission || (o.total || 0) * 0.025), 0);
  const activeOrders = orders.filter((o) => ['pending', 'reviewing', 'delivering'].includes(o.status));

  const kpis = [
    {
      label: 'إجمالي المبيعات',
      value: `${totalSales.toLocaleString()} د.ع`,
      icon: ShoppingBag,
      bg: 'from-blue-600 to-indigo-600',
    },
    {
      label: 'عمولات المنصة',
      value: `${totalCommission.toLocaleString()} د.ع`,
      icon: Percent,
      bg: 'from-violet-600 to-purple-600',
    },
    {
      label: 'الطلبات النشطة',
      value: `${activeOrders.length}`,
      icon: Activity,
      bg: 'from-amber-500 to-orange-500',
    },
    {
      label: 'إجمالي المستخدمين',
      value: `${users.length}`,
      icon: Users,
      bg: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="space-y-6 pb-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-primary" />
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
              إدارة النظام المركزية
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground font-arabic">مركز التحكم والعمليات</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            مراقبة شاملة لكافة طلبات التوريد، المحلات، والموردين في العراق
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-arabic font-semibold px-3 py-1.5 rounded-xl border text-emerald-700 bg-emerald-50 border-emerald-200">
          <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
          قاعدة البيانات متصلة ومباشرة
        </span>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`bg-gradient-to-br ${kpi.bg} rounded-2xl p-5 text-white relative overflow-hidden shadow-sm`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-arabic font-medium text-white/90">{kpi.label}</p>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <KpiIcon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black font-arabic tabular-nums leading-none">
                  {loading ? '...' : kpi.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/admin/users"
          className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs font-bold font-arabic text-foreground">المستخدمون</p>
              <p className="text-[11px] text-muted-foreground font-arabic">{users.length} حساب</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-xs font-bold font-arabic text-foreground">جميع الطلبيات</p>
              <p className="text-[11px] text-muted-foreground font-arabic">{orders.length} طلب</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Package size={18} />
            </div>
            <div>
              <p className="text-xs font-bold font-arabic text-foreground">المنتجات</p>
              <p className="text-[11px] text-muted-foreground font-arabic">{productCount} منتج</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>

        <Link
          href="/admin/financials"
          className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <div>
              <p className="text-xs font-bold font-arabic text-foreground">التقارير المالية</p>
              <p className="text-[11px] text-muted-foreground font-arabic">العمولات والديون</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            <h2 className="font-arabic font-bold text-base text-foreground">آخر الطلبيات المسجلة بالمنصة</h2>
          </div>
          <Link href="/admin/orders" className="text-xs text-primary font-bold hover:underline font-arabic">
            عرض الأرشيف الكامل
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground font-arabic py-8 text-center">
            لا توجد طلبيات حتى الآن في قاعدة البيانات.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs font-arabic">
                <div>
                  <span className="font-mono font-bold text-foreground">{ord.orderNumber}</span>
                  <span className="text-muted-foreground mr-2">
                    بواسطة {ord.buyer.storeName} ({ord.delivery.city})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-foreground">{ord.total.toLocaleString()} د.ع</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      ord.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {ord.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
