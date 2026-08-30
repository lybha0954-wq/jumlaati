import React from 'react';
import { Truck, Package, Clock, CheckCircle, TrendingUp, Search, Bell, MoreVertical } from 'lucide-react';

export default function DeliveryDashboard() {
  // بيانات تجريبية للطلبات
  const orders = [
    { id: '#ORD-7092', customer: 'أحمد محمد', destination: 'بغداد، الكرادة', status: 'جاري التوصيل', time: '15 دقيقة', amount: '45,000 د.ع' },
    { id: '#ORD-7093', customer: 'فاطمة علي', destination: 'بغداد، المنصور', status: 'قيد الانتظار', time: '25 دقيقة', amount: '30,000 د.ع' },
    { id: '#ORD-7094', customer: 'حسين جاسم', destination: 'بغداد، الجادرية', status: 'تم التسليم', time: 'منذ ساعة', amount: '75,000 د.ع' },
    { id: '#ORD-7095', customer: 'زينب حسن', destination: 'بغداد، الأعظمية', status: 'جاري التوصيل', time: '10 دقائق', amount: '20,000 د.ع' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">

      {/* شريط التنقل العلوي */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">لوحة تحكم التوصيل</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="بحث عن طلب، عميل..." 
              className="bg-gray-100 pr-10 pl-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 left-1 bg-red-500 w-2.5 h-2.5 rounded-full ring-2 ring-white"></span>
          </button>
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">
            مد
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي الطلبات اليوم</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
              <span className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% عن الأمس
              </span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
              <Package className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">قيد التوصيل الآن</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">64</h3>
              <span className="text-xs text-indigo-600 font-semibold mt-1 block">نشط حالياً</span>
            </div>
            <div className="bg-amber-50 text-amber-600 p-4 rounded-xl">
              <Truck className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">في الانتظار</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">18</h3>
              <span className="text-xs text-orange-600 font-semibold mt-1 block">تحتاج تعيين مندوب</span>
            </div>
            <div className="bg-orange-50 text-orange-600 p-4 rounded-xl">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">تم التوصيل بنجاح</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,166</h3>
              <span className="text-xs text-green-600 font-semibold mt-1 block">معدل نجاح 98%</span>
            </div>
            <div className="bg-green-50 text-green-600 p-4 rounded-xl">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* قسم جدول الطلبات */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">أحدث الطلبات</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
              عرض الكل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6">رقم الطلب</th>
                  <th className="py-3 px-6">العميل</th>
                  <th className="py-3 px-6">وجهة التوصيل</th>
                  <th className="py-3 px-6">الحالة</th>
                  <th className="py-3 px-6">الوقت المتوقع</th>
                  <th className="py-3 px-6">المبلغ</th>
                  <th className="py-3 px-6 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders?.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-indigo-600">{order?.id}</td>
                    <td className="py-4 px-6 text-gray-900">{order?.customer}</td>
                    <td className="py-4 px-6 text-gray-600">{order?.destination}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order?.status === 'جاري التوصيل' ? 'bg-blue-50 text-blue-700' :
                        order?.status === 'قيد الانتظار'? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {order?.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{order?.time}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{order?.amount}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
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
