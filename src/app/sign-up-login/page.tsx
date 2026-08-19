'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Building2, Truck, Lock, Phone, KeyRound, AlertCircle, MapPin, Building, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const roles = {
  supplier: { label: 'تجار الجملة', subtitle: 'المورد / الموزع', icon: Building2, description: 'إدارة المنتجات واستقبال طلبات المحلات.' },
  retailer: { label: 'محل / فرع', subtitle: 'صاحب المحل', icon: Store, description: 'طلب البضائع ومتابعة الشحنات.' },
  delivery: { label: 'مندوب التوصيل', subtitle: 'خدمات النقل', icon: Truck, description: 'توصيل الطلبات وتحديث حالات الشحن.' },
} as const;

type UserRole = keyof typeof roles;
type AuthMode = 'login' | 'signup';

const iraqProvinces = [
  'بغداد', 'البصرة', 'أنبار', 'بابل', 'دهوك', 'ديالى', 
  'ذي قار', 'السليمانية', 'صلاح الدين', 'كربلاء', 
  'كركوك', 'المثنى', 'ميسان', 'نجف', 'نينوى', 'واسط'
];

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, '');
}

// دالة مساعدة لإرسال التنبيه الأمني إلى الـ API الداخلي ومنه إلى تليجرام
async function sendTelegramAlert(title: string, message: string) {
  try {
    await fetch('/api/telegram-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message }),
    });
  } catch (e) {
    console.error('فشل إرسال تنبيه تليجرام:', e);
  }
}

