'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  FileText 
} from 'lucide-react';

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
// app/retailer/orders/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const getOrder = cache(async (orderId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      retailer:profiles!orders_retailer_id_fkey (full_name, phone),
      items:order_items (*, product:products (name, final_price))
    `)
    .eq('id', orderId)
    .single();
  
  if (error) return null;
  return data;
});

// لا نستخدم generateStaticParams للطلبات لأنها كثيرة ومتغيرة، نعتمد على الـ ISR فقط
export const revalidate = 60; // تحديث كل دقيقة لتحديث حالة الطلب

export default async function RetailerOrderPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  // حالة الطلب (ملون)
  const statusColors: Record<string, string> = {
    'جديد': 'bg-blue-100 text-blue-800',
    'قيد التجهيز': 'bg-yellow-100 text-yellow-800',
    'قيد التوصيل': 'bg-purple-100 text-purple-800',
    'تم التوصيل': 'bg-green-100 text-green-800',
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">طلب رقم #{order.id.slice(0, 8)}</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* حالة الطلب */}
        <div className="flex justify-between items-center border-b pb-4">
          <span className="font-semibold">الحالة:</span>
          <span className={`px-4 py-1 rounded-full text-sm ${statusColors[order.status] || 'bg-gray-100'}`}>
            {order.status}
          </span>
        </div>

        {/* تفاصيل المنتجات */}
        <div>
          <h3 className="font-semibold mb-2">المنتجات</h3>
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm border-b py-2">
              <span>{item.product?.name || 'منتج'}</span>
              <span>{item.quantity} × {item.price} ريال</span>
            </div>
          ))}
        </div>

        {/* الإجمالي */}
        <div className="text-xl font-bold text-green-700 pt-4 border-t">
          الإجمالي: {order.total_price} ريال
        </div>

        {/* معلومات التوصيل */}
        <div className="text-sm text-gray-500 pt-2">
          <p>العنوان: {order.shipping_address || 'غير محدد'}</p>
          <p>رقم الجوال: {order.retailer?.phone}</p>
        </div>
      </div>
    </div>
  );
}
'use client'; // نضيف هذه في أعلى ملف Client Component جديد أو نستخدم pattern الفصل

// أنشئ ملفاً منفصلاً: app/retailer/orders/[id]/OrderStatusClient.tsx
import { useEffect, useState } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { createClient } from '@/lib/supabase/client';

export function OrderStatusClient({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);

  // استخدم الـ Hook الموجود لتحديث الحالة فوراً
  useRealtimeSubscription({
    table: 'orders',
    filter: `id=eq.${orderId}`,
    onUpdate: (payload) => {
      if (payload.new?.status) {
        setStatus(payload.new.status);
        // يمكنك أيضاً تشغيل إشعار صوتي هنا
      }
    },
  });

