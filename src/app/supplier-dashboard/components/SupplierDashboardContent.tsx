'use client';

import React, { useState } from 'react';
import { Store, ShoppingBag, Package, DollarSign, PlusCircle, Truck, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

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

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: string;
}

interface Supplier {
  id: number;
  name: string;
  category: string;
  distance: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved';
  products: Product[];
}

export default function RetailerDashboardContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suppliers' | 'wholesale-requests'>('dashboard');

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

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'شركة التغليف الذكي للمواد الاستهلاكية',
      category: 'تغليف ومستلزمات بلاستيكية',
      distance: '2.5 كم عن موقعك',
      phone: '+966 55 111 2233',
      email: 'info@smart-pack.com',
      status: 'approved',
      products: [
        { id: 101, name: 'أكواب ورقية مزدوجة 8 أونصة', price: '45 ر.س / كرتون', category: 'أكواب', stock: 'متوفر بكثرة' },
        { id: 102, name: 'أكياس ورقية بني بمقابض', price: '60 ر.س / ربطة', category: 'أكياس', stock: 'متوفر' },
        { id: 103, name: 'علب برجر كرتون مقوى', price: '90 ر.س / كرتون', category: 'علب طعام', stock: 'مخزون محدود' }
      ]
    },
    {
      id: 2,
      name: 'مؤسسة النظافة الشاملة للمنظفات',
      category: 'مواد تنظيف وتعقيم',
      distance: '4.1 كم عن موقعك',
      phone: '+966 54 333 4455',
      email: 'sales@clean-master.com',
      status: 'approved',
      products: [
        { id: 201, name: 'سائل غسيل أطباق مركز 5 لتر', price: '35 ر.س', category: 'منظفات', stock: 'متوفر' },
        { id: 202, name: 'مطهر ومعقم أرضيات بالصنوبر', price: '50 ر.س', category: 'معقمات', stock: 'متوفر' }
      ]
    }
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newRequest, setNewRequest] = useState({ supplier: '', items: '', total: '' });

  // حالات نموذج خدمات الجملة والموردين المدمجة
  const [wholesaleType, setWholesaleType] = useState<string | null>(null);
  const [wholesaleSubmitted, setWholesaleSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    storeName: '',
    storeLocation: '',
    vehicleType: 'دينا / نقل متوسط',
    shift: 'دوام كامل',
    productCategory: '',
    estimatedQuantity: ''
  });

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

  const handleWholesaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWholesaleSubmitted(true);
  };

  const resetWholesaleForm = () => {
    setWholesaleType(null);
    setWholesaleSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      notes: '',
      storeName: '',
      storeLocation: '',
      vehicleType: 'دينا / نقل متوسط',
      shift: 'دوام كامل',
      productCategory: '',
      estimatedQuantity: ''
    });
  };

  const totalSpent = orders.reduce((acc, curr) => acc + curr.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'تم الاستلام').length;
  const lowStockCount = stocks.filter(s => s.status === 'منخفض').length;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة مع شريط التنقل الداخلي */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المطعم / المتجر</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة الطلبات، مخزون المتجر، الموردين القريبين، وخدمات الجملة وتوفير السائقين.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                الرئيسية
              </button>
              <button 
                onClick={() => { setActiveTab('suppliers'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'suppliers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                الموردين
              </button>
              <button 
                onClick={() => { setActiveTab('wholesale-requests'); setSelectedSupplier(null); resetWholesaleForm(); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'wholesale-requests' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                بوابة خدمات الجملة +
              </button>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl font-medium text-xs">
              <Store className="w-4 h-4" />
              <span>مطعم البرجر الذهبي</span>
            </div>
          </div>
        </header>

        {/* التبويب الأول: لوحة التحكم الرئيسية والطلبات والمخزون */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
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

              <div className="lg:col-span-2 space-y-6">
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
                                ord.status === 'قيد الشحن'? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
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
        )}

        {/* التبويب الثاني: استعراض الموردين أو منتجات المورد المحدد */}
        {activeTab === 'suppliers' && (
          <div>
            {selectedSupplier ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <button 
                    onClick={() => setSelectedSupplier(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة لقائمة الموردين</span>
                  </button>
                  <span className="text-xs font-semibold text-gray-500">{selectedSupplier.name}</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">منتجات المورد المتاحة للطلب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedSupplier.products.map((prod) => (
                      <div key={prod.id} className="border border-gray-100 p-4 rounded-xl space-y-2 bg-gray-50/50">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{prod.category}</span>
                        <h4 className="font-bold text-gray-900 text-sm">{prod.name}</h4>
                        <p className="text-emerald-600 font-bold text-sm">{prod.price}</p>
                        <p className="text-xs text-gray-500">حالة المخزون: {prod.stock}</p>
                        <button 
                          onClick={() => {
                            setNewRequest({
                              supplier: selectedSupplier.name,
                              items: prod.name,
                              total: prod.price.replace(/[^0-9]/g, '') || '100'
                            });
                            setActiveTab('dashboard');
                            setSelectedSupplier(null);
                          }}
                          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-medium transition-all"
                        >
                          إضافة لطلب توريد سريع
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <div 
                    key={supplier.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:border-emerald-200 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${supplier.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {supplier.status === 'approved' ? 'موافق عليه' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">{supplier.name}</h3>
                      <p className="text-xs text-gray-500">{supplier.category}</p>
                      <p className="text-xs text-gray-400">{supplier.distance}</p>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>{supplier.phone}</p>
                      <p>{supplier.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedSupplier(supplier)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-medium transition-all"
                    >
                      عرض المنتجات
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
