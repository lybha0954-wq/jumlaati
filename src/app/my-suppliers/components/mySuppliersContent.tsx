'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Search, 
  ShoppingBag, 
  Plus, 
  CheckCircle2, 
  Star, 
  ExternalLink 
} from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  city: string;
  rating: number;
  activeOrders: number;
  status: 'نشط' | 'متوقف مؤقتاً';
}

export default function MySuppliersContent() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'شركة التغليف الذكي المحدودة', category: 'علب وتغليف ورقي', contactPerson: 'أحمد التميمي', phone: '+966 50 123 4567', city: 'الرياض', rating: 4.8, activeOrders: 2, status: 'نشط' },
    { id: 2, name: 'مؤسسة النظافة الشاملة للمطاعم', category: 'مناديل ومستلزمات تعقيم', contactPerson: 'سعيد القحطاني', phone: '+966 55 987 6543', city: 'جدة', rating: 4.5, activeOrders: 1, status: 'نشط' },
    { id: 3, name: 'مصنع البلاستيك الحديث', category: 'أكواب وعلب شفافة', contactPerson: 'خالد عبد الله', phone: '+966 56 444 3322', city: 'الدمام', rating: 4.2, activeOrders: 0, status: 'نشط' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // نموذج إضافة مورد جديد للفرع
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: 'علب وتغليف ورقي',
    contactPerson: '',
    phone: '',
    city: ''
  });

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.phone) return;

    const supplier: Supplier = {
      id: Date.now(),
      name: newSupplier.name,
      category: newSupplier.category,
      contactPerson: newSupplier.contactPerson || 'غير محدد',
      phone: newSupplier.phone,
      city: newSupplier.city || 'الرياض',
      rating: 5.0,
      activeOrders: 0,
      status: 'نشط'
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({ name: '', category: 'علب وتغليف ورقي', contactPerson: '', phone: '', city: '' });
    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(sup => 
    sup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sup.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مورديني</h1>
            <p className="text-sm text-gray-500 mt-1">قائمة الموردين المعتمدين والشركاء الذين يتعامل معهم الفرع لتوفير المستلزمات.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مورد جديد</span>
          </button>
        </header>

        {/* شريط البحث */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث باسم المورد أو التصنيف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap">
            إجمالي الموردين: {suppliers.length}
          </div>
        </div>

        {/* شبكة عرض الموردين */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400">
              لا توجد نتائج مطابقة لبحثك.
            </div>
          ) : (
            filteredSuppliers.map((sup) => (
              <div key={sup.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{sup.name}</h3>
                    <span className="text-xs text-blue-600 font-semibold">{sup.category}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {sup.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-400">مسؤول المبيعات:</span>
                    <span>{sup.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{sup.city}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{sup.rating}</span>
                  </div>
                  <div className="text-gray-500">
                    طلبات نشطة: <strong className="text-blue-600">{sup.activeOrders}</strong>
                  </div>
                  <button className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <span>طلب توريد</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* نافذة منبثقة (Modal) لإضافة مورد جديد */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-gray-900">ربط مورد جديد بالفرع</h2>
              <form onSubmit={handleAddSupplier} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">اسم المورد / الشركة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: شركة التغليف الذكي"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">التصنيف والنشاط</label>
                  <select 
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="علب وتغليف ورقي">علب وتغليف ورقي</option>
                    <option value="مناديل ومستلزمات تعقيم">مناديل ومستلزمات تعقيم</option>
                    <option value="أكواب وعلب شفافة">أكواب وعلب شفافة</option>
                    <option value="مواد غذائية أساسية">مواد غذائية أساسية</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">اسم المسؤول</label>
                    <input 
                      type="text" 
                      placeholder="اسم المسؤول"
                      value={newSupplier.contactPerson}
                      onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهاتف</label>
                    <input 
                      type="text" 
                      placeholder="+966 ..."
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">المدينة</label>
                  <input 
                    type="text" 
                    placeholder="الرياض، جدة..."
                    value={newSupplier.city}
                    onChange={(e) => setNewSupplier({...newSupplier, city: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-blue-200"
                  >
                    حفظ المورد
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
