'use client';

import { Package, ShoppingCart, Wallet, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function RetailerHomePage() {
  const quickActions = [
    { label: 'تصفح الكتالوج', href: '/retailer/catalog', icon: Package, color: 'bg-blue-500' },
    { label: 'سلة الطلب', href: '/retailer/cart', icon: ShoppingCart, color: 'bg-emerald-500' },
    { label: 'طلباتي', href: '/retailer/orders', icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'كشف الحساب', href: '/retailer/ledger', icon: Wallet, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-arabic">مرحباً بك 👋</h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          ابدأ بتصفح الكتالوج أو تابع طلباتك
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center text-white`}>
                <Icon size={20} />
              </div>
              <p className="font-arabic font-bold text-foreground text-sm">{a.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="font-arabic text-muted-foreground text-sm">
          ستظهر هنا عروض اليوم وآخر الطلبات
        </p>
      </div>
    </div>
  );
}
