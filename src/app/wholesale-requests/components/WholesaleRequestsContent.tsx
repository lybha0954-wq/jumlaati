'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Send, 
  Building2, 
  ArrowRight,
  Package,
  Plus,
  Store
} from 'lucide-react';

export default function WholesaleRequestsContent() {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // حالة نموذج البيانات الموحد حسب الطلب المختار
  const [formData, setFormData] = useState({
    // بيانات مشتركة
    name: '',
    phone: '',
    notes: '',
    // خاصة بطلب عميل محل/سوبرماركت
    storeName: '',
    storeLocation: '',
    // خاصة بطلب سائق توصيل
    vehicleType: 'دينا / نقل متوسط',
    shift: 'دوام كامل',
    // خاصة بطلب عروض منتجات
    productCategory: '',
    estimatedQuantity: ''
  });

  const handleSelectRequest = (type: string) => {
    setActiveRequest(type);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setActiveRequest(null);
    setSubmitted(false);
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

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">بوابة خدمات الجملة والموردين</h1>
            <p className="text-sm text-gray-500 mt-1">اختر نوع الطلب المطلوب تقديمه لإدارة وتطوير عمليات التوزيع والتوريد الخاصة بك.</p>
          </div>
          {activeRequest !== null && (
            <button 
              onClick={resetForm}
              className="text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للخيارات الرئيسية</span>
            </button>
          )}
        </header>

        {submitted ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تم تقديم طلبك بنجاح!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">تم إرسال تفاصيل طلبك ({activeRequest}) إلى النظام، وسيقوم فريق المختصين بمراجعته والتواصل معك قريباً.</p>
            <button 
              onClick={resetForm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              تقديم طلب آخر
            </button>
          </div>
        ) : activeRequest === null ? (
          /* الخيارات الثلاثة الرئيسية الخاصة بالجملة */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1- الحصول على عميل محل/سوبرماركت */}
            <div 
              onClick={() => handleSelectRequest('الحصول على عميل محل/سوبرماركت')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-gray-900">1. عميل محل / سوبرماركت</h2>
                <p className="text-xs text-gray-500 leading-relaxed">تقديم طلب لتوسيع نطاق التوزيع الخاص بك والحصول على عملاء تجدد من المحلات والسوبرماركت.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 pt-2 border-t border-gray-100">
                <span>اختيار هذا الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

            {/* 2- الحصول على سائق توصيل */}
            <div 
              onClick={() => handleSelectRequest('الحصول على سائق توصيل')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-gray-900">2. سائق توصيل</h2>
                <p className="text-xs text-gray-500 leading-relaxed">طلب توفير وتخصيص سائقين محترفين لضمان سرعة وتغطية شحنات التوريد والطلبات الكبيرة.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 pt-2 border-t border-gray-100">
                <span>اختيار هذا الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

            {/* 3- تقديم طلب عروض منتجات */}
            <div 
              onClick={() => handleSelectRequest('تقديم طلب عروض منتجات')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-gray-900">3. عروض منتجات</h2>
                <p className="text-xs text-gray-500 leading-relaxed">تقديم عروض الأسعار والكميات المتاحة للمنتجات الاستهلاكية وتلقي طلبات الشراء بالجملة.</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 pt-2 border-t border-gray-100">
                <span>اختيار هذا الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>

          </div>
        ) : (
          /* نموذج إدخال البيانات المخصص حسب نوع الطلب */
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs text-emerald-600 font-semibold block">نموذج تقديم:</span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">{activeRequest}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* حقول مشتركة للجميع */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المسؤول / ممثل الشركة</label>
                  <input 
                    type="text" 
                    required
                    placeholder="أدخل الاسم الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* حقول إضافية خاصة بـ: الحصول على عميل محل/سوبرماركت */}
              {activeRequest === 'الحصول على عميل محل/سوبرماركت' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع ونشاط المحل المستهدف</label>
                    <input 
                      type="text" 
                      required
                      placeholder="مثال: سوبرماركت مواد غذائية، بقالة تجزئة"
                      value={formData.storeName}
                      onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">المنطقة الجغرافية المطلوبة للتوريد</label>
                    <input 
                      type="text" 
                      required
                      placeholder="مثال: مدينة الرياض - حي النخيل والشمال"
                      value={formData.storeLocation}
                      onChange={(e) => setFormData({...formData, storeLocation: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* حقول إضافية خاصة بـ: الحصول على سائق توصيل */}
              {activeRequest === 'الحصول على سائق توصيل' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع المركبة المطلوبة للتوصيل</label>
                    <select 
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="دينا / نقل متوسط">دينا / نقل متوسط</option>
                      ق<option value="دباب / توصيل سريع">دباب / توصيل سريع</option>
                      <option value="سيارة نقل خفيف">سيارة نقل خفيف</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">طبيعة الدوام أو الفترة</label>
                    <select 
                      value={formData.shift}
                      onChange={(e) => setFormData({...formData, shift: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="دوام كامل">دوام كامل</option>
                      <option value="دوام جزئي / شحنات محددة">دوام جزئي / شحنات محددة</option>
                    </select>
                  </div>
                </div>
              )}

              {/* حقول إضافية خاصة بـ: تقديم طلب عروض منتجات */}
              {activeRequest === 'تقديم طلب عروض منتجات' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">تصنيف المنتجات المعروضة</label>
                    <input 
                      type="text" 
                      required
                      placeholder="مثال: مواد استهلاكية، أوراق وتغليف، معلبات"
                      value={formData.productCategory}
                      onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">الكميات المتاحة / الحد الأدنى للطلب</label>
                    <input 
                      type="text" 
                      required
                      placeholder="مثال: كراتين جملة - الحد الأدنى 500 ر.س"
                      value={formData.estimatedQuantity}
                      onChange={(e) => setFormData({...formData, estimatedQuantity: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">تفاصيل وملاحظات إضافية</label>
                <textarea 
                  rows={4}
                  placeholder="اكتب تفاصيل إضافية تدعم طلبك..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-emerald-200"
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
