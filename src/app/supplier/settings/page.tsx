'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Headset, MapPin, Phone, Mail, Store, LogOut, ShieldCheck, Bell, Globe } from 'lucide-react';

export default function SupplierSettingsPage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'settings' | 'support'>('account');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">الإعدادات والدعم</h1>
          <p className="text-sm text-slate-400">أدر بيانات شركتك وتفضيلاتك وتواصل مع الدعم</p>
        </div>

        {/* رأس البطاقة (معلومات أساسية) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-emerald-400">
            <Store size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-white">{profile?.business_name || profile?.full_name || 'اسم الشركة'}</h2>
            <p className="text-sm text-slate-400" dir="ltr">{user?.email}</p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Store size={12} /> مورد جملة
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm hover:bg-red-500/20 transition">
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>

        {/* التبويبات */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'account' ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            معلومات الحساب
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'settings' ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            الإعدادات
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            الدعم الفني
          </button>
        </div>

        {/* محتوى التبويبات */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={20} className="text-emerald-400" /> بيانات الشركة والحساب
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">اسم الشركة</p>
                  <p className="text-lg font-bold text-white mt-1">{profile?.business_name || 'غير محدد'}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">الاسم الكامل (المسؤول)</p>
                  <p className="text-lg font-bold text-white mt-1">{profile?.full_name}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">رقم الهاتف</p>
                  <p className="text-lg font-bold text-white mt-1" dir="ltr">{profile?.phone || 'غير محدد'}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">البريد الإلكتروني</p>
                  <p className="text-lg font-bold text-white mt-1" dir="ltr">{user?.email}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4 md:col-span-2">
                  <p className="text-xs text-slate-500">المنطقة الجغرافية</p>
                  <p className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-400" />
                    {profile?.governorate || 'بغداد'} - {profile?.district || 'غير محدد'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings size={20} className="text-emerald-400" /> تفضيلات المستخدم
              </h3>
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-slate-400" />
                  <div>
                    <p className="font-bold text-white text-sm">إشعارات الطلبات</p>
                    <p className="text-xs text-slate-500">استلام إشعار عند ورود طلب جديد</p>
                  </div>
                </div>
                <div className="h-6 w-12 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-slate-400" />
                  <div>
                    <p className="font-bold text-white text-sm">اللغة</p>
                    <p className="text-xs text-slate-500">العربية (الافتراضية)</p>
                  </div>
                </div>
                <select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
                  <option>العربية</option>
                  <option>English</option>
                </select>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-slate-400" />
                  <div>
                    <p className="font-bold text-white text-sm">كلمة المرور</p>
                    <p className="text-xs text-slate-500">قم بتحديث كلمة المرور الخاصة بك</p>
                  </div>
                </div>
                <button className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition">تغيير</button>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Headset size={20} className="text-emerald-400" /> تواصل مع الدعم الفني
              </h3>
              <p className="text-sm text-slate-400">فريقنا جاهز لمساعدتك في أي وقت عبر الوسائل المجانية التالية:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="mailto:support@jumlaati.iq" className="group flex items-center gap-4 bg-slate-900/60 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 transition">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">البريد الإلكتروني</p>
                    <p className="text-xs text-slate-500" dir="ltr">support@jumlaati.iq</p>
                  </div>
                </a>
                <a href="tel:+9647700000000" className="group flex items-center gap-4 bg-slate-900/60 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 transition">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">اتصال هاتفي</p>
                    <p className="text-xs text-slate-500" dir="ltr">+964 770 000 0000</p>
                  </div>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
          }
