'use client';

import { Package, ShoppingCart, Wallet, TrendingUp } from 'lucide-react';

export default function SupplierDashboardPage() {
  const cards = [
    { label: 'مبيعات اليوم', value: 0, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'الطلبات الجديدة', value: 0, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600' },
    { label: 'المنتجات', value: 0, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'ديون مستحقة', value: 0, icon: Wallet, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-arabic">لوحة المورد</h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          نظرة سريعة على أداء متجرك
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
          ستظهر هنا الطلبات الواردة وآخر النشاطات
        </p>
      </div>
    </div>
  );
}
