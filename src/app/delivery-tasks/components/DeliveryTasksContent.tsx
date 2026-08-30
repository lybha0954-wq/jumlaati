'use client';

import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function DeliveryTasksContent() {
  const tasks = [
    { 
      id: '#TSK-901', 
      customer: 'محمد عبد الله', 
      phone: '07801234567', 
      address: 'بغداد، الكرادة، شارع العباسية', 
      status: 'قيد التنفيذ', 
      priority: 'عالية',
      time: '10:30 ص' 
    },
    { 
      id: '#TSK-902', 
      customer: 'سارة أحمد', 
      phone: '07709876543', 
      address: 'بغداد، المنصور، تقاطع الحارثية', 
      status: 'معلقة', 
      priority: 'متوسطة',
      time: '11:15 ص' 
    },
    { 
      id: '#TSK-903', 
      customer: 'علي كريم', 
      phone: '07501112233', 
      address: 'بغداد، الجادرية، قرب جامعة بغداد', 
      status: 'مكتملة', 
      priority: 'منخفضة',
      time: '09:00 ص' 
    },
    { 
      id: '#TSK-904', 
      customer: 'مريم حسن', 
      phone: '07904445566', 
      address: 'بغداد، الأعظمية، ساحة مظفر', 
      status: 'قيد التنفيذ', 
      priority: 'عالية',
      time: '12:00 م' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      
      {/* شريط التنقل العلوي */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">إدارة مهام التوصيل</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="بحث عن مهمة، عميل..." 
              className="bg-gray-100 pr-10 pl-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition">
            <Filter className="w-4 h-4" />
            <span>تصفية</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">

        {/* بطاقات ملخص المهام */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">المهام الجارية</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
              <span className="text-xs text-blue-600 font-semibold mt-1 block">تتطلب متابعة ميدانية</span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">المهام المكتملة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">45</h3>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">تم تسليمها بنجاح اليوم</span>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">مهام معلقة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">5</h3>
              <span className="text-xs text-amber-600 font-semibold mt-1 block">بانتظار تأكيد المندوب</span>
            </div>
            <div className="bg-amber-50 text-amber-600 p-4 rounded-xl">
              <AlertCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* قائمة المهام بتصميم شبكي (Grid) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">قائمة المهام الحالية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task, index) => (
              <div key={index} className="border border-gray-100 bg-gray-50/50 rounded-xl p-5 hover:shadow-md transition space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 text-sm">{task.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'قيد التنفيذ' ? 'bg-blue-50 text-blue-700' :
                    task.status === 'معلقة' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{task.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{task.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{task.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>الوقت المجدول: {task.time}</span>
                  <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold">
                    <span>التفاصيل</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
// app/delivery/tasks/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const getDeliveryTask = cache(async (taskId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('delivery_tasks')
    .select(`
      *,
      order:orders (
        id, total_price, shipping_address,
        retailer:profiles (full_name, phone, address)
      )
    `)
    .eq('id', taskId)
    .single();
  
  if (error) return null;
  return data;
});

export const revalidate = 30; // تحديث كل 30 ثانية لتتبع الموقع والحالة

export default async function DeliveryTaskPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const task = await getDeliveryTask(id);
  if (!task) notFound();

  const order = task.order;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* رأس المهمة */}
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">مهمة توصيل #{task.id.slice(0, 8)}</h2>
          <p className="text-blue-100">حالة المهمة: {task.status}</p>
        </div>

        {/* معلومات العميل */}
        <div className="p-6 space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700">بيانات المستلم</h3>
            <p className="text-lg">{order?.retailer?.full_name || 'غير محدد'}</p>
            <p className="text-gray-600">📞 {order?.retailer?.phone}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700">عنوان التوصيل</h3>
            <p className="text-gray-800">{order?.shipping_address || order?.retailer?.address || 'لا يوجد عنوان'}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">قيمة الطلب:</span>
            <span className="text-2xl font-bold text-green-600">{order?.total_price} ريال</span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>المبلغ المستحق للتوصيل: {task.delivery_fee || 0} ريال</span>
          </div>

          {/* أزرار الإجراء (ستُفعّل لاحقاً بـ Client Component) */}
          <div className="flex gap-4 mt-6 pt-4 border-t">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              ✅ بدء التوصيل
            </button>
            <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
              ❌ رفض المهمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
