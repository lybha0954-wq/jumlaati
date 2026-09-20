'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Wallet, TrendingUp, CheckCircle2, ArrowDownLeft, Clock, Calendar, Download, Building2, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryEarningsPage() {
  const earningsData = {
    today: 64000,
    thisWeek: 385000,
    thisMonth: 1420000,
    totalDeliveries: 142,
    pendingPayout: 48000,
  };

  const payoutHistory = [
    { id: 'PAY-901', date: 'اليوم، 02:30 م', route: 'من الشورجة إلى الكرادة', fee: 10000, collectedCash: 485000, status: 'مستلم' },
    { id: 'PAY-902', date: 'اليوم، 11:45 ص', route: 'من جميلة إلى زيونة', fee: 8000, collectedCash: 0, status: 'مستلم' },
    { id: 'PAY-903', date: 'اليوم، 09:15 ص', route: 'من الشورجة إلى المنصور', fee: 12000, collectedCash: 340000, status: 'مستلم' },
    { id: 'PAY-904', date: 'أمس، 04:20 م', route: 'من الكرادة إلى الجادرية', fee: 7000, collectedCash: 125000, status: 'مستلم' },
    { id: 'PAY-905', date: 'أمس، 01:10 م', route: 'من جميلة إلى الدورة', fee: 11000, collectedCash: 590000, status: 'مستلم' },
  ];

  return (
    <AppLayout activeRoute="/delivery/earnings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold font-arabic text-foreground">
              الأرباح والمحفظة المالية
            </h1>
            <p className="text-sm font-arabic text-muted-foreground mt-1">
              متابعة دقيقة لعمولات توصيل البضائع والمبالغ المحصلة كاش لصالح محلات الجملة
            </p>
          </div>
          <button
            onClick={() => toast.success('تم تصدير كشف الأرباح بصيغة PDF بنجاح')}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-arabic font-semibold text-foreground hover:bg-muted transition-colors w-fit"
          >
            <Download size={14} />
            تحميل كشف الحساب
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-arabic text-muted-foreground">أرباح اليوم</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wallet size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-arabic text-foreground mt-2 tabular-nums">
              {earningsData.today.toLocaleString('ar-IQ')} <span className="text-sm font-normal text-muted-foreground">د.ع</span>
            </p>
            <span className="text-[11px] font-arabic text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              +18% عن يوم أمس
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-arabic text-muted-foreground">أرباح هذا الأسبوع</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-arabic text-foreground mt-2 tabular-nums">
              {earningsData.thisWeek.toLocaleString('ar-IQ')} <span className="text-sm font-normal text-muted-foreground">د.ع</span>
            </p>
            <span className="text-[11px] font-arabic text-muted-foreground block mt-1">
              38 طلبية تم تسليمها
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-arabic text-muted-foreground">مجموع أرباح الشهر</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-arabic text-foreground mt-2 tabular-nums">
              {earningsData.thisMonth.toLocaleString('ar-IQ')} <span className="text-sm font-normal text-muted-foreground">د.ع</span>
            </p>
            <span className="text-[11px] font-arabic text-muted-foreground block mt-1">
              إجمالي {earningsData.totalDeliveries} طلبية
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-arabic text-muted-foreground">رصيد بانتظار التحويل</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-arabic text-foreground mt-2 tabular-nums">
              {earningsData.pendingPayout.toLocaleString('ar-IQ')} <span className="text-sm font-normal text-muted-foreground">د.ع</span>
            </p>
            <span className="text-[11px] font-arabic text-amber-600 block mt-1">
              يُحوّل لحسابك في نهاية اليوم
            </span>
          </div>
        </div>

        {/* Recent Deliveries & Payouts */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-arabic font-bold text-base text-foreground">
              سجل عمولات التوصيل الأخيرة
            </h3>
            <span className="text-xs font-arabic text-muted-foreground">
              تحديث فوري مع كل تسليم
            </span>
          </div>

          <div className="divide-y divide-border">
            {payoutHistory.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-arabic font-bold text-sm text-foreground">{item.route}</span>
                      <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.id}</span>
                    </div>
                    <span className="text-xs font-arabic text-muted-foreground block mt-0.5">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-left">
                  {item.collectedCash > 0 && (
                    <div className="text-right sm:text-left">
                      <span className="text-[10px] font-arabic text-muted-foreground block">كاش تم تحصيله للجملة</span>
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {item.collectedCash.toLocaleString('ar-IQ')} د.ع
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-arabic text-muted-foreground block">أجرك من التوصيل</span>
                    <span className="font-arabic font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{item.fee.toLocaleString('ar-IQ')} د.ع
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
