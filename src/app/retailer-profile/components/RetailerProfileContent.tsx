'use client';

import React, { useState } from 'react';
import { Store, User, Phone, MapPin, Mail, Building, Save, CheckCircle2, Shield } from 'lucide-react';

export default function RetailerProfileContent() {
  const [profile, setProfile] = useState({
    storeName: 'مطعم البرجر الذهبي (فرع النخيل)',
    category: 'مأكولات سريعة وبرجر',
    ownerName: 'محمد العتيبي',
    phone: '+966 50 111 2233',
    email: 'gold.burger@example.com',
    city: 'الرياض',
    address: 'شارع الملك فهد، حي النخيل',
    commercialRecord: '1010987654',
    taxNumber: '300123456700003'
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ملف الفرع / المطعم</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة معلومات المنشأة التجارية، بيانات الاتصال، والمعلومات الضريبية.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>حساب معتمد</span>
          </div>
        </header>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ التعديلات وتحديث بيانات الفرع بنجاح!</span>
          </div>
        )}

        {/* نموذج بيانات الملف الشخصي */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم الفرع / المنشأة</label>
                <div className="relative">
                  <Store className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={profile.storeName}
                    onChange={(e) => setProfile({...profile, storeName: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع النشاط</label>
                <input 
                  type="text" 
                  value={profile.category}
                  onChange={(e) => setProfile({...profile, category: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">اسم المسؤول / المدير</label>
                <div className="relative">
                  <User className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={profile.ownerName}
                    onChange={(e) => setProfile({...profile, ownerName: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">المدينة</label>
                <div className="relative">
                  <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={profile.city}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">العنوان التفصيلي</label>
              <input 
                type="text" 
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">السجل التجاري</label>
                <div className="relative">
                  <Building className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={profile.commercialRecord}
                    onChange={(e) => setProfile({...profile, commercialRecord: e.target.value})}
                    className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-600"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">الرقم الضريبي</label>
                <input 
                  type="text" 
                  value={profile.taxNumber}
                  onChange={(e) => setProfile({...profile, taxNumber: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
