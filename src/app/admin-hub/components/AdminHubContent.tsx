'use client';
import React from 'react';
import { TrendingUp, ShoppingBag, Users, Percent, Activity, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminHubContent() {
  const kpis = [
    { label: 'إجمالي المبيعات', value: '—', icon: ShoppingBag, bg: 'from-blue-500 to-blue-600' },
    { label: 'عمولات المنصة', value: '—', icon: Percent, bg: 'from-violet-500 to-violet-600' },
    { label: 'الطلبات النشطة', value: '—', icon: Activity, bg: 'from-amber-500 to-orange-500' },
    { label: 'مستخدمون جدد', value: '—', icon: Users, bg: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">مركز التحكم</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">رؤية شاملة للمنصة</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-arabic font-semibold px-2.5 py-1 rounded-lg border text-emerald-700 bg-emerald-50 border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500" />
          مباشر
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <div key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} rounded-2xl p-4 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-arabic font-medium text-white/80">{kpi.label}</p>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <KpiIcon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-arabic tabular-nums leading-none">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-blue-600" />
          </div>
          <h2 className="font-arabic font-bold text-sm text-foreground">آخر النشاطات</h2>
        </div>
        <p className="text-xs text-muted-foreground font-arabic py-4 text-center">لا توجد نشاطات حتى الآن</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin-users" className="flex items-center gap-3 p-4 rounded-2xl border bg-violet-50 border-violet-200 hover:opacity-90 transition-all">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <Users size={17} className="text-violet-600" />
          </div>
          <span className="font-arabic font-semibold text-sm text-violet-600">إدارة المستخدمين</span>
        </Link>
        <Link href="/admin-transactions" className="flex items-center gap-3 p-4 rounded-2xl border bg-blue-50 border-blue-200 hover:opacity-90 transition-all">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <BarChart2 size={17} className="text-blue-600" />
          </div>
          <span className="font-arabic font-semibold text-sm text-blue-600">المعاملات المالية</span>
        </Link>
      </div>
    </div>
  );
}
