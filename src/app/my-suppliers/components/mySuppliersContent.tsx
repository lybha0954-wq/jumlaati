'use client';

import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Package, 
  Phone, 
  Mail, 
  Building2, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

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

export default function MySuppliersContent() {
  const [activeTab, setActiveTab] = useState<'my-suppliers' | 'request-supplier'>('my-suppliers');
  
  // نموذج تقديم طلب مورد جديد
  const [requestForm, setRequestForm] = useState({
    supplierName: '',
    category: '',
    location: '',
    notes: ''
  });

  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // قائمة الموردين (بعضهم مقبولة لتظهر منتجاتهم، وبعضهم بانتظار الموافقة)
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

  // عرض تفاصيل المورد المختار لمعالجة عرض منتجاته
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.supplierName) return;

    // إضافة المورد الجديد بحالة "قيد الانتظار"
    const newSupplier: Supplier = {
      id: Date.now(),
      name: requestForm.supplierName,
      category: requestForm.category || 'عام',
      distance: requestForm.location || 'قريب من موقعك',
      phone: '+966 50 000 0000',
      email: 'new.supplier@example.com',
      status: 'pending',
      products: [
        { id: 901, name: 'منتج تجريبي افتراضي 1', price: '50 ر.س', category: 'عام', stock: 'متوفر' }
      ]
    };

    setSuppliers([newSupplier, ...suppliers]);
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestForm({ supplierName: '', category: '', location: '', notes: '' });
      setActiveTab('my-suppliers');
    }, 2500);
  };

  // محاكاة قبول الطلب (لتوضيح كيف يظهر المورد ومنتجاته عند الموافقة)
  const simulateApproval = (id: number) => {
    setSuppliers(suppliers.map(sup => {
      if (sup.id === id) {
        return { 
          ...sup, 
          status: 'approved',
          products: sup.products.length === 0 ? [
            { id: Date.now() + 1, name: 'منتج أساسي معتمد للمورد', price: '75 ر.س', category: 'توريدات عامة', stock: 'متوفر' }
          ] : sup.products
        };
      }
      return sup;
    }));
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">موردي وقائمتي المعتمدة</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة الموردين القريبين، متابعة حالات الطلبات، واستعراض المنتجات المتاحة للتوريد.</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveTab('my-suppliers'); setSelectedSupplier(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'my-suppliers' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              الموردين الحاليين
            </button>
            <button 
              onClick={() => { setActiveTab('request-supplier'); setSelectedSupplier(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'request-supplier' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              طلب إضافة مورد قريب +
            </button>
          </div>
        </header>

        {/* عرض تفاصيل مورد معين ومنتجاته */}
        {selectedSupplier ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setSelectedSupplier(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة لقائمة الموردين</span>
              </button>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>مورد معتمد</span>
              </span>
            </div>

            {/* بطاقة معلومات المورد */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-medium">اسم المورد / الشركة</span>
                <h2 className="text-lg font-bold text-gray-900">{selectedSupplier.name}</h2>
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-full mt-1">
                  {selectedSupplier.category}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <span className="text-xs text-gray-400 font-medium block">الموقع والمسافة</span>
                <div className="flex items-center gap-1.5 text-gray-700 font-medium pt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{selectedSupplier.distance}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <span className="text-xs text-gray-400 font-medium block">بيانات الاتصال</span>
                <div className="flex items-center gap-2 text-gray-600 pt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedSupplier.phone}</span>
                </div>
              </div>
            </div>

            {/* قسم عرض منتجات المورد المعتمد */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>المنتجات المعروضة من المورد ({selectedSupplier.products.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSupplier.products.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">{prod.category}</span>
                        <span className="text-[11px] text-emerald-600 font-medium">{prod.stock}</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 pt-1">{prod.name}</h4>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-blue-600">{prod.price}</span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm">
                        طلب المنتج
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'request-supplier' ? (
          /* نموذج تقديم طلب إضافة مورد قريب */
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">تقديم طلب إضافة مورد قريب</h2>
              <p className="text-xs text-gray-500 mt-0.5">أدخل بيانات المورد القريب لتتم مراجعته واعتماده ليظهر في قائمتك مع منتجاته المتاحة.</p>
            </div>

            {requestSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>تم إرسال طلب إضافة المورد بنجاح! سيتم اعتماده وتحديث قائمتك قريباً.</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المورد / المؤسسة التجارية</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مؤسسة التوريدات السريعة"
                  value={requestForm.supplierName}
                  onChange={(e) => setRequestForm({...requestForm, supplierName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">تصنيف النشاط</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مواد إستهلاكية، أجبان وألبان، تغليف..."
                  value={requestForm.category}
                  onChange={(e) => setRequestForm({...requestForm, category: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">الموقع أو المنطقة القريبة</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: حي النخيل، بجوار مطعم..."
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({...requestForm, location: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">ملاحظات أو منتجات مطلوبة تحديداً</label>
                <textarea 
                  rows={3}
                  placeholder="اكتب تفاصيل المنتجات التي ترغب في توريدها..."
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>إرسال طلب الإضافة</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* قائمة الموردين الحاليين (المعتمدين وقيد الانتظار) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <div 
                key={supplier.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {supplier.category}
                    </span>
                    {supplier.status === 'approved' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>معتمد</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>قيد الموافقة</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-gray-900">{supplier.name}</h3>
                  
                  <div className="space-y-1 text-xs text-gray-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{supplier.distance}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{supplier.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  {supplier.status === 'approved' ? (
                    <button 
                      onClick={() => setSelectedSupplier(supplier)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-4 h-4" />
                      <span>استعراض المنتجات ({supplier.products.length})</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-[11px] text-amber-600 font-medium">بانتظار موافقة المشرف</span>
                      <button 
                        onClick={() => simulateApproval(supplier.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                        title="محاكاة الموافقة"
                      >
                        محاكاة الموافقة
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
        }
