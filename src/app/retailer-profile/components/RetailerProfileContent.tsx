'use client';
import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Save, CheckCircle, MapPin, Bell, Shield, LogOut, HelpCircle, FileText, ChevronDown, ChevronUp, Building2, Eye, EyeOff, MessageCircle, Star, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '../../../components/ui/AppIcon';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';
import DebtPaymentModal from '../../../components/ui/DebtPaymentModal';


type Section = 'account' | 'notifications' | 'support' | 'privacy';

const FAQ_ITEMS = [
  { q: 'كيف أضيف منتجات للسلة؟', a: 'انتقل إلى قسم الأقسام والمنتجات، ابحث عن المنتج المطلوب واضغط "أضف للسلة" بنقرة واحدة.' },
  { q: 'كيف أتابع حالة طلبي؟', a: 'من الصفحة الرئيسية يمكنك رؤية آخر الطلبات مع حالتها مباشرة. كما يمكنك الضغط على "عرض الكل" لتفاصيل أكثر.' },
  { q: 'ما هو الحد الائتماني؟', a: 'الحد الائتماني هو مبلغ الشراء المسموح به قبل السداد. يمكنك مراجعته من قسم السلة والطلب.' },
  { q: 'كيف أتواصل مع المورد؟', a: 'يمكنك التواصل مع فريق الدعم الفني عبر الواتساب أو البريد الإلكتروني وسيتم توجيهك للمورد المناسب.' },
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
            <p className="font-arabic text-sm text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟</p>
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

export default function RetailerProfileContent() {
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('account');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);

  const [profile, setProfile] = useState({
    storeName: user?.user_metadata?.business_name || 'متجر الجبوري',
    ownerName: user?.user_metadata?.full_name || 'أحمد الجبوري',
    phone: user?.user_metadata?.phone || '07701234567',
    email: user?.email || 'ahmed@store.iq',
    city: user?.user_metadata?.city || 'بغداد',
    newPassword: '',
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    deliveryUpdates: true,
    promotions: false,
    weeklyReport: true,
    debtAlerts: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    setShowSignOutModal(false);
    try { await signOut(); } catch { /* silent */ }
    router.push('/sign-up-login');
  };

  const sections: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'account', label: 'حسابي', icon: User, color: 'text-blue-600' },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, color: 'text-amber-600' },
    { id: 'support', label: 'الدعم الفني', icon: HelpCircle, color: 'text-emerald-600' },
    { id: 'privacy', label: 'الخصوصية', icon: Shield, color: 'text-violet-600' },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">

      {/* ── Profile Header ── */}
      <div className="bg-gradient-to-l from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl font-arabic flex-shrink-0">
          {(profile.storeName || 'م').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-arabic font-bold text-foreground text-base truncate">{profile.storeName}</h2>
          <p className="font-arabic text-xs text-muted-foreground truncate">{profile.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="bg-primary/10 text-primary text-[10px] font-arabic font-semibold px-2 py-0.5 rounded-full">
              {role === 'retailer' ? 'تاجر' : role}
            </span>
            <div className="flex items-center gap-0.5">
              <Star size={10} className="text-warning fill-warning" />
              <span className="text-[10px] text-muted-foreground font-arabic">4.8</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowDebtModal(true)}
            className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors"
            title="الديون والمدفوعات"
          >
            <DollarSign size={16} />
          </button>
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ── Section Nav ── */}
      <div className="grid grid-cols-4 gap-2">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center transition-all ${
                activeSection === sec.id
                  ? 'bg-primary/5 border-primary/30 text-primary' :'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/20'
              }`}
            >
              <Icon size={18} className={activeSection === sec.id ? 'text-primary' : sec.color} />
              <span className="font-arabic text-[10px] font-semibold leading-none">{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── ACCOUNT SECTION ── */}
      {activeSection === 'account' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <Building2 size={15} className="text-blue-600" />
              معلومات المتجر
            </h3>
            <div className="space-y-3">
              {[
                { label: 'اسم المتجر', key: 'storeName', icon: Building2, type: 'text' },
                { label: 'اسم المالك', key: 'ownerName', icon: User, type: 'text' },
                { label: 'رقم الهاتف', key: 'phone', icon: Phone, type: 'tel' },
                { label: 'البريد الإلكتروني', key: 'email', icon: Mail, type: 'email' },
                { label: 'المدينة', key: 'city', icon: MapPin, type: 'text' },
              ].map((field) => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1">{field.label}</label>
                    <div className="relative">
                      <FieldIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={field.type}
                        value={profile[field.key as keyof typeof profile]}
                        onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Password */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <Lock size={15} className="text-violet-600" />
              تغيير كلمة المرور
            </h3>
            <div className="relative">
              <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={profile.newPassword}
                onChange={(e) => setProfile((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="كلمة المرور الجديدة (اتركها فارغة للإبقاء)"
                className="w-full pr-9 pl-10 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-arabic font-bold transition-all ${
              saved ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'تم الحفظ بنجاح ✓' : 'حفظ التغييرات'}
          </button>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-arabic text-sm font-bold text-red-700 mb-1">منطقة الخطر</p>
            <p className="font-arabic text-xs text-red-500 mb-3">حذف الحساب نهائي ولا يمكن التراجع عنه.</p>
            <button className="text-xs font-arabic font-semibold text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
              حذف الحساب نهائياً
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS SECTION ── */}
      {activeSection === 'notifications' && (
        <UnifiedNotificationCenter role="retailer" embedded />
      )}

      {/* ── SUPPORT SECTION ── */}
      {activeSection === 'support' && (
        <div className="space-y-4">
          {/* Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'واتساب', icon: MessageCircle, color: 'bg-emerald-500', desc: 'دعم فوري' },
              { label: 'البريد الإلكتروني', icon: Mail, color: 'bg-blue-500', desc: 'خلال 24 ساعة' },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button key={opt.label} className={`${opt.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 hover:opacity-90 active:scale-95 transition-all`}>
                  <Icon size={22} />
                  <span className="font-arabic text-sm font-bold">{opt.label}</span>
                  <span className="font-arabic text-xs opacity-80">{opt.desc}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
                <HelpCircle size={15} className="text-emerald-600" />
                الأسئلة الشائعة
              </h3>
            </div>
            <div className="divide-y divide-border">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-right hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-arabic text-sm font-semibold text-foreground flex-1 text-right">{item.q}</span>
                    {expandedFaq === i ? <ChevronUp size={15} className="text-muted-foreground flex-shrink-0 mr-2" /> : <ChevronDown size={15} className="text-muted-foreground flex-shrink-0 mr-2" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3">
                      <p className="font-arabic text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY SECTION ── */}
      {activeSection === 'privacy' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <Shield size={15} className="text-violet-600" />
              سياسة الخصوصية
            </h3>
            <div className="space-y-3 font-arabic text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">جمع البيانات واستخدامها</p>
              <p>نجمع المعلومات الضرورية لتشغيل الخدمة فقط، بما يشمل: بيانات الحساب، سجل الطلبات، وعناوين التوصيل. لا نشارك بياناتك مع أطراف ثالثة دون موافقتك.</p>
              <p className="font-semibold text-foreground">حماية البيانات</p>
              <p>تُشفَّر جميع البيانات الحساسة باستخدام معايير SSL/TLS. نطبق أفضل ممارسات الأمان لحماية معلوماتك.</p>
              <p className="font-semibold text-foreground">حقوقك</p>
              <p>يحق لك طلب الاطلاع على بياناتك، تعديلها، أو حذفها في أي وقت عبر التواصل مع فريق الدعم.</p>
              <p className="font-semibold text-foreground">ملفات تعريف الارتباط</p>
              <p>نستخدم ملفات الكوكيز لتحسين تجربتك وتذكر تفضيلاتك. يمكنك إدارتها من إعدادات متصفحك.</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <FileText size={15} className="text-violet-600" />
              شروط الاستخدام
            </h3>
            <div className="space-y-2 font-arabic text-sm text-muted-foreground leading-relaxed">
              <p>باستخدامك للمنصة، فإنك توافق على الالتزام بشروط الاستخدام المعمول بها. تشمل هذه الشروط:</p>
              <ul className="list-disc list-inside space-y-1 mr-2">
                <li>الاستخدام التجاري المشروع فقط</li>
                <li>عدم مشاركة بيانات الدخول مع الآخرين</li>
                <li>الالتزام بسياسات الطلب والإلغاء</li>
                <li>احترام حقوق الموردين والمنصة</li>
              </ul>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
            <Shield size={18} className="text-violet-500 flex-shrink-0 mt-0.5" />
            <div className="font-arabic">
              <p className="text-sm font-bold text-violet-800">آخر تحديث للسياسة</p>
              <p className="text-xs text-violet-600 mt-0.5">تم تحديث سياسة الخصوصية وشروط الاستخدام في أغسطس 2026.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showSignOutModal && <SignOutModal onClose={() => setShowSignOutModal(false)} onConfirm={handleLogout} />}
      {showDebtModal && <DebtPaymentModal onClose={() => setShowDebtModal(false)} role="retailer" />}
    </div>
  );
}
