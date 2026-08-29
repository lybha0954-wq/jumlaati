'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  BarChart3
} from 'lucide-react';

interface DeliveryItem {
  id: number;
  orderNumber: string;
  restaurant: string;
  distance: string;
  earnings: number;
  time: string;
  status: 'مكتملة' | 'قيد التحضير';
}

export default function DeliveryEarningsContent() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([
    { id: 1, orderNumber: '#ORD-9821', restaurant: 'برجر كنج', distance: '4.2 كم', earnings: 45, time: '2:30 م', status: 'مكتملة' },
    { id: 2, orderNumber: '#ORD-9822', restaurant: 'بيتزا هت', distance: '6.5 كم', earnings: 60, time: '3:15 م', status: 'مكتملة' },
    { id: 3, orderNumber: '#ORD-9823', restaurant: 'البيك', distance: '2.8 كم', earnings: 35, time: '4:00 م', status: 'مكتملة' },
  ]);

  const [newOrder, setNewOrder] = useState({ restaurant: '', distance: '', earnings: '' });

  // حساب إجمالي الأرباح
  const totalEarnings = deliveries.reduce((acc, curr) => acc + curr.earnings, 0);
  const completedOrdersCount = deliveries.length;
  const totalHours = 4.5; // افتراضي لعدد ساعات العمل

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.restaurant || !newOrder.earnings) return;

    const newItem: DeliveryItem = {
      id: Date.now(),
      orderNumber: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurant: newOrder.restaurant,
      distance: newOrder.distance || '3.0 كم',
      earnings: parseFloat(newOrder.earnings),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'مكتملة'
    };

    setDeliveries([newItem, ...deliveries]);
    setNewOrder({ restaurant: '', distance: '', earnings: '' });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة أرباح التوصيل</h1>
            <p className="text-sm text-gray-500 mt-1">تابع أرباحك اليومية، الطلبات، ومستوى أدائك بسهولة.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي أرباح اليوم</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalEarnings} ر.س</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">الطلبات المكتملة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedOrdersCount} طلبات</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">ساعات العمل</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalHours} ساعات</h3>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">متوسط الأرباح/الساعة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {(totalEarnings / totalHours).toFixed(1)} ر.س
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* قسم إضافة طلب جديد والجدول */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* نموذج إضافة توصيلة جديدة */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>إضافة طلب جديد</span>
            </h2>
            <form onSubmit={handleAddDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم المطعم / المتجر</label>
                <input 
                  type="text" 
                  placeholder="مثال: ماكدونالدز" 
                  value={newOrder.restaurant}
                  onChange={(e) => setNewOrder({...newOrder, restaurant: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">المسافة التقديرية</label>
                <input 
                  type="text" 
                  placeholder="مثال: 3.5 كم" 
                  value={newOrder.distance}
                  onChange={(e) => setNewOrder({...newOrder, distance: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">قيمة الأرباح (ر.س)</label>
                <input 
                  type="number" 
                  placeholder="45" 
                  value={newOrder.earnings}
                  onChange={(e) => setNewOrder({...newOrder, earnings: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200 text-sm"
              >
                تسجيل الطلب
              </button>
            </form>
          </div>

          {/* جدول سجل الطلبات */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>سجل الطلبات اليومية</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 rounded-r-xl">رقم الطلب</th>
                    <th className="py-3 px-4">المطعم</th>
                    <th className="py-3 px-4">المسافة</th>
                    <th className="py-3 px-4">الوقت</th>
                    <th className="py-3 px-4">الأرباح</th>
                    <th className="py-3 px-4 rounded-l-xl">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deliveries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        لا توجد طلبات مسجلة حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    deliveries.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.orderNumber}</td>
                        <td className="py-3 px-4 text-gray-700 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.restaurant}
                        </td>
                        <td className="py-3 px-4 text-gray-500">{item.distance}</td>
                        <td className="py-3 px-4 text-gray-500">{item.time}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{item.earnings} ر.س</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
