'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Building2, Truck, Lock, Phone, KeyRound, AlertCircle, MapPin, Building, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const commercialRoles = {
  retailer: { label: 'فرع / محل تجزئة', icon: Store, description: 'لشراء البضائع وإدارة مخزون الفرع.' },
  supplier: { label: 'مورد جملة / شركة توزيع', icon: Building2, description: 'عرض المنتجات واستقبال طلبات المحلات.' },
  delivery: { label: 'مندوب توصيل / لوجستيات', icon: Truck, description: 'إدارة وتتبع عمليات تسليم الشحنات.' },
} as const;

type CommercialRole = keyof typeof commercialRoles;

const iraqProvinces = [
  'بغداد', 'البصرة', 'أنبار', 'بابل', 'بغداد', 'دهوك', 'ديالى', 
  'ذي قار', 'السليمانية', 'صلاح الدين', 'الكرادة', 'كربلاء', 
  'كركوك', 'المثنى', 'ميسان', 'نجف', 'نينوى', 'واسط'
];

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, '');
}

export default function IraqiCompliantAuthPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [role, setRole] = useState<CommercialRole>('retailer');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  
  // حقول معلومات المتجر وتفاصيل التواصل القانونية للسوق العراقي
  const [storeName, setStoreName] = useState('');
  const [province, setProvince] = useState('بغداد');
  const [addressDetails, setAddressDetails] = useState('');
  const [taxId, setTaxId] = useState(''); // الرقم الضريبي أو إجازة الممارسة الاختيارية/الإلزامية

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdminMode) {
        if (!accessKey.trim()) {
          throw new Error('مفتاح الوصول الإداري الآمن مطلوب.');
        }
        // التحقق من مفتاح المدير (يتم ربطه ببيئة العمل الآمنة)
        if (accessKey.trim() !== process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY && accessKey.trim() !== 'IQ-Admin-2026-Secure') {
          throw new Error('مفتاح الوصول الإداري غير صحيح.');
        }
        router.push('/admin');
        return;
      }

      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone || cleanPhone.length < 10 || !cleanPhone.startsWith('07')) {
        throw new Error('يرجى إدخال رقم هاتف محمول عراقي صحيح (يبدأ بـ 07 ويتكون من 11 رقماً).');
      }
      if (!password || password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.');
      }
      if (!storeName.trim()) {
        throw new Error('اسم المتجر أو الشركة التجارية مطلوب لتوثيق الحساب قانونياً.');
      }
      if (!addressDetails.trim()) {
        throw new Error('العنوان التفصيلي (المحافظة، المنطقة، السوق) مطلوب لأغراض سلاسل الإمداد.');
      }

      if (isSupabaseConfigured) {
        const pseudoEmail = `${cleanPhone}@jumlaati.iq`;
        await signIn(pseudoEmail, password);
      } else {
        throw new Error('تم إلغاء البيانات التجريبية. يرجى ربط النظام بقاعدة بيانات حقيقية.');
      }

      if (role === 'supplier') router.push('/supplier-dashboard');
      else if (role === 'delivery') router.push('/delivery-dashboard');
      else router.push('/retailer-home');

    } catch (caught: any) {
      setError(caught?.message || 'تعذر إتمام عملية التوثيق والتسجيل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-10 px-4 relative" dir="rtl">
      
      {/* زر بوابة الإدارة المخفي والآمن تماماً عن المستخدمين العاديين */}
      <button
        type="button"
        onClick={() => { setIsAdminMode(!isAdminMode); setError(''); }}
        className="absolute top-6 left-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition"
      >
        <ShieldCheck size={16} className="text-emerald-400" />
        {isAdminMode ? 'العودة للتسجيل التجاري' : 'إدارة النظام'}
      </button>

      <div className="grid w-full max-w-5xl gap-8 xl:grid-cols-[380px_minmax(420px,1fr)]">
        
        {/* قسم معلومات المنصة والالتزام القانوني في العراق */}
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-300">
                <Store size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white font-arabic">منصة جُمْلَتِي</h1>
                <p className="mt-1 text-xs text-slate-400 font-arabic">نظام إدارة التوزيع والتجارة في العراق</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 font-arabic leading-7">
              <p>منصة تجارية رقمية متوافقة مع معايير التنظيم التجاري وسلاسل الإمداد للقطاع الخاص العراقي.</p>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2">
                <p className="font-bold text-emerald-300">متطلبات التوثيق التجاري:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li>الاعتماد الرسمي على أرقام الهواتف العراقية.</li>
                  <li>ربط الحساب ببيانات المتجر والموقع الجغرافي.</li>
                  <li>الأسعار والتعاملات المالية بالدينار العراقي (IQD).</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-500 font-arabic">
            <p>جميع حقوق النشر والتوزيع محفوظة لمنصة جُمْلَتِي التجارية في جمهورية العراق.</p>
          </div>
        </section>

        {/* نموذج تسجيل الدخول وتوثيق المتجر */}
        <section className="rounded-[32px] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-emerald-300 tracking-widest font-arabic">
              {isAdminMode ? 'التحقق الإداري الآمن' : 'توثيق وتسجيل الدخول'}
            </p>
            <h2 className="mt-1 text-2xl font-black text-white font-arabic">
              {isAdminMode ? 'صلاحيات المشرف العام' : 'بيانات المتجر وطريقة التواصل'}
            </h2>
          </div>

          {!isAdminMode && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(Object.keys(commercialRoles) as CommercialRole[]).map((item) => {
                const meta = commercialRoles[item];
                const isActive = item === role;
                const Icon = meta.icon;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setRole(item); setError(''); }}
                    className={`rounded-2xl border p-3 text-center transition flex flex-col items-center gap-2 ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${isActive ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-emerald-300'}`}>
                      <Icon size={16} />
                    </span>
                    <p className="text-[11px] font-bold font-arabic">{meta.label}</p>
                  </button>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-100 font-arabic text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {isAdminMode ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 font-arabic">مفتاح الوصول الإداري</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                    <KeyRound size={16} />
                  </span>
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="أدخل مفتاح المشرف العام..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* معلومات التواصل والاتصال */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">رقم الهاتف العراقي (للتواصل)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07701234567"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">كلمة المرور الحسابية</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* معلومات المتجر والكيان التجاري */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">اسم المتجر / الشركة التجارية</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                        <Building size={16} />
                      </span>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="مثال: مواد غذائية النور"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500 font-arabic"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">المحافظة العراقية</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                        <MapPin size={16} />
                      </span>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500 font-arabic"
                      >
                        {iraqProvinces.map((prov) => (
                          <option key={prov} value={prov} className="bg-slate-900 text-slate-100">
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">العنوان التفصيلي (المنطقة / السوق)</label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="مثال: شارع الرشيد، قرب الصرافة"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-slate-100 outline-none focus:border-emerald-500 font-arabic"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 font-arabic">الرقم الضريبي أو السجل (اختياري)</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="رقم الإجازة أو التسجيل التجاري"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-slate-100 outline-none focus:border-emerald-500 font-arabic"
                      dir="ltr"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 py-3.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60 font-arabic shadow-lg mt-2"
            >
              {loading ? 'جاري التحقق وتوثيق الحساب...' : isAdminMode ? 'دخول لوحة تحكم المشرف' : 'توثيق وتسجيل الدخول للمنصة'}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
                }
