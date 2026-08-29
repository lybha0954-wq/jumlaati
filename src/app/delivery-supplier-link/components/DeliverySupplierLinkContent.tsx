'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Building2, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Send, 
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function DeliverySupplierLinkContent() {
  const [formData, setFormData] = useState({
    driverName: '',
    phone: '',
    vehicleType: 'دينا / نقل متوسط',
    operatingArea: '',
    experienceYears: 'سنة إلى 3 سنوات',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      driverName: '',
      phone: '',
      vehicleType: 'دينا / نقل متوسط',
      operatingArea: '',
      experienceYears: 'سنة إلى 3 سنوات',
      notes: ''
    });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">بوابة التوصيل: طلب الربط بمورد جملة</h1>
            <p className="text-sm text-gray-500 mt-1">قدم طلبك الآن للانضمام والربط المباشر مع شبكة موردي وشركات الجملة المعتمدة.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Truck className="w-4 h-4" />
            <span>خدمة السائقين وشركات التوصيل</span>
          </div>
        </header>

        {submitted ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تم إرسال طلب الربط بنجاح!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">تم استلام طلبك للانضمام والربط بموردي الجملة. سيقوم فريق المراجعة بالتواصل معك قريباً لتفعيل حسابك وتحديد العقود.</p>
            <button 
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              تقديم طلب جديد
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">نموذج طلب ربط سائق/موصّل بمورد جملة</h2>
                <p className="text-xs text-gray-400">يرجى تعبئة البيانات أدناه بدقة لضمان سرعة معالجة الطلب وتوجيهه للجهة المناسبة.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم السائق / ممثل التوصيل</label>
                  <input 
                    type="text" 
                    required
                    placeholder="أدخل الاسم الثلاثي"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف الأساسي</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع المركبة المستخدمة</label>
                  <select 
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="دينا / نقل متوسط">دينا / نقل متوسط</option>
                    <option value="دباب / توصيل سريع">دباب / توصيل سريع</option>
                    <option value="سيارة نقل خفيف (فان)">سيارة نقل خفيف (فان)</option>
                    <option value="شاحنة ثقيلة">شاحنة ثقيلة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">سنوات الخبرة في التوزيع</label>
                  <select 
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="أقل من سنة">أقل من سنة</option>
                    <option value="سنة إلى 3 سنوات">سنة إلى 3 سنوات</option>
                    <option value="أكثر من 3 سنوات">أكثر من 3 سنوات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">منطقة العمل أو التغطية المفضلة</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: الرياض - شمال وشرق المدينة"
                  value={formData.operatingArea}
                  onChange={(e) => setFormData({...formData, operatingArea: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">ملاحظات إضافية أو تفاصيل الترخيص</label>
                <textarea 
                  rows={3}
                  placeholder="اكتب أي تفاصيل أخرى ترغب في توضيحها للموردين..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال طلب الربط بالمورد</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
