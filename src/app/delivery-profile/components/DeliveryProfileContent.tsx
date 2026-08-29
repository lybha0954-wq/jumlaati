'use client';

import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Bike, 
  ShieldCheck, 
  Award, 
  Settings, 
  LogOut, 
  Edit3, 
  CheckCircle2 
} from 'lucide-react';

export default function DeliveryProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'أحمد محمد علي',
    phone: '+966 50 123 4567',
    email: 'ahmed.delivery@email.com',
    city: 'الرياض، المملكة العربية السعودية',
    vehicle: 'دراجة نارية (Scooter)',
    licenseNumber: 'DL-987654321',
    rating: 4.9,
    totalDeliveries: 1420,
    completionRate: '99.2%',
    joinDate: 'يناير 2023',
    status: 'نشط وجاهز للطلبات'
  });

  const [formData, setFormData] = useState(profile);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* إشعار الحفظ بنجاح */}
        {savedMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم تحديث بيانات الملف الشخصي بنجاح!</span>
          </div>
        )}

        {/* رأس الصفحة / البطاقة التعريفية */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            <div className="relative">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                {profile.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 left-0 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" title={profile.status}></span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                {profile.city}
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mt-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>حساب موثق رسمي</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}</span>
          </button>
        </div>

        {/* إحصائيات السائق السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">التقييم العام</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                {profile.rating} <span className="text-xs font-normal text-gray-400">(من 5.0)</span>
              </h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">إجمالي التوصيلات</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{profile.totalDeliveries} طلب</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">نسبة إنجاز الطلبات</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{profile.completionRate}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* تفاصيل الملف الشخصي أو نموذج التعديل */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>معلومات الحساب والمركبة</span>
          </h2>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الاسم الكامل</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهاتف</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">نوع المركبة</label>
                  <input 
                    type="text" 
                    value={formData.vehicle}
                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                  <Bike className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">نوع المركبة</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.vehicle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">رقم الرخصة / الهوية</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.licenseNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* إعدادات إضافية وتسجيل الخروج */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">تاريخ الانضمام لمنصة التوصيل: <strong className="text-gray-800">{profile.joinDate}</strong></span>
          </div>

          <button 
            onClick={() => alert('تم تسجيل الخروج بنجاح')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

      </div>
    </main>
  );
}
