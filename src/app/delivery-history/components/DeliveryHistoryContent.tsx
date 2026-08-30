'use client';

import React from 'react';
import { 
  History, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Search, 
  Download, 
  Filter, 
  Eye 
} from 'lucide-react';

export default function DeliveryHistoryContent() {
  const historyRecords = [
    { 
      id: '#HIS-501', 
      customer: 'أحمد كاظم', 
      driver: 'حيدر كريم', 
      date: '2026-06-06', 
      status: 'مكتملة', 
      amount: '50,000 د.ع' 
    },
    { 
      id: '#HIS-502', 
      customer: 'نور الهدى', 
      driver: 'كرار محمد', 
      date: '2026-06-05', 
      status: 'ملغاة', 
      amount: '25,000 د.ع' 
    },
    { 
      id: '#HIS-503', 
      customer: 'مصطفى جواد', 
      driver: 'علي حسين', 
      date: '2026-06-05', 
      status: 'مكتملة', 
      amount: '120,000 د.ع' 
    },
    { 
      id: '#HIS-504', 
      customer: 'زهراء عبد الله', 
      driver: 'محمد رضا', 
      date: '2026-06-04', 
      status: 'مكتملة', 
      amount: '40,000 د.ع' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">

      {/* شريط التنقل العلوي */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-2 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">سجل التوصيل والارشيف</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="بحث في السجل..." 
              className="bg-gray-100 pr-10 pl-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition">
            <Download className="w-4 h-4" />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">

        {/* بطاقات الإحصائيات الخاصة بالسجل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي الطلبات المؤرشفة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">14,890</h3>
              <span className="text-xs text-purple-600 font-semibold mt-1 block">منذ بداية العمل</span>
            </div>
            <div className="bg-purple-50 text-purple-600 p-4 rounded-xl">
              <History className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">الطلبات المكتملة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">14,210</h3>
              <span className="text-xs text-green-600 font-semibold mt-1 block">بنسبة نجاح عالية</span>
            </div>
            <div className="bg-green-50 text-green-600 p-4 rounded-xl">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">الطلبات الملغاة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">680</h3>
              <span className="text-xs text-red-600 font-semibold mt-1 block">تم إلغاؤها لأسباب مختلفة</span>
            </div>
            <div className="bg-red-50 text-red-600 p-4 rounded-xl">
              <XCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* جدول السجل التاريخي */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">أرشيف العمليات السابقة</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              <span>تصفية بالتاريخ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6">رقم السجل</th>
                  <th className="py-3 px-6">العميل</th>
                  <th className="py-3 px-6">المندوب المسؤول</th>
                  <th className="py-3 px-6">التاريخ</th>
                  <th className="py-3 px-6">الحالة النهائية</th>
                  <th className="py-3 px-6">المبلغ</th>
                  <th className="py-3 px-6 text-center">عرض</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {historyRecords?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-purple-600">{record?.id}</td>
                    <td className="py-4 px-6 text-gray-900">{record?.customer}</td>
                    <td className="py-4 px-6 text-gray-600">{record?.driver}</td>
                    <td className="py-4 px-6 text-gray-500 flex items-center gap-1.5 pt-5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{record?.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record?.status === 'مكتملة' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {record?.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">{record?.amount}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-gray-400 hover:text-purple-600 p-1.5 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
