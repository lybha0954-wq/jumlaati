'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Store, 
  Building2, 
  ArrowRight, 
  FileText, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export default function OrdersRoutingContent() {
  // تتبع الفئة المتاحة حالياً للتوجيه (1: التوصيل، 2: المحل/السوبرماركت، 3: الجملة)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // تتبع نوع الطلب الفرعي داخل كل فئة
  const [subRequestType, setSubRequestType] = useState<string | null>(null);

  // حالة نموذج إدخال البيانات الموحد
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleCategorySelect = (catId: number) => {
    setSelectedCategory(catId);
    setSubRequestType(null);
    setSubmitted(false);
  };

  const handleSubRequestSelect = (subType: string) => {
    setSubRequestType(subType);
    setSubmitted(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSubRequestType(null);
    setSubmitted(false);
    setFormData({ name: '', phone: '', location: '', details: '' });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">بوابة توجيه الطلبات والخدمات</h1>
            <p className="text-sm text-gray-500 mt-1">اختر نوع الجهة لتوجيه طلبك للقسم المختص (توصيل، محل/سوبرماركت، أو جملة).</p>
          </div>
          {selectedCategory !== null && (
            <button 
              onClick={resetForm}
              className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-semibold transition-all"
            >
              ← العودة للقائمة الرئيسية
            </button>
          )}
        </header>

        {submitted ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تم استقبال طلبك وتوجيهه بنجاح!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">تمت معالجة الطلب وإرساله إلى الجهة المعنية وسيتم التواصل معك قريباً عبر الهاتف المسجل.</p>
            <button 
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              تقديم طلب جديد
            </button>
          </div>
        ) : selectedCategory === null ? (
          /* الخطوة 1: اختيار التصنيف الرئيسي الثلاثي */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1- التوصيل */}
            <div 
              onClick={() => handleCategorySelect(1)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">1. قسم التوصيل</h2>
                <p className="text-xs text-gray-500 leading-relaxed">خاص بطلبات الحصول على عمل أو عقد توصيل مع شركات الجملة والموردين.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 pt-2">
                <span>اختر هذا القسم</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

            {/* 2- المحل / السوبرماركت */}
            <div 
              onClick={() => handleCategorySelect(2)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">2. المحل / السوبرماركت</h2>
                <p className="text-xs text-gray-500 leading-relaxed">البحث عن مورد قريب، استعراض المنتجات وتأمين طلبات التوريد للمتجر.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 pt-2">
                <span>اختر هذا القسم</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

            {/* 3- الجملة */}
            <div 
              onClick={() => handleCategorySelect(3)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">3. قسم الجملة والموردين</h2>
                <p className="text-xs text-gray-500 leading-relaxed">طلب سائق توصيل، تقديم عروض الأسعار، وإضافة عملاء محددين (محلات/سوبرماركت).</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 pt-2">
                <span>اختر هذا القسم</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

          </div>
        ) : subRequestType === null ? (
          /* الخطوة 2: اختيار الطلب الفرعي بناءً على القسم المحدد */
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              {selectedCategory === 1 && 'خيارات قسم التوصيل'}
              {selectedCategory === 2 && 'خيارات قسم المحل / السوبرماركت'}
              {selectedCategory === 3 && 'خيارات قسم الجملة والموردين'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {selectedCategory === 1 && (
                <div 
                  onClick={() => handleSubRequestSelect('طلب حصول على عمل مع جملة')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                    <Truck className="w-4 h-4" />
                    <span>طلب حصول على عمل مع جملة</span>
                  </div>
                  <p className="text-xs text-gray-500">تقديم طلب للانضمام كفريق توصيل أو سائق مع شركات الجملة المعتمدة.</p>
                </div>
              )}

              {selectedCategory === 2 && (
                <div 
                  onClick={() => handleSubRequestSelect('طلب الحصول على مورد قريب')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/20 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>طلب الحصول على مورد قريب</span>
                  </div>
                  <p className="text-xs text-gray-500">العثور على أقرب الموردين وموزعي الجملة لتغطية احتياجات متجرك أو السوبرماركت.</p>
                </div>
              )}

              {selectedCategory === 3 && (
                <>
                  <div 
                    onClick={() => handleSubRequestSelect('طلب الحصول على سائق توصيل')}
                    className="p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <Truck className="w-4 h-4" />
                      <span>طلب الحصول على سائق توصيل</span>
                    </div>
                    <p className="text-xs text-gray-500">توفير وتخصيص سائقين لتوصيل طلبات الجملة الخاصة بمستودعك أو شركتك.</p>
                  </div>

                  <div 
                    onClick={() => handleSubRequestSelect('طلب عروض')}
                    className="p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <FileText className="w-4 h-4" />
                      <span>طلب عروض</span>
                    </div>
                    <p className="text-xs text-gray-500">إرسال واستقبال عروض الأسعار للمنتجات والكميات الكبيرة.</p>
                  </div>

                  <div 
                    onClick={() => handleSubRequestSelect('طلب اضافة عميل محل/سوبر ماركت')}
                    className="p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer space-y-2 sm:col-span-2"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <Users className="w-4 h-4" />
                      <span>طلب اضافة عميل محل/سوبر ماركت</span>
                    </div>
                    <p className="text-xs text-gray-500">تسجيل وإضافة عميل جديد (محل تجاري أو سوبرماركت) ضمن قاعدة بيانات التوريد الخاصة بك.</p>
                  </div>
                </>
              )}

            </div>
          </div>
        ) : (
          /* الخطوة 3: نموذج ادخال البيانات النهائي للطلب الموجه */
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs text-blue-600 font-bold block">نوع الطلب المختار:</span>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">{subRequestType}</h2>
              </div>
              <button 
                onClick={() => setSubRequestType(null)}
                className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl transition-all"
              >
                تغيير الاختيار
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">الاسم الكريم / اسم المسؤول</label>
                  <input 
                    type="text" 
                    required
                    placeholder="أدخل الاسم الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف للتواصل</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+966 5xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">المنطقة / العنوان التفصيلي</label>
                <input 
                  type="text" 
                  required
                  placeholder="المدينة، الحي، الشارع"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">تفاصيل إضافية أو ملاحظات الطلب</label>
                <textarea 
                  rows={4}
                  placeholder="اكتب تفاصيل إضافية تدعم طلبك..."
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد وإرسال الطلب</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
                }
