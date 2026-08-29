'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';

export default function SupplierAnalyticsContent() {
, timeRange, setTimeRange] = useState('الشهر الحالي');

  const stats = [
    { title: 'إجمالي المبيعات', value: '48,250 ر.س', change: '+12.4%', isPositive: true, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'الطلبات المكتملة', value: '342 طلب', change: '+8.1%', isPositive: true, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { title: 'متوسط قيمة الطلب', value: '141 ر.س', change: '-2.3%', isPositive: false, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    { title: 'المطاعم النشطة', value: '28 مطعم', change: '+15.0%', isPositive: true, icon: Users, color: 'text-amber-600 bg-amber-50' },
  ];

  const topProducts = [
    { name: 'أكياس ورقية بني (متوسط)', sales: '1,420 وحدة', revenue: '19,880 ر.س' },
    { name: 'علب وجبات برجر كرتون', sales: '980 وحدة', revenue: '15,680 ر.س' },
    { name: 'أكواب عصير بلاستيكية شفافة', sales: '2,100 وحدة', revenue: '10,500 ر.س' },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تقارير وتحليلات المورد</h1>
            <p className="text-sm text-gray-500 mt-1">نظرة شاملة على أداء المبيعات، الطلبات الأكثر طلباً، وتطور الأرباح.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
            >
              <option value="اليوم">اليوم</option>
              <option value="الأسبوع الحالي">الأسبوع الحالي</option>
              <option value="الشهر الحالي">الشهر الحالي</option>
              <option value="السنة الحالية">السنة الحالية</option>
            </select>
          </div>
        </header>

        {/* بطاقات الإحصائيات والأرقام */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">{stat.title}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <span className={`flex items-center text-xs font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" />}
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* قسم الرسوم البيانية التوضيحية والمنتجات الأكثر مبيعاً */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* محاكاة الرسم البياني للمبيعات */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>تطور المبيعات والأرباح</span>
                </h2>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">محدث فورياً</span>
              </div>

              {/* رسم بياني صوري توضيحي بالاعمدة */}
              <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2 border-b border-gray-100 pb-2">
                {[45, 60, 35, 80, 95, 70, 85, 100, 75, 90, 110, 125].map((val, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2 h-full justify-end group">
                    <div 
                      style={{ height: `${val}%` }} 
                      className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-lg transition-all duration-300 relative group-hover:shadow-md"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {val * 120} ر.س
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">أسبوع {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-xs text-gray-500 pt-2">
              <span>إجمالي النمو للفترة: <strong className="text-emerald-600">+18.2%</strong></span>
              <span>الهدف الشهري: <strong>60,000 ر.س</strong></span>
            </div>
          </div>

          {/* قائمة المنتجات الأعلى مبيعاً */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <span>المنتجات الأعلى مبيعاً</span>
            </h2>

            <div className="space-y-4 pt-2">
              {topProducts.map((prod, index) => (
                <div key={index} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800">{prod.name}</span>
                    <span className="text-xs font-bold text-blue-600">{prod.revenue}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span>المبيعات: {prod.sales}</span>
                    <span className="text-emerald-600 font-medium">نشط</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-xs leading-relaxed space-y-1">
                <p className="font-bold">نصيحة لتحسين الأداء:</p>
                <p>المنتجات الورقية تشهد طلباً أعلى بنسبة 35% مقارنة بالبلاستيك هذا الشهر. ننصح بزيادة المخزون المتوفر منها.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
