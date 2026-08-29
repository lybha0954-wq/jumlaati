'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  Filter, 
  Store,
  DollarSign
} from 'lucide-react';

interface OrderItem {
  id: number;
  orderNumber: string;
  restaurantName: string;
  itemsList: string;
  totalAmount: number;
  orderTime: string;
  status: 'قيد المعالجة' | 'جاري التوصيل' | 'مكتملة' | 'ملغية';
}

export default function SupplierOrdersContent() {
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, orderNumber: '#ORD-301', restaurantName: 'مطعم البرجر الذهبي', itemsList: 'أكياس ورقية (500 قطعة)، عبوات صوص', totalAmount: 1450, orderTime: 'منذ 25 دقيقة', status: 'قيد المعالجة' },
    { id: 2, orderNumber: '#ORD-302', restaurant: 'بيتزا روما', itemsList: 'علب بيتزا كرتون (300 قطعة)', totalAmount: 920, orderTime: 'منذ ساعتين', status: 'جاري التوصيل' },
    { id: 3, orderNumber: '#ORD-303', restaurant: 'حلويات الشرق', itemsList: 'أكواب عصير بلاستيك (1000 قطعة)', totalAmount: 2100, orderTime: 'أمس', status: 'مكتملة' },
    { id: 4, orderNumber: '#ORD-304', restaurant: 'مشاوي الشام', itemsList: 'قصدير تغليف طعام', totalAmount: 600, orderTime: 'أمس', status: 'ملغية' },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // تحديث حالة الطلب
  const handleStatusChange = (id: number, newStatus: OrderItem['status']) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  // تصفية الطلبات بناءً على البحث والحالة
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'الكل' || order.status === filterStatus;
    const matchesSearch = order.orderNumber.includes(searchQuery) || order.restaurantName.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'قيد المعالجة').length;
  const completedCount = orders.filter(o => o.status === 'مكتملة').length;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة طلبات المورد</h1>
            <p className="text-sm text-gray-500 mt-1">متابعة الطلبات الواردة من المطاعم وتحديث حالات التوريد والشحن.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>إجمالي الطلبات: {totalOrdersCount}</span>
          </div>
        </header>

        {/* إحصائيات سريعة للطلبات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">طلبات قيد المعالجة</p>
              <h3 className="text-xl font-bold text-amber-600 mt-1">{pendingCount} طلب</h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">طلبات مكتملة</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1">{completedCount} طلب</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">إجمالي الإيرادات المسجلة</p>
              <h3 className="text-xl font-bold text-blue-600 mt-1">
                {orders.filter(o => o.status !== 'ملغية').reduce((acc, curr) => acc + curr.totalAmount, 0)} ر.س
              </h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* شريط البحث والتصفية */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث برقم الطلب أو اسم المطعم..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['الكل', 'قيد المعالجة', 'جاري التوصيل', 'مكتملة', 'ملغية'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* جدول عرض الطلبات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>قائمة الطلبات الواردة</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 rounded-r-xl">رقم الطلب</th>
                  <th className="py-3 px-4">المطعم</th>
                  <th className="py-3 px-4">الأصناف المطلوبة</th>
                  <th className="py-3 px-4">الإجمالي</th>
                  <th className="py-3 px-4">الوقت</th>
                  <th className="py-3 px-4">الحالة الحالية</th>
                  <th className="py-3 px-4 rounded-l-xl text-center">إجراءات التحديث</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      لا توجد طلبات تطابق بحثك الحالي.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="py-3.5 px-4 text-gray-700 flex items-center gap-1.5 mt-1">
                        <Store className="w-3.5 h-3.5 text-gray-400" />
                        {order.restaurantName}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">{order.itemsList}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{order.totalAmount} ر.س</td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs">{order.orderTime}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                          order.status === 'مكتملة' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'جاري التوصيل' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'قيد المعالجة' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderItem['status'])}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                        >
                          <option value="قيد المعالجة">قيد المعالجة</option>
                          <option value="جاري التوصيل">جاري التوصيل</option>
                          <option value="مكتملة">مكتملة</option>
                          <option value="ملغية">ملغية</option>
                        </select>
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
