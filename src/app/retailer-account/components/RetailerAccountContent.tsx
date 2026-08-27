'use client';
import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Save, CheckCircle, MapPin, Plus, Trash2, CreditCard, Building2, Bell, Shield, Star, X, LogOut, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DebtPaymentModal from '@/components/ui/DebtPaymentModal';

interface Address {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  label: string;
  last4?: string;
  bank?: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  { id: 'addr-1', label: 'المتجر الرئيسي', city: 'بغداد', district: 'الكرادة', street: 'شارع أبو نواس، بناية 14', isDefault: true },
  { id: 'addr-2', label: 'المستودع', city: 'بغداد', district: 'الشعب', street: 'شارع المصنع، مجمع 7', isDefault: false },
];

const initialPayments: PaymentMethod[] = [
  { id: 'pay-1', type: 'card', label: 'Visa', last4: '4242', isDefault: true },
  { id: 'pay-2', type: 'bank', label: 'مصرف الرافدين', bank: 'حساب جاري', isDefault: false },
];

type Tab = 'profile' | 'addresses' | 'payments' | 'settings';

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

// ── Financial Debt Modal — replaced by shared DebtPaymentModal ───────────────

export default function RetailerAccountContent() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showDebt, setShowDebt] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    storeName: 'متجر الجبوري للمواد الغذائية',
    ownerName: 'أحمد الجبوري',
    phone: '07701234567',
    email: 'ahmed@jabouri-store.iq',
    city: 'بغداد',
    category: 'مواد غذائية',
  });

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', city: '', district: '', street: '' });

  // Payments state
  const [payments, setPayments] = useState<PaymentMethod[]>(initialPayments);

  // Settings state
  const [notifications, setNotifications] = useState({
    newOrders: true,
    deliveryUpdates: true,
    promotions: false,
    weeklyReport: true,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    setShowSignOut(false);
    try { await signOut(); } catch { /* silent */ }
    router.push('/sign-up-login');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const addAddress = () => {
    if (!newAddress.label || !newAddress.city) return;
    setAddresses((prev) => [
      ...prev,
      { id: `addr-${Date.now()}`, ...newAddress, isDefault: false },
    ]);
    setNewAddress({ label: '', city: '', district: '', street: '' });
    setShowAddressForm(false);
  };

  const setDefaultPayment = (id: string) => {
    setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  };

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'الملف التجاري', icon: Building2 },
    { id: 'addresses', label: 'عناوين التوصيل', icon: MapPin },
    { id: 'payments', label: 'طرق الدفع', icon: CreditCard },
    { id: 'settings', label: 'إعدادات الحساب', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">حساب التاجر</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">إدارة ملف متجرك وعناوين التوصيل وطرق الدفع</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Financial Debt Button */}
          <button
            onClick={() => setShowDebt(true)}
            className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-arabic font-semibold px-3 py-2 rounded-xl hover:bg-red-100 active:scale-95 transition-all"
          >
            <DollarSign size={14} />
            الديون
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

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 border border-border rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-arabic font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-card text-accent shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
              }`}
            >
              <TabIcon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 size={16} className="text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">معلومات المتجر</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'اسم المتجر', key: 'storeName', icon: Building2, type: 'text' },
              { label: 'اسم المالك', key: 'ownerName', icon: User, type: 'text' },
              { label: 'رقم الهاتف', key: 'phone', icon: Phone, type: 'tel' },
              { label: 'البريد الإلكتروني', key: 'email', icon: Mail, type: 'email' },
              { label: 'المدينة', key: 'city', icon: MapPin, type: 'text' },
              { label: 'فئة المتجر', key: 'category', icon: Building2, type: 'text' },
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
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-arabic font-semibold transition-all ${
              saved ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
          </button>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <h2 className="text-base font-bold text-foreground font-arabic">عناوين التوصيل</h2>
            </div>
            <button
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-1.5 bg-accent text-white text-sm font-arabic font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus size={15} />
              إضافة عنوان
            </button>
          </div>

          {/* Address cards */}
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-card border rounded-xl p-4 flex items-start gap-4 ${
                  addr.isDefault ? 'border-accent/40 bg-accent/5' : 'border-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  addr.isDefault ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground font-arabic">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent font-arabic font-semibold px-2 py-0.5 rounded-full">
                        <Star size={10} fill="currentColor" />
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-arabic mt-0.5">{addr.city}، {addr.district}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{addr.street}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs text-accent font-arabic font-semibold hover:underline"
                    >
                      تعيين افتراضي
                    </button>
                  )}
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add address form */}
          {showAddressForm && (
            <div className="bg-card border border-accent/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground font-arabic">عنوان جديد</h3>
                <button onClick={() => setShowAddressForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'تسمية العنوان', key: 'label', placeholder: 'مثال: المتجر الرئيسي' },
                  { label: 'المدينة', key: 'city', placeholder: 'بغداد' },
                  { label: 'الحي / المنطقة', key: 'district', placeholder: 'الكرادة' },
                  { label: 'الشارع والتفاصيل', key: 'street', placeholder: 'شارع ...' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={newAddress[f.key as keyof typeof newAddress]}
                      onChange={(e) => setNewAddress((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addAddress}
                  className="flex items-center gap-1.5 bg-accent text-white text-sm font-arabic font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Plus size={15} />
                  إضافة
                </button>
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="text-sm font-arabic text-muted-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CreditCard size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">طرق الدفع المحفوظة</h2>
          </div>

          <div className="space-y-3">
            {payments.map((pm) => (
              <div
                key={pm.id}
                className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${
                  pm.isDefault ? 'border-emerald-400/40 bg-emerald-50/40' : 'border-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  pm.type === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {pm.type === 'card' ? <CreditCard size={18} /> : <Building2 size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground font-arabic">{pm.label}</p>
                    {pm.isDefault && (
                      <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 font-arabic font-semibold px-2 py-0.5 rounded-full">
                        <Star size={10} fill="currentColor" />
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    {pm.type === 'card' ? `•••• •••• •••• ${pm.last4}` : pm.bank}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!pm.isDefault && (
                    <button
                      onClick={() => setDefaultPayment(pm.id)}
                      className="text-xs text-emerald-600 font-arabic font-semibold hover:underline"
                    >
                      تعيين افتراضي
                    </button>
                  )}
                  <button
                    onClick={() => removePayment(pm.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <CreditCard size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="font-arabic">
              <p className="text-sm font-semibold text-blue-800">إضافة بطاقة جديدة</p>
              <p className="text-xs text-blue-600 mt-0.5">يمكنك إضافة بطاقة ائتمانية أو مدينة جديدة عند إتمام طلبك التالي من صفحة الدفع.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5">
          {/* Account info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Lock size={16} className="text-violet-600" />
              </div>
              <h2 className="text-base font-bold text-foreground font-arabic">الأمان وكلمة المرور</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">كلمة المرور الحالية</label>
                <div className="relative">
                  <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="اتركها فارغة إذا لم تريد التغيير"
                    className="w-full pr-9 pl-4 py-2.5 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
            </div>

            {/* 2FA toggle */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="font-arabic">
                <p className="text-sm font-semibold text-foreground">التحقق بخطوتين</p>
                <p className="text-xs text-muted-foreground mt-0.5">حماية إضافية لحسابك عبر رمز SMS</p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative w-11 h-6 rounded-full transition-colors ${twoFactor ? 'bg-accent' : 'bg-muted'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-arabic font-semibold transition-all ${
                saved ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {saved ? <CheckCircle size={16} /> : <Save size={16} />}
              {saved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Bell size={16} className="text-amber-600" />
              </div>
              <h2 className="text-base font-bold text-foreground font-arabic">إعدادات الإشعارات</h2>
            </div>

            <div className="space-y-3">
              {[
                { key: 'newOrders', label: 'إشعارات الطلبات الجديدة', desc: 'عند استلام طلب جديد من عميل' },
                { key: 'deliveryUpdates', label: 'تحديثات التوصيل', desc: 'تتبع حالة توصيل طلباتك' },
                { key: 'promotions', label: 'العروض والتخفيضات', desc: 'عروض الموردين والمنصة' },
                { key: 'weeklyReport', label: 'التقرير الأسبوعي', desc: 'ملخص أداء متجرك كل أسبوع' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="font-arabic">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-red-700 font-arabic">منطقة الخطر</h2>
            <p className="text-xs text-red-600 font-arabic">حذف الحساب نهائي ولا يمكن التراجع عنه. سيتم حذف جميع بياناتك وطلباتك.</p>
            <div className="flex gap-2 flex-wrap">
              <button className="text-sm font-arabic font-semibold text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                حذف الحساب نهائياً
              </button>
              <button
                onClick={() => setShowSignOut(true)}
                className="flex items-center gap-1.5 text-sm font-arabic font-semibold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition-all"
              >
                <LogOut size={14} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} onConfirm={handleSignOut} />}
      {showDebt && <DebtPaymentModal onClose={() => setShowDebt(false)} role="retailer" />}
    </div>
  );
}
