'use client';

import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalStores: 0,
    totalSuppliers: 0,
  });

  useEffect(() => {
    // سيتم الربط بـ RPC get_admin_dashboard_stats
  }, []);

  const cards = [
    { label: 'إجمالي المبيعات', value: stats.totalSales, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'الطلبات', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'المحلات', value: stats.totalStores, icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'تجار الجملة', value: stats.totalSuppliers, icon: Package, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-arabic">مرحباً بك 👋</h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          نظرة عامة على منصة جُمْلَتِي
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground font-arabic">{c.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums font-arabic">
                {c.value.toLocaleString('ar-IQ')}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="font-arabic text-muted-foreground text-sm">
          لوحة التحكم قيد التطوير — ستُعرض الإحصائيات الحية هنا
        </p>
      </div>
    </div>
  );
}
