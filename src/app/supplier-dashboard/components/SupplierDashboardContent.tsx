'use client';

import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Box,
  Truck
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'متوفر' | 'نفذت الكمية';
}

interface OrderItem {
  id: number;
  orderNumber: string;
  restaurant: string;
  itemsCount: number;
  total: number;
  status: 'قيد المعالجة' | 'تم التوصيل' | 'قيد الشحن';
}

export default function SupplierDashboardContent() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: 1, name: 'أكياس ورقية (صغير)', category: 'تغليف', stock: 450, price: 120, status: 'متوفر' },
    { id: 2, name: 'عبوات بلاستيكية للصوصات', category: 'حاويات', stock: 15, price: 80, status: 'متوفر' },
    { id: 3, name: 'مناديل ورقية معقمة', category: 'مستلزمات', stock: 0, price: 45, status: 'نفذت الكمية' },
  ]);

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, orderNumber: '#SUP-501', restaurant: 'مطعم البرجر الذهبي', itemsCount: 5, total: 1250, status: 'قيد الشحن' },
    { id: 2, orderNumber: '#SUP-502', restaurant: 'بيتزا روما', itemsCount: 2, total: 480, status: 'تم التوصيل' },
    { id: 3, orderNumber: '#SUP-503', restaurant: 'حلويات الشرق', itemsCount: 8, total: 3100, status: 'قيد المعالجة' },
  ]);

  const [newProductName, setNewProductName] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalProductsCount = products.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'قيد المعالجة' || o.status === 'قيد الشحن').length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductStock || !newProductPrice) return;

    const newProduct: ProductItem = {
      id: Date.now(),
      name: newProductName,
      category: 'عام',
      stock: parseInt(newProductStock),
      price: parseFloat(newProductPrice),
      status: parseInt(newProductStock) > 0 ? 'متوفر' : 'نفذت الكمية'
    };

    setProducts([newProduct, ...products]);
    setNewProductName('');
    setNewProductStock('');
    setNewProductPrice('');
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المورد</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة المخزون، تتبع طلبات المطاعم، ومتابعة الأرباح بكل سهولة.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Package className="w-4 h-4" />
            <span>حساب موثق كمورد معتمد</span>
          </div>
        </header>

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي المبيعات</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalRevenue} ر.س</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">الطلبات النشطة</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingOrdersCount} طلبات</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">منتجات المخزون</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalProductsCount} منتج</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Box className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">معدل التوريد</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">98.4%</h3>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* القسم الرئيسي: نموذج إضافة منتج وجداول البيانات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* نموذج إضافة منتج جديد للمخزون */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>إضافة منتج جديد</span>
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  placeholder="مثال: أكواب ورقية 300مل" 
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">الكمية المتاحة في المخزون</label>
                <input 
                  type="number" 
                  placeholder="مثال: 200" 
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">السعر (ر.س)</label>
                <input 
                  type="number" 
                  placeholder="مثال: 150" 
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 text-sm"
              >
                إضافة للمخزون
              </button>
            </form>
          </div>

          {/* الجداول الجانبية (طلبات المطاعم وإدارة المخزون) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* جدول طلبات المطاعم الواردة */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>طلبات المطاعم الواردة</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 rounded-r-xl">رقم الطلب</th>
                      <th className="py-3 px-4">المطعم</th>
                      <th className="py-3 px-4">عدد الأصناف</th>
                      <th className="py-3 px-4">الإجمالي</th>
                      <th className="py-3 px-4 rounded-l-xl">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="py-3 px-4 text-gray-700">{order.restaurant}</td>
                        <td className="py-3 px-4 text-gray-500">{order.itemsCount} أصناف</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{order.total} ر.س</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'تم التوصيل' ? 'bg-emerald-50 text-emerald-700' :
                            order.status === 'قيد الشحن' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* جدول المخزون الحالي */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                <span>إدارة المخزون</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 rounded-r-xl">المنتج</th>
                      <th className="py-3 px-4">التصنيف</th>
                      <th className="py-3 px-4">الكمية</th>
                      <th className="py-3 px-4">السعر</th>
                      <th className="py-3 px-4 rounded-l-xl">حالة المخزون</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{prod.name}</td>
                        <td className="py-3 px-4 text-gray-500">{prod.category}</td>
                        <td className="py-3 px-4 text-gray-700">{prod.stock} وحدة</td>
                        <td className="py-3 px-4 text-gray-800">{prod.price} ر.س</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            prod.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {prod.stock > 0 ? 'متوفر' : 'نفذت الكمية'}
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
