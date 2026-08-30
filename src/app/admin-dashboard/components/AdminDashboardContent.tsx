'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Store, ArrowUpRight } from 'lucide-react';

export function AdminDashboardContent() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalRevenue: 48520,
    activeUsers: 1420,
    pendingOrders: 86,
    activeSuppliers: 34,
  });
  const [loading, setLoading] = useState(false);

  const salesData = [
    { day: 'السبت', sales: 4200 },
    { day: 'الأحد', sales: 5800 },
    { day: 'الإثنين', sales: 6100 },
    { day: 'الثلاثاء', sales: 7500 },
    { day: 'الأربعاء', sales: 8400 },
    { day: 'الخميس', sales: 9200 },
    { day: 'الجمعة', sales: 7300 },
  ];

  return (
    <div className="space-y-8 p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">نظرة عامة على المنصة</h1>
          <p className="text-slate-400 text-sm mt-1">مرحباً بك مجدداً، إليك ملخص العمليات والنشاط المالي في جُمْلَتِي.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            النظام يعمل بكفاءة
          </span>
        </div>
      </div>

      {/* بطاقات المؤشرات الحية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-white mt-2">${stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-400 gap-1 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.4% مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">المستخدمون النشطون</p>
              <h3 className="text-2xl font-bold text-white mt-2">+{stats.activeUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-400 gap-1 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.1% انضمام تجار جدد</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">الطلبات المعلقة</p>
              <h3 className="text-2xl font-bold text-white mt-2">{stats.pendingOrders}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-amber-400 gap-1 font-medium">
            <span>تتطلب متابعة وتوجيه</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">الموردون النشطون</p>
              <h3 className="text-2xl font-bold text-white mt-2">{stats.activeSuppliers}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-blue-400 gap-1 font-medium">
            <span>نشطون ومحدثون للمخزون</span>
          </div>
        </div>
      </div>

      {/* الرسم البياني للمبيعات الأسبوعية */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">تحليل المبيعات الأسبوعية</h3>
            <p className="text-xs text-slate-400 mt-0.5">حجم المبيعات الكلي خلال الأيام السبعة الماضية</p>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
              />
              <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
