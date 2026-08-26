'use client';
import React, { useState } from 'react';
import { Settings, Percent, User, Phone, Mail, Lock, CheckCircle, HelpCircle, MessageSquare, ChevronDown, ChevronUp, LogOut, X, DollarSign, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';
import DebtPaymentModal from '@/components/ui/DebtPaymentModal';

const faqs = [
  { q: 'كيف يتم احتساب عمولة المنصة؟', a: 'تُحتسب العمولة كنسبة مئوية من إجمالي قيمة كل طلب مكتمل، وتُخصم تلقائياً عند تسوية المدفوعات.' },
  { q: 'هل يمكن تغيير نسبة العمولة لكل مورد بشكل منفصل؟', a: 'نعم، يمكن ضبط نسبة عمولة مخصصة لكل مورد من صفحة إدارة الموردين، وإلا تُطبق النسبة الافتراضية.' },
  { q: 'كيف أتواصل مع الدعم الفني؟', a: 'يمكنك فتح تذكرة دعم من لوحة المدير أو التواصل عبر البريد الإلكتروني support@jumlaati.iq' },
  { q: 'ما هي مدة معالجة طلبات التسجيل الجديدة؟', a: 'تُعالج طلبات التسجيل خلال ٢٤-٤٨ ساعة عمل من تاريخ تقديمها.' },
];

// ── Sign-Out Confirmation Modal ───────────────────────────────────────────────
function SignOutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <LogOut size={28} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-arabic font-bold text-xl text-foreground">تأكيد تسجيل الخروج</h2>
            <p className="font-arabic text-sm text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة الإدارة؟</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-muted/80 active:scale-95 transition-all">إلغاء</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Financial Transactions Modal ──────────────────────────────────────────────
function FinancialModal({ onClose }: { onClose: () => void }) {
  const transactions = [
    { id: 'TXN-001', type: 'تسوية', from: 'سوبرماركت الأمل', to: 'شركة الفرات', amount: 1_870_000, date: '٢٠٢٦/٠٨/٠٥', status: 'مكتمل' },
    { id: 'TXN-002', type: 'دين', from: 'متجر الرافدين', to: 'مستودع النخيل', amount: 980_000, date: '٢٠٢٦/٠٨/٠٤', status: 'متأخر' },
    { id: 'TXN-003', type: 'دفعة', from: 'متجر النور', to: 'مجمع الرافدين', amount: 2_450_000, date: '٢٠٢٦/٠٨/٠٣', status: 'مكتمل' },
    { id: 'TXN-004', type: 'عمولة', from: 'المنصة', to: 'الإدارة', amount: 487_000, date: '٢٠٢٦/٠٨/٠٢', status: 'مكتمل' },
    { id: 'TXN-005', type: 'نزاع', from: 'بقالة الزهراء', to: 'شركة بابل', amount: 340_000, date: '٢٠٢٦/٠٨/٠١', status: 'قيد المراجعة' },
  ];
  const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-l from-blue-600 to-violet-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-arabic font-bold text-white text-base">الرقابة المالية والمعاملات</h2>
              <p className="text-white/70 text-xs font-arabic">حركة الديون والفواتير والتسويات</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"><X size={18} /></button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 border-b border-border flex-shrink-0">
          {[
            { label: 'إجمالي المعاملات', value: fmt(6_127_000), color: 'text-blue-600' },
            { label: 'العمولات', value: fmt(487_000), color: 'text-violet-600' },
            { label: 'نزاعات نشطة', value: '١ نزاع', color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className={`text-sm font-bold font-arabic tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-arabic mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Transactions list */}
        <div className="overflow-y-auto flex-1 divide-y divide-border">
          {transactions.map((t, i) => {
            const statusColor = t.status === 'مكتمل' ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : t.status === 'متأخر' ? 'text-red-700 bg-red-50 border-red-200'
              : t.status === 'قيد المراجعة'? 'text-amber-700 bg-amber-50 border-amber-200' :'text-blue-700 bg-blue-50 border-blue-200';
            const typeColor = t.type === 'عمولة' ? 'bg-violet-100 text-violet-700'
              : t.type === 'نزاع' ? 'bg-red-100 text-red-700'
              : t.type === 'دين'? 'bg-amber-100 text-amber-700' :'bg-blue-100 text-blue-700';
            return (
              <div key={i} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full ${typeColor}`}>{t.type}</span>
                    <span className="text-xs font-arabic text-muted-foreground">{t.id}</span>
                  </div>
                  <span className={`text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>{t.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-arabic text-sm font-semibold text-foreground tabular-nums">{fmt(t.amount)}</p>
                  <p className="text-[10px] text-muted-foreground font-arabic">{t.date}</p>
                </div>
                <p className="text-xs text-muted-foreground font-arabic">{t.from} ← {t.to}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SupportSettingsContent() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [commissionRate, setCommissionRate] = useState('5');
  const [minOrderFee, setMinOrderFee] = useState('2500');
  const [saved, setSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showFinancial, setShowFinancial] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [profile, setProfile] = useState({
    name: 'أحمد الجبوري',
    phone: '07701234567',
    email: 'admin@jumlaati.iq',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    setShowSignOut(false);
    try { await signOut(); } catch { /* silent */ }
    router.push('/sign-up-login');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">الدعم الفني والإعدادات</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">ضبط إعدادات الحساب ونسبة عمولة المنصة</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Financial Modal Button */}
          <button
            onClick={() => setShowFinancial(true)}
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-arabic font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
          >
            <BarChart2 size={14} />
            المعاملات المالية
          </button>
          {/* Sign Out */}
          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-arabic font-semibold px-3 py-2 rounded-xl hover:bg-red-600 active:scale-95 transition-all"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">إعدادات الحساب</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'الاسم الكامل', key: 'name', icon: User, type: 'text' },
              { label: 'رقم الهاتف', key: 'phone', icon: Phone, type: 'tel' },
              { label: 'البريد الإلكتروني', key: 'email', icon: Mail, type: 'email' },
            ].map((field) => {
              const FieldIcon = field.icon;
              return (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">{field.label}</label>
                  <div className="relative">
                    <FieldIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={field.type}
                      value={profile[field.key as keyof typeof profile]}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>
              );
            })}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" placeholder="اتركها فارغة إذا لم تريد التغيير" className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-arabic font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'}`}
          >
            {saved ? <CheckCircle size={16} /> : <Settings size={16} />}
            {saved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
          </button>

          {/* Sign Out in account section */}
          <button
            onClick={() => setShowSignOut(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-arabic font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
          >
            <LogOut size={16} />
            تسجيل الخروج من لوحة الإدارة
          </button>
        </div>

        {/* Platform Commission Settings */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Percent size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">إعدادات العمولة</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">نسبة عمولة المنصة (%)</label>
              <div className="relative">
                <Percent size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="number" min="0" max="30" step="0.5" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <p className="text-xs text-muted-foreground font-arabic mt-1">النسبة الحالية: {commissionRate}٪ من كل طلب مكتمل</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">رسوم التوصيل الافتراضية (د.ع)</label>
              <input type="number" value={minOrderFee} onChange={(e) => setMinOrderFee(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-emerald-700 font-arabic">معاينة العمولة</p>
              {[100000, 500000, 1000000].map((amount) => (
                <div key={amount} className="flex justify-between text-xs font-arabic">
                  <span className="text-muted-foreground">طلب بقيمة {amount.toLocaleString()} د.ع</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">{((amount * Number(commissionRate)) / 100).toLocaleString()} د.ع</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground font-arabic uppercase tracking-wider">إشعارات النظام</p>
              {[
                { label: 'إشعارات الطلبات الجديدة', defaultOn: true },
                { label: 'تنبيهات طلبات التسجيل', defaultOn: true },
                { label: 'تقارير المالية الأسبوعية', defaultOn: false },
              ].map((toggle, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-arabic text-foreground">{toggle.label}</span>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${toggle.defaultOn ? 'bg-accent' : 'bg-muted'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggle.defaultOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-arabic font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'}`}
          >
            {saved ? <CheckCircle size={16} /> : <Settings size={16} />}
            {saved ? 'تم الحفظ بنجاح' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <DollarSign size={16} className="text-amber-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">مركز الإشعارات</h2>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-xs font-arabic font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            {showNotifications ? 'إخفاء' : 'عرض الإشعارات'}
          </button>
        </div>
        {showNotifications && (
          <div className="pt-2">
            <UnifiedNotificationCenter role="admin" embedded />
          </div>
        )}
      </div>

      {/* FAQ / Support */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <HelpCircle size={16} className="text-violet-600" />
          </div>
          <h2 className="text-base font-bold text-foreground font-arabic">الأسئلة الشائعة والدعم</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-right hover:bg-muted/20 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground font-arabic">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-sm text-muted-foreground font-arabic border-t border-border bg-muted/10">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl p-4">
          <MessageSquare size={20} className="text-violet-600 flex-shrink-0" />
          <div className="flex-1 font-arabic">
            <p className="text-sm font-semibold text-foreground">تحتاج مساعدة إضافية؟</p>
            <p className="text-xs text-muted-foreground mt-0.5">تواصل مع فريق الدعم عبر support@jumlaati.iq</p>
          </div>
          <button className="bg-violet-600 text-white text-xs font-arabic font-semibold px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
            تواصل معنا
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} onConfirm={handleSignOut} />}
      {showFinancial && <FinancialModal onClose={() => setShowFinancial(false)} />}
      {showNotifications && <DebtPaymentModal onClose={() => setShowNotifications(false)} role="admin" />}
    </div>
  );
}
