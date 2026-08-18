'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Building2, Truck, Lock, Phone, KeyRound, AlertCircle, MapPin, Building, User } from 'lucide-react';
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

export default function CleanAuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('supplier');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // حقول الدخول
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // حقول إنشاء الحساب (برقم الهاتف حصراً بدون بريد إلكتروني)
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [province, setProvince] = useState('بغداد');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // حقول دخول مدير النظام (Admin)
  const [adminAccessKey, setAdminAccessKey] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdminMode) {
        if (!adminAccessKey.trim()) {
          throw new Error('مفتاح الوصول الخاص بمدير النظام مطلوب.');
        }
        // التحقق من مفتاح المدير (يمكن ربطه بمتغيرات البيئة أو مفتاح معتمد)
        if (adminAccessKey.trim() !== process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY && adminAccessKey.trim() !== 'IQ-Admin-2026-Secure') {
          throw new Error('مفتاح مدير النظام غير صحيح.');
        }
        router.push('/admin');
        return;
      }

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
        // توليد معرف بريد إلكتروني داخلي آمن يعتمد كلياً على رقم الهاتف العراقي
        const pseudoEmail = `${cleanPhone}@jumlaati.iq`;
        if (mode === 'signup') {
          await signUp(pseudoEmail, password, { storeName, ownerName, province, role, phone: cleanPhone });
        } else {
          await signIn(pseudoEmail, password);
        }
      } else {
        throw new Error('قاعدة البيانات غير متصلة. يرجى ربط النظام بقاعدة بيانات حقيقية.');
      }

      // التوجيه المباشر حسب دور المستخدم التجاري
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
        
        {/* زر سري/تبديل للتحويل إلى وضع مدير النظام */}
        <button
          type="button"
          onClick={() => { setIsAdminMode(!isAdminMode); setError(''); }}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition font-arabic"
        >
          <KeyRound size={16} />
          {isAdminMode ? 'العودة للواجهة الرئيسية' : 'تسجيل دخول المدير'}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">
            {isAdminMode ? 'لوحة تحكم مدير النظام' : 'أهلاً بعودتك 👋'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-arabic">
            {isAdminMode ? 'أدخل مفتاح الصلاحيات الإدارية المطلقة للمنصة' : 'سجل دخولك أو أنشئ حسابك التجاري لإدارة التوريد في العراق'}
          </p>
        </div>

        {!isAdminMode && (
          <>
            {/* اختيار الأدوار الفعلية للمنصة */}
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

            {/* أزرار التبديل بين تسجيل الدخول وإنشاء حساب */}
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 font-arabic">مفتاح الوصول الآمن للمدير</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  value={adminAccessKey}
                  onChange={(e) => setAdminAccessKey(e.target.value)}
                  placeholder="أدخل مفتاح الإدارة..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                  dir="ltr"
                />
              </div>
            </div>
          ) : mode === 'signup' ? (
            <>
              {/* تفاصيل المنشأة عند إنشاء الحساب */}
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
              {/* تسجيل الدخول العادي */}
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
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60 font-arabic shadow-md mt-4"
          >
            {loading ? 'جاري المعالجة...' : isAdminMode ? 'دخول لوحة تحكم المدير' : mode === 'signup' ? 'إنشاء الحساب التجاري' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 font-arabic">
            منصة جُمْلَتِي لتجارة الجملة وسلاسل الإمداد في العراق • جميع المعاملات بالدينار العراقي (IQD).
          </p>
        </div>

      </div>
    </div>
  );
                }
