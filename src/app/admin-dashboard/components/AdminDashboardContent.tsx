'use client';

import React from 'react';
import { Store, Building2, ShoppingBag, DollarSign, ArrowUpRight, Activity } from 'lucide-react';

export default function AdminDashboardContent() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس لوحة التحكم */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المشرف (Admin Dashboard)</h1>
            <p className="text-sm text-gray-500 mt-1">نظرة عامة على النظام، إحصائيات الموردين، الفروع النشطة، وحجم العمليات الكلي.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold">
            <Activity className="w-4 h-4" />
            <span>النظام يعمل بكفاءة عالية</span>
          </div>
        </header>

        {/* بطاقات الإحصائيات الرئيسية (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>إجمالي الموردين المسجلين</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">42 مورد</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3 موردين جدد هذا الشهر</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>إجمالي الفروع والمطاعم</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">128 فرع</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12 فرع نشط</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>إجمالي أوامر الشراء</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">1,450 طلب</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18% معدل نمو الطلبات</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>إجمالي حجم التداولات</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">2.4 مليون ر.س</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>مستقر ومحدث</span>
            </div>
          </div>

        </div>

        {/* قسم النشاطات الحديثة وإدارة الطلبات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* آخر العمليات المسجلة في النظام */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900">أحدث العمليات وأوامر الشراء في النظام</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold bg-gray-50/50">
                    <th className="p-3">رقم الطلب</th>
                    <th className="p-3">الفرع / المطعم</th>
                    <th className="p-3">المورد</th>
                    <th className="p-3">القيمة</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-blue-600">ORD-901</td>
                    <td className="p-3 font-semibold text-gray-900">مطعم البرجر الذهبي</td>
                    <td className="p-3 text-gray-600">شركة التغليف الذكي</td>
                    <td className="p-3 font-bold text-gray-900">1,450 ر.س</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">مكتمل</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-blue-600">ORD-902</td>
                    <td className="p-3 font-semibold text-gray-900">بيتزا روما (فرع التحلية)</td>
                    <td className="p-3 text-gray-600">مؤسسة النظافة الشاملة</td>
                    <td className="p-3 font-bold text-gray-900">820 ر.س</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">جاري الشحن</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-blue-600">ORD-903</td>
                    <td className="p-3 font-semibold text-gray-900">حلويات الشرق</td>
                    <td className="p-3 text-gray-600">مصنع البلاستيك الحديث</td>
                    <td className="p-3 font-bold text-gray-900">3,100 ر.س</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">قيد المعالجة</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* تنبيهات النظام وإجراءات سريعة */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900">طلبات اعتماد الموردين الجدد</h2>
            
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xs text-gray-900">مصنع الأغطية المتطورة</h3>
                    <span className="text-[11px] text-gray-400">تغليف ومستلزمات بلاستيكية</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-semibold">بانتظار الاعتماد</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-medium transition-all">قبول واعتماد</button>
                  <button className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 rounded-lg text-xs font-medium transition-all">رفض</button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xs text-gray-900">مؤسسة الحلول الغذائية</h3>
                    <span className="text-[11px] text-gray-400">مواد أولية ومخزون</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-semibold">بانتظار الاعتماد</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-medium transition-all">قبول واعتماد</button>
                  <button className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 rounded-lg text-xs font-medium transition-all">رفض</button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
