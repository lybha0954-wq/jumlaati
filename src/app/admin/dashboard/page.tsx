'use client';
import { Card } from '@/components/ui/Card';
import { Users, Store, Truck, ShoppingBag } from 'lucide-react';
export default function AdminDashboard() {
  const stats = [
    { title: 'المستخدمون', value: '0', icon: Users, color: 'text-blue-500' },
    { title: 'المتاجر', value: '0', icon: Store, color: 'text-emerald-500' },
    { title: 'الموردون', value: '0', icon: ShoppingBag, color: 'text-amber-500' },
    { title: 'المناديب', value: '0', icon: Truck, color: 'text-purple-500' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="p-4 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-muted ${s.color}`}><s.icon size={24} /></div>
          <div><p className="text-xs text-muted-foreground font-arabic">{s.title}</p><p className="text-lg font-bold font-arabic">{s.value}</p></div>
        </Card>
      ))}
    </div>
  );
}
