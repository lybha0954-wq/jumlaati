'use client';

import React, { useState } from 'react';
import { 
  Headphones, 
  MessageCircle, 
  Send, 
  Video, 
  Mail, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  PhoneCall
} from 'lucide-react';

export default function SupplierSupportContent() {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'telegram' | 'meeting' | 'email'>('whatsapp');
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    orderRef: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSupportForm({ subject: '', message: '', orderRef: '' });
    }, 4000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مركز الدعم الفني للمورّدين (Supplier Support)</h1>
            <p className="text-sm text-gray-500 mt-1">تواصل مجاني وسريع مع الإدارة وفريق الدعم الفني عبر القنوات المتاحة دون أي رسوم إضافية.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>بوابة المورّد المعتمدة</span>
          </div>
        </header>

        {/* قنوات التواصل المجانية المتاحة للمورّد */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* واتساب الدعم الفني */}
          <div 
            onClick={() => setActiveChannel('whatsapp')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${activeChannel === 'whatsapp' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">واتساب المورّدين</h2>
              <p className="text-xs text-gray-400 mt-0.5">دردشة فورية واستفسارات سريعة</p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>متاح طوال اليوم (مجاني)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          {/* تيليجرام الدعم */}
          <div 
            onClick={() => setActiveChannel('telegram')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${activeChannel === 'telegram' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">قناة وتليجرام المورّدين</h2>
              <p className="text-xs text-gray-400 mt-0.5">مجموعة الإشعارات والتحديثات</p>
            </div>
            <div className="text-[11px] font-semibold text-blue-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>تواصل جماعي وفردي</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
          </div>

          {/* مكالمة فيديو / اجتماع مجاني */}
          <div 
            onClick={() => setActiveChannel('meeting')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${activeChannel === 'meeting' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">مكالمة فيديو (Meet)</h2>
              <p className="text-xs text-gray-400 mt-0.5">دعم فني مرئي لحل المشاكل التقنية</p>
            </div>
            <div className="text-[11px] font-semibold text-purple-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>حسب الموعد المسبق</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div 
            onClick={() => setActiveChannel('email')}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all cursor-pointer space-y-3 ${activeChannel === 'email' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-gray-100 hover:border-gray-300'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">البريد الإلكتروني</h2>
              <p className="text-xs text-gray-400 mt-0.5">للشكاوى والطلبات الرسمية</p>
            </div>
            <div className="text-[11px] font-semibold text-amber-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>استجابة خلال ساعات</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
          </div>

        </div>

        {/* نموذج إرسال التذكرة أو الاستفسار المباشر للإدارة */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">إرسال تذكرة دعم أو استفسار فني</h2>
              <p className="text-xs text-gray-400 mt-0.5">سيتم معالجة طلبك وإرسال الرد عبر القناة المحددة ({activeChannel}).</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              القناة المختارة: <span className="uppercase">{activeChannel}</span>
            </span>
          </div>

          {submitted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم إرسال تذكرة الدعم بنجاح! سيتم التواصل معك قريباً.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">موضوع التذكرة / المشكلة</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مشكلة في تحديث أسعار المنتجات، استفسار عن عمولة"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الطلب المرتبط (اختياري)</label>
                <input 
                  type="text" 
                  placeholder="مثال: #ORD-3120"
                  value={supportForm.orderRef}
                  onChange={(e) => setSupportForm({...supportForm, orderRef: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">تفاصيل الاستفسار أو الدعم الفني المطلوب</label>
              <textarea 
                rows={4}
                required
                placeholder="اكتب تفاصيل المشكلة أو الاستفسار بوضوح..."
                value={supportForm.message}
                onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm shadow-emerald-200"
              >
                <Send className="w-4 h-4" />
                <span>إرسال التذكرة لفريق الدعم</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
