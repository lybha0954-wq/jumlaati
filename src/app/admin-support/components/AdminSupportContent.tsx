'use client';

import React, { useState } from 'react';
import { Headphones, MessageCircle, Send, Video, Mail, CheckCircle2, Users, Store, Truck } from 'lucide-react';

export default function AdminSupportContent() {
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'telegram' | 'email' | 'meeting'>('whatsapp');
  const [targetGroup, setTargetGroup] = useState<'suppliers' | 'retailers' | 'drivers'>('suppliers');
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessageText('');
    }, 3500);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مركز الدعم الفني والتواصل الإداري</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة الدعم الفني والتواصل مع الموردين والمحلات والسائقين عبر وسائل الاتصال المجانية المتاحة.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Headphones className="w-4 h-4" />
            <span>قنوات اتصال مجانية 100%</span>
          </div>
        </header>

        {/* شبكة خيارات قنوات التواصل المجانية المتاحة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* واتساب */}
          <div 
            onClick={() => setSelectedChannel('whatsapp')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${selectedChannel === 'whatsapp' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">واتساب (WhatsApp)</h2>
              <p className="text-xs text-gray-400 mt-0.5">البث السريع والرسائل الفورية</p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>قناة مجانية نشطة</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          {/* تيليجرام */}
          <div 
            onClick={() => setSelectedChannel('telegram')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${selectedChannel === 'telegram' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">تيليجرام (Telegram)</h2>
              <p className="text-xs text-gray-400 mt-0.5">مجموعات وقنوات الإشعارات</p>
            </div>
            <div className="text-[11px] font-semibold text-blue-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>قناة مجانية نشطة</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
          </div>

          {/* اجتماعات مجانية Google Meet / Jitsi */}
          <div 
            onClick={() => setSelectedChannel('meeting')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${selectedChannel === 'meeting' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">اجتماعات مرئية (Meet)</h2>
              <p className="text-xs text-gray-400 mt-0.5">مكالمات فيديو ودعم فني مباشر</p>
            </div>
            <div className="text-[11px] font-semibold text-purple-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>بدون رسوم ترخيص</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
          </div>

          {/* البريد الإلكتروني المجاني */}
          <div 
            onClick={() => setSelectedChannel('email')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${selectedChannel === 'email' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">البريد (SMTP / Webmail)</h2>
              <p className="text-xs text-gray-400 mt-0.5">التنبيهات والشكاوى الرسمية</p>
            </div>
            <div className="text-[11px] font-semibold text-amber-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>خدمة مجانية أساسية</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
          </div>

        </div>

        {/* لوحة إرسال الرسائل والتنبيهات الجماعية للأطراف */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">إرسال تعميم أو دعم فني مباشر عبر القناة المحددة</h2>
              <p className="text-xs text-gray-400 mt-0.5">اختر الفئة المستهدفة واكتب رسالتك لإرسالها مباشرة.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl">
              القناة الحالية: <span className="text-blue-600 uppercase">{selectedChannel}</span>
            </span>
          </div>

          {sentSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم إرسال الرسالة/التعميم بنجاح عبر قناة الاتصال المجانية المحددة!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">اختر الفئة المستهدفة بالدعم / التواصل:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetGroup('suppliers')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${targetGroup === 'suppliers' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Users className="w-4 h-4" />
                  <span>مورّدي الجملة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup('retailers')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${targetGroup === 'retailers' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Store className="w-4 h-4" />
                  <span>المحلات والسوبرماركت</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup('drivers')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${targetGroup === 'drivers' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Truck className="w-4 h-4" />
                  <span>سائقين التوصيل</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">محتوى رسالة الدعم أو الإشعار:</label>
              <textarea 
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="اكتب تفاصيل التوجيه، تعليمات الدعم الفني، أو رابط الاجتماع المجاني..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
              >
                <Send className="w-4 h-4" />
                <span>إرسال عبر الوسيلة المجانية</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
