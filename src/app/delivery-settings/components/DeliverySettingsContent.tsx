'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  Save, 
  CheckCircle2, 
  Navigation,
  DollarSign
} from 'lucide-react';

export default function DeliverySettingsContent() {
  const [settings, setSettings] = useState({
    driverName: 'سعيد بن ناصر الحربي',
    phone: '+966 54 321 9876',
    email: 'driver@delivery-domain.com',
    vehicleType: 'دراجة نارية / توصيل سريع',
    plateNumber: 'أ ب ج 1234',
    currentZone: 'الرياض - الشمال والوسط',
    availableForOrders: true,
    smsAlerts: true,
    currentPassword: '',
    newPassword: ''
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إعدادات حساب سائق التوصيل (Delivery Settings)</h1>
            <p className="text-sm text-gray-500 mt-1">تحديث بيانات المركبة، نطاق التغطية الجغرافية، حالة الاتصال بالطلبات، وإعدادات الحساب.</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Truck className="w-4 h-4" />
            <span>لوحة تحكم السائق</span>
          </div>
        </header>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ تعديلات إعدادات السائق بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1- البيانات الشخصية وبيانات المركبة */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span>البيانات الشخصية ومركبة التوصيل</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم السائق الثلاثي</label>
                <input 
                  type="text" 
                  required
                  value={settings.driverName}
                  onChange={(e) => setSettings({...settings, driverName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف للتواصل</label>
                <input 
                  type="text" 
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع وسيلة النقل / المركبة</label>
                <input 
                  type="text" 
                  required
                  value={settings.vehicleType}
                  onChange={(e) => setSettings({...settings, vehicleType: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم لوحة المركبة</label>
                <input 
                  type="text" 
                  required
                  value={settings.plateNumber}
                  onChange={(e) => setSettings({...settings, plateNumber: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">نطاق التغطية والعمل المفضل</label>
              <input 
                type="text" 
                required
                value={settings.currentZone}
                onChange={(e) => setSettings({...settings, currentZone: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 2- إعدادات استقبال الطلبات والتنبيهات */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>إعدادات التوافر واستقبال الطلبات</span>
            </h2>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.availableForOrders}
                  onChange={(e) => setSettings({...settings, availableForOrders: e.target.checked})}
                  className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">متاح الآن لاستقبال طلبات التوصيل الجديدة عبر النظام</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.smsAlerts}
                  onChange={(e) => setSettings({...settings, smsAlerts: e.target.checked})}
                  className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">تفعيل الرسائل النصية وتنبيهات الطوارئ للطلبات العاجلة</span>
              </label>
            </div>
          </div>

          {/* 3- الأمان وتغيير كلمة المرور */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>أمان وحماية الحساب</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الحالية</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-amber-200"
            >
              <Save className="w-4 h-4" />
              <span>حفظ إعدادات السائق</span>
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
