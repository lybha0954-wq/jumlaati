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
  MapPin, 
  Phone, 
  ArrowRight,
  Plus,
  QrCode,
  Layers,
  Sparkles
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

interface ProductItem {
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
  products: ProductItem[];
}

export default function UnifiedRetailerDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suppliers' | 'request-supplier' | 'smart-generator'>('dashboard');

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
    },
    {
      id: 3,
      name: 'مصنع الأغطية المتطورة',
      category: 'أغطية بلاستيكية وعلب',
      distance: '6.0 كم عن موقعك',
      phone: '+966 56 777 8899',
      email: 'contact@advanced-lids.com',
      status: 'pending',
      products: []
    }
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newRequest, setNewRequest] = useState({ supplier: '', items: '', total: '' });
  
  const [requestForm, setRequestForm] = useState({
    supplierName: '',
    category: '',
    location: '',
    notes: ''
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [generatorType, setGeneratorType] = useState<'qr' | 'barcode' | 'sku'>('qr');
  const [itemInput, setItemInput] = useState('');
  const [generatedCodeResult, setGeneratedCodeResult] = useState<string | null>(null);

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

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.supplierName) return;

    const newSupplier: Supplier = {
      id: Date.now(),
      name: requestForm.supplierName,
      category: requestForm.category || 'عام',
      distance: requestForm.location || 'قريب من موقعك',
      phone: '+966 50 000 0000',
      email: 'new.supplier@example.com',
      status: 'pending',
      products: [
        { id: Date.now(), name: 'منتج تجريبي افتراضي', price: '50 ر.س', category: 'عام', stock: 'متوفر' }
      ]
    };

    setSuppliers([newSupplier, ...suppliers]);
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestForm({ supplierName: '', category: '', location: '', notes: '' });
      setActiveTab('suppliers');
    }, 2000);
  };

  const simulateApproval = (id: number) => {
    setSuppliers(suppliers.map(sup => {
      if (sup.id === id) {
        return { 
          ...sup, 
          status: 'approved',
          products: sup.products.length === 0 ? [
            { id: Date.now(), name: 'منتج أساسي معتمد للمورد', price: '75 ر.س', category: 'توريدات عامة', stock: 'متوفر' }
          ] : sup.products
        };
      }
      return sup;
    }));
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemInput) return;
    const randomCodeString = `${generatorType.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setGeneratedCodeResult(randomCodeString);
  };

  const totalSpent = orders.reduce((acc, curr) => acc + curr.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'تم الاستلام').length;
  const lowStockCount = stocks.filter(s => s.status === 'منخفض').length;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة وشريط التنقل */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المطعم / المتجر الذكية</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة الطلبات، الموردين القريبين، المخزون، وتوليد الأكواد التعريفية.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'dashboard' && !selectedSupplier ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                الرئيسية
              </button>
              <button 
                onClick={() => { setActiveTab('suppliers'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'suppliers' || selectedSupplier ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                الموردين
              </button>
              <button 
                onClick={() => { setActiveTab('request-supplier'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'request-supplier' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                طلب مورد +
              </button>
              <button 
                onClick={() => { setActiveTab('smart-generator'); setSelectedSupplier(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${activeTab === 'smart-generator' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>مولد الأكواد الذكي</span>
              </button>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl font-medium text-xs">
              <Store className="w-4 h-4" />
              <span>مطعم البرجر الذهبي</span>
            </div>
          </div>
        </header>

        {/* التبويب الأول: لوحة التحكم الرئيسية */}
        {activeTab === 'dashboard' && !selectedSupplier && (
          <div className="space-y-6">
            
            {/* إحصائيات سريعة */}
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

            {/* النموذج والجداول */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* طلب توريد */}
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

              {/* جداول الطلبات والمخزون */}
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

        {/* التبويب الثاني: الموردين أو عرض منتجات المورد المحدد */}
        {(activeTab === 'suppliers' || selectedSupplier) && (
          <div>
            {selectedSupplier ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <button 
                      onClick={() => setSelectedSupplier(null)}
                      className="text-xs text-emerald-600 font-semibold mb-2 flex items-center gap-1 hover:underline"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      <span>العودة لقائمة الموردين</span>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">{selectedSupplier.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{selectedSupplier.category} • {selectedSupplier.distanc
