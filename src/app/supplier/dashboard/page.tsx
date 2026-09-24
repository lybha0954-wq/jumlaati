'use client';
import { Card } from '@/components/ui/Card';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function SupplierDashboard() {
  const stats = [
    { title: 'إجمالي المبيعات', value: '0 د.ع', icon: DollarSign, color: 'text-emerald-500' },
    { title: 'الطلبات الجديدة', value: '0 طلب', icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'المنتجات النشطة', value: '0 منتج', icon: Package, color: 'text-amber-500' },
    { title: 'معدل النمو', value: '0%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="p-4 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
            <s.icon size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-arabic">{s.title}</p>
            <p className="text-lg font-bold font-arabic">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
