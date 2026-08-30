'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle2, Truck, XCircle, Search, Filter, Plus, Eye } from 'lucide-react';

interface Order {
  id: string;
  supplierName: string;
  itemsSummary: string;
  totalAmount: string;
  orderDate: string;
  deliveryDate: string;
  status: 'قيد المعالجة' | 'جاري الشحن' | 'تم التسليم' | 'ملغي';
}

export default function RetailerOrdersContent() {
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-501', supplierName: 'شركة التغليف الذكي المحدودة', itemsSummary: 'علب برجر ورق (5 كرتون) + أكياس ورقية', totalAmount: '1,450 ر.س', orderDate: '2026-08-28', deliveryDate: '2026-08-30 المتوقع', status: 'جاري الشحن' },
    { id: 'ORD-502', supplierName: 'مؤسسة النظافة الشاملة للمطاعم', itemsSummary: 'مناديل مطاعم معقمة + منظفات أرضيات', totalAmount: '820 ر.س', orderDate: '2026-08-25', deliveryDate: '2026-08-26', status: 'تم التسليم' },
    { id: 'ORD-503', supplierName: 'مصنع البلاستيك الحديث', itemsSummary: 'أكواب عصير شفافة مع الأغطية', totalAmount: '2,100 ر.س', orderDate: '2026-08-29', deliveryDate: '2026-09-02 المتوقع', status: 'قيد المعالجة' },
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'تم التسليم':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" />تم التسليم</span>;
      case 'جاري الشحن':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1 w-fit"><Truck className="w-3.5 h-3.5" />جاري الشحن</span>;
      case 'قيد المعالجة':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" />قيد المعالجة</span>;
      case 'ملغي':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" />ملغي</span>;
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">طلبات التوريد للفرع</h1>
            <p className="text-sm text-gray-500 mt-1">متابعة أوامر الشراء المرسلة للموردين، حالات الشحن، ومواعيد التسليم المجدولة.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            <span>إنشاء أمر شراء جديد</span>
          </button>
        </header>

        {/* شريط البحث والتصفية */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث برقم الطلب أو اسم المورد..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-xs font-medium px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="جاري الشحن">جاري الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>
        </div>

        {/* جدول الطلبات */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold bg-gray-50/50">
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">المورد</th>
                  <th className="p-4">ملخص المنتجات</th>
                  <th className="p-4">الإجمالي</th>
                  <th className="p-4">تاريخ الطلب</th>
                  <th className="p-4">التسليم المتوقع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-400">
                      لا توجد طلبات توريد مطابقة للبحث أو الفلتر الحالي.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-all">
                      <td className="p-4 font-bold text-blue-600 text-xs">{order.id}</td>
                      <td className="p-4 font-semibold text-gray-900">{order.supplierName}</td>
                      <td className="p-4 text-xs text-gray-600 max-w-xs truncate">{order.itemsSummary}</td>
                      <td className="p-4 font-bold text-gray-900">{order.totalAmount}</td>
                      <td className="p-4 text-xs text-gray-500">{order.orderDate}</td>
                      <td className="p-4 text-xs text-gray-500">{order.deliveryDate}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 text-center">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all" title="عرض التفاصيل">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}