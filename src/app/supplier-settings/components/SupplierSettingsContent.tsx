'use client';

import React, { useState } from 'react';
import { Building2, Lock, Save, CheckCircle2, Truck } from 'lucide-react';

export default function SupplierSettingsContent() {
  const [settings, setSettings] = useState({
    companyName: 'مؤسسة التوريدات الحديثة للجملة',
    ownerName: 'أحمد بن محمد السالم',
    phone: '+966 55 123 4567',
    email: 'supplier@wholesale-domain.com',
    city: 'الرياض - المنطقة الصناعية الثانية',
    minOrderAmount: '500',
    deliveryRadius: '50',
    notificationsEnabled: true,
    autoAcceptOrders: false,
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
            <h1 className="text-2xl font-bold text-gray-900">إعدادات حساب المورّد (Supplier Settings)</h1>
            <p className="text-sm text-gray-500 mt-1">تعديل بيانات المؤسسة، سياسات الحد الأدنى للطلب، نطاق التغطية، وإعدادات الأمان والتنبيهات.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>لوحة تحكم المورّد</span>
          </div>
        </header>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ تحديثات إعدادات الحساب بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1- البيانات الأساسية للمؤسسة */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>البيانات الأساسية ونشاط الجملة</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المؤسسة / الشركة التجارية</label>
                <input 
                  type="text" 
                  required
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المسؤول / ممثل المورّد</label>
                <input 
                  type="text" 
                  required
                  value={settings.ownerName}
                  onChange={(e) => setSettings({...settings, ownerName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف الرسمي</label>
                <input 
                  type="text" 
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">موقع ومقر المستودع الرئيسي</label>
              <input 
                type="text" 
                required
                value={settings.city}
                onChange={(e) => setSettings({...settings, city: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 2- إعدادات سياسات التوريد والطلبات */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>سياسات الشحن والحد الأدنى للطلبات</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">الحد الأدنى لقيمة طلب الجملة (ر.س)</label>
                <input 
                  type="number" 
                  required
                  value={settings.minOrderAmount}
                  onChange={(e) => setSettings({...settings, minOrderAmount: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">نطاق التغطية الجغرافية (كم)</label>
                <input 
                  type="number" 
                  required
                  value={settings.deliveryRadius}
                  onChange={(e) => setSettings({...settings, deliveryRadius: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">تفعيل تلقي إشعارات الطلبات الفورية عبر المنصة</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoAcceptOrders}
                  onChange={(e) => setSettings({...settings, autoAcceptOrders: e.target.checked})}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">القبول التلقائي لطلبات الجملة المتوافقة مع الشروط</span>
              </label>
            </div>
          </div>

          {/* 3- الأمان وتغيير كلمة المرور */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>إعدادات الأمان وحماية الحساب</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الحالية</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-emerald-200"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات والإعدادات</span>
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
