'use client';

import React, { useState } from 'react';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Tag, 
  DollarSign, 
  CheckCircle2, 
  Trash2,
  SlidersHorizontal
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  status: 'نشط' | 'مؤقت';
}

export default function SupplierProductsContent() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: 1, name: 'أكياس ورقية تحمل شعار مطبوع', category: 'تغليف', price: 150, unit: 'كرتون (500 حبة)', status: 'نشط' },
    { id: 2, name: 'علب وجبات برجر كرتون', category: 'علب طعام', price: 210, unit: 'كرتون (300 حبة)', status: 'نشط' },
    { id: 3, name: 'أكواب عصير بلاستيكية شفافة', category: 'أكواب', price: 95, unit: 'شدة (1000 حبة)', status: 'نشط' },
    { id: 4, name: 'مناديل ورقية معقمة مخصصة', category: 'مستلزمات', price: 40, unit: 'كرتون (2000 قطعة)', status: 'مؤقت' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'تغليف',
    price: '',
    unit: 'كرتون'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const product: ProductItem = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      status: 'نشط'
    };

    setProducts([product, ...products]);
    setNewProduct({ name: '', category: 'تغليف', price: '', unit: 'كرتون' });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة منتجات المورد</h1>
            <p className="text-sm text-gray-500 mt-1">عرض وتعديل قائمة السلع والمنتجات المعروضة للمطاعم والشركاء.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Package className="w-4 h-4" />
            <span>إجمالي المنتجات المعروضة: {products.length}</span>
          </div>
        </header>

        {/* نموذج الإضافة وجدول العرض */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* نموذج إضافة منتج جديد */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>إضافة منتج جديد للكتالوج</span>
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج أو السلعة</label>
                <input 
                  type="text" 
                  placeholder="مثال: أكواب ورقية مقاومة للحرارة" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">التصنيف</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="تغليف">تغليف</option>
                  <option value="علب طعام">علب طعام</option>
                  <option value="أكواب">أكواب</option>
                  <option value="مستلزمات">مستلزمات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">السعر (ر.س)</label>
                <input 
                  type="number" 
                  placeholder="120" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">وحدة البيع</label>
                <input 
                  type="text" 
                  placeholder="مثال: كرتون (500 حبة)" 
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 text-sm"
              >
                إضافة المنتج للكتالوج
              </button>
            </form>
          </div>

          {/* قائمة المنتجات المعروضة */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span>قائمة المنتجات الحالية</span>
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="بحث في المنتجات..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 rounded-r-xl">اسم المنتج</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">السعر</th>
                    <th className="py-3 px-4">وحدة البيع</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 rounded-l-xl text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        لا توجد منتجات مطابقة للبحث.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-gray-900">{p.name}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">{p.category}</td>
                        <td className="py-3.5 px-4 font-bold text-blue-600">{p.price} ر.س</td>
                        <td className="py-3.5 px-4 text-gray-600 text-xs">{p.unit}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                            p.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-4 h-4" />
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

      </div>
    </main>
  );
}
