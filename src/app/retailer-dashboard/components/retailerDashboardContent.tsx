'use client';

import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Truck,
  TrendingUp,
  AlertCircle,
  UserPlus
} from 'lucide-react';

interface ActiveOrder {
  id: number;
  orderNumber: string;
  supplier: string;
  items: string;
  total: number;
  status: 'قيد الشحن' | 'قيد المعالجة' | 'تم الاستلام';
}

interface InventoryStock {
  id: number;
  itemName: string;
  category: string;
  currentStock: number;
  status: 'متوفر' | 'منخفض';
}

interface SupplierApplication {
  id: number;
  companyName: string;
  category: string;
  phone: string;
  status: 'قيد المراجعة' | 'معتمد';
}

export default function RetailerDashboardContent() {
  const [orders, setOrders] = useState<ActiveOrder[]>([
    { id: 1, orderNumber: '#ORD-501', supplier: 'شركة التغليف الذكي', items: 'أكياس ورقية + علب برجر', total: 1650, status: 'قيد الشحن' },
    { id: 2, orderNumber: '#ORD-502', supplier: 'مؤسسة النظافة الشاملة', items: 'مناديل مطاعم معقمة', total: 420, status: 'تم الاستلام' },
    { id: 3, orderNumber: '#ORD-503', supplier: 'مصنع البلاستيك الحديث', items: 'أكواب عصير شفافة', total: 890, status: 'قيد المعالجة' },
  ]);

  const [stocks, setStocks] = useState<InventoryStock[]>([
    { id: 1, itemName: 'أكياس ورقية بني', category: 'تغليف', currentStock: 120, status: 'متوفر' },
    { id: 2, itemName: 'علب وجبات كرتون', category: 'علب طعام', currentStock: 15, status: 'منخفض' },
    { id: 3, itemName: 'أكواب بلاستيك 300مل', category: 'أكواب', currentStock: 340, status: 'متوفر' },
  ]);

  const [supplierApps, setSupplierApps] = useState<SupplierApplication[]>([
    { id: 1, companyName: 'مؤسسة الأغذية الطازجة للجملة', category: 'خضار ولحوم', phone: '+966 50 111 2233', status: 'معتمد' }
  ]);

  const [newRequest, setNewRequest] = useState({ supplier: '', items: '', total: '' });
  const [newSupplierApp, setNewSupplierApp] = useState({ companyName: '', category: '', phone: '' });

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.supplier || !newRequest.items || !newRequest.total) return;

    const order: ActiveOrder = {
      id: Date.now(),
      orderNumber: `#ORD-${Math.floor(600 + Math.random() * 300)}`,
      supplier: newRequest.supplier,
      items: newRequest.items,
      total: parseFloat(newRequest.total),
      status: 'قيد المعالجة'
    };

    setOrders([order, ...orders]);
    setNewRequest({ supplier: '', items: '', total: '' });
  };

  const handleAddSupplierApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierApp.companyName || !newSupplierApp.category || !newSupplierApp.phone) return;

    const app: SupplierApplication = {
      id: Date.now(),
      companyName: newSupplierApp.companyName,
      category: newSupplierApp.category,
      phone: newSupplierApp.phone,
      status: 'قيد المراجعة'
    };

    setSupplierApps([app, ...supplierApps]);
    setNewSupplierApp({ companyName: '', category: '', phone: '' });
  };

  const totalSpent = orders.reduce((acc, curr) => acc + curr.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'تم الاستلام').length;
  const lowStockCount = stocks.filter(s => s.status === 'منخفض').length;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المطعم / المتجر</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة الطلبات من الموردين، متابعة مخزون المتجر، وتقديم طلبات انضمام موردين جُدد.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Store className="w-4 h-4" />
            <span>مطعم البرجر الذهبي (نشط)</span>
          </div>
        </header>

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي المشتريات</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalSpent} ر.س</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">الطلبات النشطة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeOrdersCount} طلبات</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">تنبيهات المخزون</p>
              <h3 className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                {lowStockCount} أصناف
              </h3>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">كفاءة التوريد</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">96.5%</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* قسم النماذج الجانبية والجداول */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* عمود النماذج (طلب توريد + طلب إضافة مورد جديد) */}
          <div className="space-y-6">
            
            {/* نموذج طلب توريد جديد من مورد */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>طلب توريد من مورد</span>
              </h2>
              <form onSubmit={handleAddOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">المورد / الشركة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: شركة التغليف الذكي" 
                    value={newRequest.supplier}
                    onChange={(e) => setNewRequest({...newRequest, supplier: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الأصناف المطلوبة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: أكياس ورقية (500 قطعة)" 
                    value={newRequest.items}
                    onChange={(e) => setNewRequest({...newRequest, items: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">التكلفة الإجمالية (ر.س)</label>
                  <input 
                    type="number" 
                    placeholder="1200" 
                    value={newRequest.total}
                    onChange={(e) => setNewRequest({...newRequest, total: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200 text-sm"
                >
                  إرسال طلب التوريد
                </button>
              </form>
            </div>

            {/* نموذج طلب إضافة مورد جديد للمنصة */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <span>طلب إضافة مورد جديد</span>
              </h2>
              <form onSubmit={handleAddSupplierApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">اسم شركة المورد / المؤسسة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: مصنع الأغذية المتميزة" 
                    value={newSupplierApp.companyName}
                    onChange={(e) => setNewSupplierApp({...newSupplierApp, companyName: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">نوع النشاط / التخصص</label>
                  <input 
                    type="text" 
                    placeholder="مثال: لحوم مجمدة وبطاطس" 
                    value={newSupplierApp.category}
                    onChange={(e) => setNewSupplierApp({...newSupplierApp, category: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">رقم هاتف التواصل مع المورد</label>
                  <input 
                    type="text" 
                    placeholder="+966 50..." 
                    value={newSupplierApp.phone}
                    onChange={(e) => setNewSupplierApp({...newSupplierApp, phone: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 text-sm"
                >
                  إرسال طلب اعتماد المورد
                </button>
              </form>
            </div>

          </div>

          {/* الجداول الجانبية (الطلبات النشطة، مخزون المطعم، وموردين مقترحين) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* جدول الطلبات الجارية */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>حالة طلبات التوريد النشطة</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 rounded-r-xl">رقم الطلب</th>
                      <th className="py-3 px-4">المورد</th>
                      <th className="py-3 px-4">الأصناف</th>
                      <th className="py-3 px-4">الإجمالي</th>
                      <th className="py-3 px-4 rounded-l-xl">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{ord.orderNumber}</td>
                        <td className="py-3 px-4 text-gray-700">{ord.supplier}</td>
                        <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{ord.items}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{ord.total} ر.س</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ord.status === 'تم الاستلام' ? 'bg-emerald-50 text-emerald-700' :
                            ord.status === 'قيد الشحن' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* جدول طلبات إضافة موردين جدد المقدمة */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <span>طلبات انضمام الموردين الجدد</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 rounded-r-xl">اسم الشركة / المورد</th>
                      <th className="py-3 px-4">النوع / النشاط</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4 rounded-l-xl">حالة الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {supplierApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{app.companyName}</td>
                        <td className="py-3 px-4 text-gray-500">{app.category}</td>
                        <td className="py-3 px-4 text-gray-700">{app.phone}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            app.status === 'معتمد' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* جدول لمحة مخزون المطعم الحالي */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>مخزون المستلزمات الحالي بالمطعم</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 rounded-r-xl">اسم المادة</th>
                      <th className="py-3 px-4">التصنيف</th>
                      <th className="py-3 px-4">الكمية المتاحة</th>
                      <th className="py-3 px-4 rounded-l-xl">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stocks.map((stk) => (
                      <tr key={stk.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{stk.itemName}</td>
                        <td className="py-3 px-4 text-gray-500">{stk.category}</td>
                        <td className="py-3 px-4 text-gray-700">{stk.currentStock} وحدة</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            stk.status === 'متوفر' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {stk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
                  }
