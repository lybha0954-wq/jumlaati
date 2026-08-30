'use client';

import React, { useState } from 'react';
import { Box, PackagePlus, Search, AlertTriangle, CheckCircle2, Trash2, Layers, DollarSign } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  minLimit: number;
}

export default function SupplierInventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: 'أكياس ورقية بني (متوسط)', category: 'تغليف', stock: 650, price: 140, minLimit: 100 },
    { id: 2, name: 'علب برجر كرتون مانعة للتسريب', category: 'علب وجبات', stock: 45, price: 220, minLimit: 50 },
    { id: 3, name: 'أكواب عصير بلاستيك شفاف 360مل', category: 'أكواب', stock: 1200, price: 90, minLimit: 200 },
    { id: 4, name: 'مناديل ورقية مطاعم مفردة', category: 'مستلزمات نظافة', stock: 12, price: 45, minLimit: 30 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');

  // نموذج إضافة منتج جديد
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'تغليف',
    stock: '',
    price: '',
    minLimit: ''
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.stock || !newItem.price) return;

    const product: InventoryItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock),
      price: parseFloat(newItem.price),
      minLimit: newItem.minLimit ? parseInt(newItem.minLimit) : 20
    };

    setItems([product, ...items]);
    setNewItem({ name: '', category: 'تغليف', stock: '', price: '', minLimit: '' });
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // تصفية المنتجات
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'الكل' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = items.length;
  const lowStockCount = items.filter(i => i.stock <= i.minLimit).length;
  const totalInventoryValue = items.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة مخزون المورد</h1>
            <p className="text-sm text-gray-500 mt-1">تتبع المنتجات المتاحة، تنبيهات النقص، وإضافة سلع جديدة للمخزن.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Box className="w-4 h-4" />
            <span>إجمالي الأصناف: {totalProducts}</span>
          </div>
        </header>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">أصناف منخفضة المخزون</p>
              <h3 className={`text-xl font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                {lowStockCount} أصناف
              </h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">إجمالي قيمة المخزون التقديرية</p>
              <h3 className="text-xl font-bold text-blue-600 mt-1">{totalInventoryValue.toLocaleString()} ر.س</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">حالة النظام للمخزن</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> متزامن
              </h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* قسم إضافة منتج جديد وعرض المخزون */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* نموذج إضافة منتج */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-blue-600" />
              <span>إضافة سلعة للمخزون</span>
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  placeholder="مثال: أكواب ورقية مقاومة للحرارة" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">التصنيف</label>
                <select 
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="تغليف">تغليف</option>
                  <option value="علب وجبات">علب وجبات</option>
                  <option value="أكواب">أكواب</option>
                  <option value="مستلزمات نظافة">مستلزمات نظافة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الكمية المتاحة</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">السعر (ر.س)</label>
                  <input 
                    type="number" 
                    placeholder="150" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">حد التنبيه عند النقص</label>
                <input 
                  type="number" 
                  placeholder="20" 
                  value={newItem.minLimit}
                  onChange={(e) => setNewItem({...newItem, minLimit: e.target.value})}
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 text-sm"
              >
                حفظ وإضافة للمخزن
              </button>
            </form>
          </div>

          {/* جدول عرض وإدارة المنتجات */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                <span>قائمة منتجات المخزن</span>
              </h2>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="بحث في المخزون..." 
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
                    <th className="py-3 px-4">الكمية</th>
                    <th className="py-3 px-4">السعر الفردي</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 rounded-l-xl text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        لا توجد منتجات مطابقة للبحث.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isLow = item.stock <= item.minLimit;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{item.category}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{item.stock} وحدة</td>
                          <td className="py-3 px-4 text-blue-600 font-bold">{item.price} ر.س</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                              isLow ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {isLow ? 'منخفض' : 'متوفر'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
'use client';

import { useState, useRef } from 'react';
import { productService } from '@/lib/services/productService';
import Image from 'next/image';

interface ImageUploaderProps {
  productId: string;
  existingImages: string[];
  onImagesUpdate: (newImages: string[]) => void;
}

export default function ImageUploader({ productId, existingImages, onImagesUpdate }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(existingImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الملف (لا يزيد عن 5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يتجاوز 5 ميجابايت');
      return;
    }

    setLoading(true);
    try {
      const newImages = await productService.uploadImage(productId, file);
      if (newImages) {
        setImages(newImages);
        onImagesUpdate(newImages);
      }
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء الرفع');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    setLoading(true);
    try {
      const success = await productService.deleteImage(productId, imageUrl);
      if (success) {
        const newImages = images.filter(img => img !== imageUrl);
        setImages(newImages);
        onImagesUpdate(newImages);
      }
    } catch (error: any) {
      alert(error.message || 'فشل حذف الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* عرض الصور الموجودة */}
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <Image
              src={url}
              alt={`صورة المنتج ${index + 1}`}
              width={120}
              height={120}
              className="rounded-lg object-cover border"
            />
            <button
              onClick={() => handleDelete(url)}
              disabled={loading}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 disabled:opacity-50"
            >
              ×
            </button>
          </div>
        ))}
        
        {/* زر إضافة صورة جديدة */}
        {images.length < 6 && (
          <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
            <span className="text-3xl text-gray-400">+</span>
            <span className="text-xs text-gray-500">إضافة صورة</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {loading && <p className="text-sm text-blue-600">جاري رفع الصورة ومعالجتها...</p>}
      <p className="text-xs text-gray-400">يدعم: JPG, PNG, WebP (الحد الأقصى 5 ميجابايت)</p>
    </div>
  );
}
