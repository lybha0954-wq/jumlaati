'use client';

import React, { useState } from 'react';
import { BarChart3, Store, Building2, DollarSign, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalyticsContent() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">التقارير وتحليلات النظام (Analytics)</h1>
            <p className="text-sm text-gray-500 mt-1">مؤشرات الأداء العامة، حجم التداولات المالية، ونمو عدد الموردين والفروع في المنصة.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              >
                شهري
              </button>
              <button 
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === 'quarter' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              >
                ربعي
              </button>
              <button 
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              >
                سنوي
              </button>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm">
              <Download className="w-4 h-4" />
              <span>تصدير التقرير</span>
            </button>
          </div>
        </header>

        {/* بطاقات الإحصائيات التحليلية الكبرى */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>إجمالي العائدات المالية</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">480,500 ر.س</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% مقارنة بالفترة السابقة</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>أوامر الشراء المنجزة</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">3,120 طلب</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.5% نمو حجم الطلبات</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>الموردين النشطين</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">42 مورد</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+3 موردين جدد</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
              <span>الفروع والمطاعم المسجلة</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">128 فرع</div>
            <div className="flex items-center gap-1 text-rose-600 text-xs font-semibold">
              <ArrowDownRight className="w-4 h-4" />
              <span>-1.2% تباطؤ طفيف</span>
            </div>
          </div>

        </div>

        {/* قسم الرسومات البيانية التفصيلية (محاكاة بصرية متطورة) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* حركة النمو المالي الشهرية */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-900">تحليل العائدات والتداولات الشهرية</h2>
                <p className="text-xs text-gray-400">إحصاءات التدفق المالي وحجم المبيعات خلال الأشهر الماضية.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">محدث تلقائياً</span>
            </div>

            {/* تمثيل تخطيطي بصري للأعمدة البيانية */}
            <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-gray-100">
              <div className="w-full bg-blue-50 hover:bg-blue-100 rounded-t-xl transition-all h-[40%] relative group flex flex-col items-center">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-all">45 ألف</span>
                <span className="text-[11px] font-medium text-gray-400 mt-auto pb-2">يناير</span>
              </div>
              <div className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-xl transition-all h-[60%] relative group flex flex-col items-center">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-all">65 ألف</span>
                <span className="text-[11px] font-medium text-gray-400 mt-auto pb-2">فبراير</span>
              </div>
              <div className="w-full bg-blue-300 hover:bg-blue-400 rounded-t-xl transition-all h-[55%] relative group flex flex-col items-center">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-all">58 ألف</span>
                <span className="text-[11px] font-medium text-gray-400 mt-auto pb-2">مارس</span>
              </div>
              <div className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-xl transition-all h-[80%] relative group flex flex-col items-center text-white">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all">90 ألف</span>
                <span className="text-[11px] font-medium text-white/80 mt-auto pb-2">أبريل</span>
              </div>
              <div className="w-full bg-blue-400 hover:bg-blue-500 rounded-t-xl transition-all h-[70%] relative group flex flex-col items-center text-white">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all">78 ألف</span>
                <span className="text-[11px] font-medium text-white/80 mt-auto pb-2">مايو</span>
              </div>
              <div className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-xl transition-all h-[95%] relative group flex flex-col items-center text-white">
                <span className="absolute -top-7 text-[10px] font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all">115 ألف</span>
                <span className="text-[11px] font-medium text-white/80 mt-auto pb-2">يونيو</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 px-2 pt-2">
              <span>إجمالي النصف الأول: 451 ألف ر.س</span>
              <span className="text-emerald-600 font-bold">معدل النمو: +22%</span>
            </div>
          </div>

          {/* الفئات والقطاعات الأكثر طلباً */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900">القطاعات الأكثر طلباً</h2>
            <p className="text-xs text-gray-400">توزيع الطلبات حسب تصنيف الموردين والمنتجات الاستهلاكية.</p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">التغليف ومستلزمات بلاستيكية</span>
                  <span className="text-blue-600">45%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">المواد الغذائية والأولية</span>
                  <span className="text-indigo-600">30%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">مواد النظافة والتعقيم</span>
                  <span className="text-emerald-600">15%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">أخرى ومعدات مساندة</span>
                  <span className="text-amber-600">10%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
