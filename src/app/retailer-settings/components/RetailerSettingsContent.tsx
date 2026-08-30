'use client';

import React, { useState } from 'react';
import { Store, Lock, Bell, Save, CheckCircle2 } from 'lucide-react';

export default function RetailerSettingsContent() {
  const [settings, setSettings] = useState({
    storeName: 'سوبرماركت البركة السريع',
    managerName: 'خالد عبد الله التميمي',
    phone: '+966 50 987 6543',
    email: 'retailer@market-domain.com',
    location: 'الرياض - حي الملز، الشارع العام',
    commercialRegister: '1010XXXXXX',
    notificationsEnabled: true,
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
            <h1 className="text-2xl font-bold text-gray-900">إعدادات حساب المحل / السوبرماركت (Retailer Settings)</h1>
            <p className="text-sm text-gray-500 mt-1">تحديث بيانات الفرع، الموقع الجغرافي، التنبيهات، وإعدادات الأمان الخاصة بحسابك.</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Store className="w-4 h-4" />
            <span>لوحة تحكم المحل</span>
          </div>
        </header>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ تحديثات إعدادات المحل والسوبرماركت بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1- البيانات الأساسية للمحل */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              <span>بيانات المحل والسوبرماركت التجاري</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المحل أو السوبرماركت</label>
                <input 
                  type="text" 
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المسؤول / المدير المسؤول</label>
                <input 
                  type="text" 
                  required
                  value={settings.managerName}
                  onChange={(e) => setSettings({...settings, managerName: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف للتواصل</label>
                <input 
                  type="text" 
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">عنوان الموقع الجغرافي للفرع</label>
                <input 
                  type="text" 
                  required
                  value={settings.location}
                  onChange={(e) => setSettings({...settings, location: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم السجل التجاري / الترخيص</label>
                <input 
                  type="text" 
                  required
                  value={settings.commercialRegister}
                  onChange={(e) => setSettings({...settings, commercialRegister: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2- إعدادات التنبيهات والإشعارات */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>إعدادات الإشعارات وتتبع الطلبات</span>
            </h2>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">تلقي إشعارات حالة شحنات الجملة وتحديثات السائقين فورياً</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.smsAlerts}
                  onChange={(e) => setSettings({...settings, smsAlerts: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">تفعيل الرسائل النصية القصيرة (SMS) لتأكيدات التوصيل</span>
              </label>
            </div>
          </div>

          {/* 3- الأمان وتغيير كلمة المرور */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>إعدادات الحماية والأمان</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الحالية</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-indigo-200"
            >
              <Save className="w-4 h-4" />
              <span>حفظ تعديلات إعدادات المحل</span>
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
import ProfileImageUploader from '@/components/ui/ProfileImageUploader';
import { createClient } from '@/lib/supabase/server';

export default async function SupplierSettingsPage() {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, store_logo')
    .single();

  // سنستخدم Client Wrapper لتحديث الحالة
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">إعدادات المتجر</h1>
      
      {/* شعار المتجر */}
      <ProfileImageUploaderWrapper 
        type="logo" 
        initialImage={profile?.store_logo || null}
        fieldName="store_logo"
      />
      
      {/* الصورة الشخصية */}
      <ProfileImageUploaderWrapper 
        type="avatar" 
        initialImage={profile?.avatar_url || null}
        fieldName="avatar_url"
      />
    </div>
  );
}

// مكون Client لالتقاط التحديثات
'use client';
function ProfileImageUploaderWrapper({ type, initialImage, fieldName }: any) {
  const [image, setImage] = useState(initialImage);
  
  // هنا يمكن إضافة تحديث للـ Store أو الـ Context إذا أردت
  return (
    <ProfileImageUploader 
      type={type}
      currentImage={image}
      onImageUpdate={(newUrl) => setImage(newUrl)}
    />
  );
}
