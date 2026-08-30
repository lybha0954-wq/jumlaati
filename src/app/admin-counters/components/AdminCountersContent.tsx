'use client';

import React, { useState } from 'react';
import { Activity, Store, Building2, Truck, ShoppingBag, DollarSign, ArrowUpRight, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function AdminCountersContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [counters, setCounters] = useState({
    activeSuppliers: 42,
    activeRetailers: 128,
    activeDrivers: 85,
    todayOrders: 314,
    todayVolume: '48,200 ر.س',
    pendingApprovals: 6,
    systemLoad: '14.2%',
    uptime: '99.98%'
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">عدادات ومؤشرات أداء المنصة (Live Counters)</h1>
            <p className="text-sm text-gray-500 mt-1">متابعة لحظية ومباشرة لكافة العمليات، الحسابات، الأعداد، وأحمال النظام التشغيلية.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>العدادات تعمل بشكل حي ومباشر</span>
            </div>
            
            <button 
              onClick={handleRefresh}
              className={`p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all ${isRefreshing ? 'rotate-180' : ''}`}
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* شبكة العدادات الرئيسية (KPI Counters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* عداد الموردين */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group hover:border-blue-200 transition-all">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>الموردين النشطين</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{counters?.activeSuppliers}</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+3 موردين جدد اليوم</span>
            </div>
          </div>

          {/* عداد المحلات والسوبرماركت */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>المحلات والسوبرماركت</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{counters?.activeRetailers}</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12 فرع هذا الأسبوع</span>
            </div>
          </div>

          {/* عداد السائقين */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group hover:border-amber-200 transition-all">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>سائقين التوصيل المتاحين</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{counters?.activeDrivers}</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>معدل استجابة سريع</span>
            </div>
          </div>

          {/* عداد الطلبات اليومية */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>طلبات اليوم الكلية</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{counters?.todayOrders}</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18% عن أمس</span>
            </div>
          </div>

        </div>

        {/* قسم العدادات التفصيلية والأداء التشغيلي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* المالية وحجم التداولات */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">حجم التدفقات المالية اليوم</h2>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 pt-2">{counters?.todayVolume}</div>
            <p className="text-xs text-gray-400 leading-relaxed">إجمالي قيمة أوامر الشراء والعمولات المحسوبة للمنصة خلال الـ 24 ساعة الماضية.</p>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500">حالة التسويات:</span>
              <span className="font-bold text-emerald-600">مكتملة ومستقرة</span>
            </div>
          </div>

          {/* الطلبات المعلقة بانتظار الاعتماد */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">الطلبات المعلقة للمراجعة</h2>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 pt-2">{counters?.pendingApprovals} طلبات</div>
            <p className="text-xs text-gray-400 leading-relaxed">تشمل طلبات إضافة مورّدين جدد، تسجيل فروع جديدة، وطلبات ربط سائقي التوصيل.</p>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500">الإجراء المطلوب:</span>
              <span className="font-bold text-blue-600 cursor-pointer hover:underline">مراجعة الاعتمادات ←</span>
            </div>
          </div>

          {/* استقرار وأحمال النظام */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">حالة استقرار النظام (Servers)</h2>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-600">معدل استهلاك الخوادم:</span>
                  <span className="text-blue-600">{counters?.systemLoad}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '14.2%' }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-gray-500">نسبة الجاهزية (Uptime):</span>
                <span className="font-bold text-emerald-600">{counters?.uptime}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>كافة الخدمات تعمل بكفاءة عالية</span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