export default function SecureAuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('supplier');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // حقول دخول المستخدمين العاديين
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // حقول إنشاء الحساب
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [province, setProvince] = useState('كربلاء');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // حقول دخول مدير النظام الأمني (الخطوة الأولى + الخطوة الثانية)
  const [adminIdentifier, setAdminIdentifier] = useState(''); 
  const [adminPassword, setAdminPassword] = useState('');     

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdminMode) {
        const cleanIdentifier = adminIdentifier.trim();
        const cleanAdminPass = adminPassword.trim();

        if (!cleanIdentifier) {
          throw new Error('يرجى إدخال بريد المدير، رقم الهاتف، أو المفتاح السري الشامل.');
        }

        // جلب البيانات المعتمدة من البيئة أو القيم الافتراضية
        const validAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@jumlaati.iq';
        const validAdminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || '07700000000';
        const validAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'AdminPass@2026#';
        const validAdminMasterKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'IQ-Admin-2026-Secure';

        // 1. خيار الدخول بالمفتاح السري الشامل
        if (cleanIdentifier === validAdminMasterKey) {
          await sendTelegramAlert('دخول ناجح (Master Key) 🟢', 'تم الدخول إلى لوحة المشرف العام عبر المفتاح السري الشامل.');
          router.push('/admin');
          return;
        }

        // 2. التحقق من الخطوة الثانية: كلمة المرور / رمز أمان المدير
        if (!cleanAdminPass) {
          await sendTelegramAlert('محاولة دخول إدارية ناقصة ⚠️', `تم إدخال المعرف (${cleanIdentifier}) دون كتابة رمز الأمان.`);
          throw new Error('رمز الأمان / كلمة مرور المدير مطلوبة للاستمرار.');
        }

        const isEmailOrPhoneValid = 
          cleanIdentifier.toLowerCase() === validAdminEmail.toLowerCase() ||
          normalizePhone(cleanIdentifier) === normalizePhone(validAdminPhone);

        const isPasswordValid = cleanAdminPass === validAdminPassword;

        if (!isEmailOrPhoneValid || !isPasswordValid) {
          // إرسال تنبيه فوري عند محاولة دخول فاشلة للمشرف
          await sendTelegramAlert('محاولة اختراق أو دخول فاشلة للأدمين ❌', `تم استخدام معرف: (${cleanIdentifier}) وكلمة مرور خاطئة.`);
          throw new Error('بيانات الدخول الإدارية أو رمز الأمان غير صحيح.');
        }

        // إرسال تنبيه نجاح الدخول الإداري
        await sendTelegramAlert('دخول ناجح للوحة المشرف العام 🟢', `تم تسجيل دخول المشرف بنجاح عبر المعرف: ${cleanIdentifier}`);
        router.push('/admin');
        return;
      }

      // الدخول العادي للمستخدمين بالهاتف العراقي
      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone || cleanPhone.length < 10 || !cleanPhone.startsWith('07')) {
        throw new Error('يرجى إدخال رقم هاتف محمول عراقي صحيح (يبدأ بـ 07).');
      }

      if (!password || password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.');
      }

      if (mode === 'signup') {
        if (!storeName.trim()) throw new Error('اسم الشركة أو المتجر مطلوب.');
        if (!ownerName.trim()) throw new Error('اسم صاحب النشاط مطلوب.');
        if (password !== confirmPassword) throw new Error('كلمتا المرور غير متطابقتين.');
        if (!agreeTerms) throw new Error('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.');
      }

      if (isSupabaseConfigured) {
        const pseudoEmail = `${cleanPhone}@jumlaati.iq`;
        if (mode === 'signup') {
          await signUp(pseudoEmail, password, { storeName, ownerName, province, role, phone: cleanPhone });
        } else {
          await signIn(pseudoEmail, password);
        }
      } else {
        throw new Error('قاعدة البيانات غير متصلة.');
      }

      if (role === 'supplier') router.push('/supplier-dashboard');
      else if (role === 'delivery') router.push('/delivery-dashboard');
      else router.push('/retailer-home');

    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 relative">
        
        {/* زر سري للتحويل إلى وضع أدمين النظام */}
        <button
          type="button"
          onClick={() => { setIsAdminMode(!isAdminMode); setError(''); }}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition font-arabic"
        >
          <KeyRound size={16} />
          {isAdminMode ? 'العودة للواجهة الرئيسية' : 'بوابة أمن المدير'}
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${isAdminMode ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'} mb-3`}>
            {isAdminMode ? <ShieldAlert size={24} /> : <Store size={24} />}
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">
            {isAdminMode ? 'بوابة دخول المشرف العام' : 'أهلاً بعودتك 👋'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-arabic">
            {isAdminMode ? 'منطقة آمنة: يتطلب معرف المدير ورقم الأمان الخاص والتنبيه الآلي' : 'سجل دخولك أو أنشئ حسابك التجاري لإدارة التوريد في العراق'}
          </p>
        </div>

        {!isAdminMode && (
          <>
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-700 mb-3 font-arabic flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                اختر نوع حسابك التجاري
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(roles) as UserRole[]).map((key) => {
                  const item = roles[key];
                  const Icon = item.icon;
                  const isActive = role === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setRole(key); setError(''); }}
                      className={`rounded-2xl border p-4 text-center transition flex flex-col items-center gap-2 ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-950 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold font-arabic">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-arabic mt-0.5">{item.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition font-arabic ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition font-arabic ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                إنشاء حساب جديد
              </button>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 font-arabic text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isAdminMode ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-arabic">1. معرف المدير (الإيميل أو الهاتف أو Master Key)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="admin@jumlaati.iq أو 0770..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-arabic">2. رمز الأمان / كلمة مرور المشرف (Admin PIN)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          ) : mode === 'signup' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-arabic">اسم الشركة / المتجر *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    <Building size={16} />
                  </span>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: مستودع النور للمواد الغذائية"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white font-arabic transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-arabic">اسم صاحب النشاط *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="الاسم الثلاثي أو اللقب"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white font-arabic transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-arabic">المحافظة العراقية *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                      <MapPin size={16} />
                    </span>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white font-arabic transition"
                    >
                      {iraqProvinces.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 font-arabic">رقم الهاتف العراقي (للتواصل والدخول) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07701234567"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-arabic">كلمة المرور *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-arabic">تأكيد كلمة المرور *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 font-arabic">
                  أوافق على <span className="text-emerald-600 font-bold">شروط الاستخدام وسياسة الخصوصية</span> لمنصة جُمْلَتِي
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-arabic">رقم الهاتف العراقي</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07701234567"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-arabic">كلمة المرور</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center
