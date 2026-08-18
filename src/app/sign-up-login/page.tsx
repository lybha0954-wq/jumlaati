'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Store, Building2, Truck, Lock, Phone, KeyRound, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const roles = {
  retailer: { label: 'محل / فرع تجزئة', icon: Store, description: 'تسجيل الدخول برقم الهاتف لطلب البضائع والمتابعة.' },
  supplier: { label: 'مورد جملة', icon: Building2, description: 'إدارة المخزون، المنتجات، والطلبات الواردة.' },
  delivery: { label: 'مندوب توصيل', icon: Truck, description: 'متابعة الشحنات وتحديث حالات تسليم الطلبات.' },
  admin: { label: 'مدير النظام', icon: ShieldCheck, description: 'إدارة المنصة بالكامل عبر مفتاح وصول آمن.' },
} as const;

type AuthRole = keyof typeof roles;

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, '');
}

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [role, setRole] = useState<AuthRole>('retailer');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (selected: AuthRole) => {
    setRole(selected);
    setPhone('');
    setPassword('');
    setAccessKey('');
    setError('');
  };

  const handleDemoFill = (selected: AuthRole) => {
    handleRoleChange(selected);
    const demo = DEMO_CREDENTIALS[selected] as any;
    if (selected === 'admin') {
      setAccessKey(demo.accessKey || '');
    } else {
      setPhone(demo.phone || '07701234567');
      setPassword(demo.password || '123456');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'admin') {
        if (!accessKey.trim()) {
          throw new Error('مفتاح الدخول الآمن مطلوب.');
        }
        if (accessKey.trim() !== (DEMO_CREDENTIALS.admin as any).accessKey) {
          throw new Error('مفتاح الدخول غير صالح.');
        }
        router.push('/admin-hub');
        return;
      }

      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error('يرجى إدخال رقم هاتف عراقي صحيح (يبدأ بـ 07).');
      }

      if (!password) {
        throw new Error('كلمة المرور مطلوبة.');
      }

      // في حال عدم ربط Supabase أو مطابقة التجريبي
      const demoData = (DEMO_CREDENTIALS as any)[role];
      const isDemoMatch = normalizePhone(demoData?.phone || '') === cleanPhone && password === demoData?.password;

      if (isSupabaseConfigured) {
        // إذا كان النظام مربوطاً بـ Supabase، نقوم بالتحويل الداخلي برقم الهاتف (كمعامل بريدي افتراضي للمنظومة)
        const pseudoEmail = `${cleanPhone}@jumlaati.iq`;
        await signIn(pseudoEmail, password);
      } else if (!isDemoMatch) {
        throw new Error('بيانات الدخول غير صحيحة. استخدم بيانات العرض التجريبي.');
      }

      // توجيه المستخدم حسب دوره الجديد
      if (role === 'supplier') router.push('/supplier-dashboard');
      else if (role === 'delivery') router.push('/delivery-dashboard');
      else router.push('/retailer-home');

    } catch (caught: any) {
      setError(caught?.message || 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-8 px-4" dir="rtl">
      <div className="grid w-full max-w-6xl gap-8 xl:grid-cols-[400px_minmax(420px,1fr)]">
        
        {/* معلومات المنصة الجانبية */}
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-300">
                <Store size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white font-arabic">منصة جُمْلَتِي</h1>
                <p className="mt-1 text-xs text-slate-400 font-arabic">إدارة التوزيع وسلاسل الإمداد في العراق</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300 font-arabic leading-7">
              <p>بوابة موحدة وآمنة تتيح لك اختيار دورك في النظام فوراً:</p>
              <ul className="space-y-2 list-disc list-inside text-xs text-slate-400">
                <li>تسجيل الدخول برقم الهاتف العراقي حصراً.</li>
                <li>فصل الصلاحيات بين محلات التجزئة وموردين الجملة ومناديب التوصيل.</li>
                <li>دخول إداري خاص عبر مفتاح الأمان حصراً.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-400 font-arabic">
            <p className="font-semibold text-slate-200 mb-1">العملة والأسعار</p>
            <p>جميع المعاملات والتقارير المالية مسعرة بالدينار العراقي (IQD).</p>
          </div>
        </section>

        {/* نموذج تسجيل الدخول */}
        <section className="rounded-[32px] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-emerald-300 tracking-widest font-arabic">تسجيل الدخول الموحد</p>
            <h2 className="mt-1 text-2xl font-black text-white font-arabic">اختر نوع الحساب</h2>
          </div>

          {/* محدد الأدوار الأربعة */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(Object.keys(roles) as AuthRole[]).map((item) => {
              const meta = roles[item];
              const isActive = item === role;
              const Icon = meta.icon;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleRoleChange(item)}
                  className={`rounded-2xl border p-3 text-right transition flex items-center gap-3 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isActive ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-emerald-300'}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold font-arabic truncate">{meta.label}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-100 font-arabic text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {role === 'admin' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 font-arabic">مفتاح الدخول الآمن للادارة</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 grid place-items-center text-slate-500">
                    <KeyRound size={16} />
                  </span>
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="أدخل مفتاح المدير..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-xs text-slate-100 outline-none focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 font-arabic">رقم الهاتف العراقي</label>
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
                  <label className="text-xs font-semibold text-slate-200 font-arabic">كلمة المرور</label>
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
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? 'جاري التحقق...' : role === 'admin' ? 'دخول لوحة المدير' : 'تسجيل الدخول'}
            </button>

            {/* أزرار التجربة السريعة */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 font-arabic mb-2">تجربة سريعة للحسابات:</p>
              <div className="grid grid-cols-2 gap-2">
                {(['retailer', 'supplier', 'delivery', 'admin'] as AuthRole[]).map((demoRole) => (
                  <button
                    key={demoRole}
                    type="button"
                    onClick={() => handleDemoFill(demoRole)}
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-right text-[11px] text-slate-300 hover:bg-slate-800 transition"
                  >
                    <span className="font-bold block text-emerald-400">{roles[demoRole].label}</span>
                  </button>
                ))}
              </div>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
                    }
