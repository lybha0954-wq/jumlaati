"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Building2, KeyRound, Info, Lock, Mail, Phone, ShieldCheck, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { isSupabaseConfigured } from '@/lib/supabase/client';



const roles = {
  retailer: { label: 'حساب الفرع', icon: Store, description: 'تسجيل الدخول كبائع تجزئة باستخدام البريد الإلكتروني أو رقم الهاتف العراقي.' },
  supplier: { label: 'حساب المورد', icon: Building2, description: 'تسجيل الدخول كمورد لمتابعة الطلبات والمخزون.' },
  admin: { label: 'حساب المدير', icon: ShieldCheck, description: 'دخول المدير عبر مفتاح وصول آمن للمسارات الإدارية.' },
} as const;

type AuthRole = keyof typeof roles;

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, '');
}

function isPhoneInput(value: string) {
  const digits = normalizePhone(value);
  return /^07[0-9]{8,9}$/.test(digits);
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [role, setRole] = useState<AuthRole>('retailer');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const credentialLabel = role === 'admin' ? 'مفتاح الدخول' : 'البريد الإلكتروني أو رقم الهاتف';
  const credentialPlaceholder =
    role === 'admin' ? 'أدخل مفتاح الدخول الآمن' : 'مثال: 07701234567 أو hussam@jumlaati.iq';

  const handleRoleChange = (selected: AuthRole) => {
    setRole(selected);
    setCredential('');
    setPassword('');
    setAccessKey('');
    setError('');
  };

  const handleDemoFill = (selected: AuthRole) => {
    handleRoleChange(selected);
    const demo = DEMO_CREDENTIALS[selected] as { email: string; phone: string; password: string } | { accessKey: string };

    if (selected === 'admin') {
      setAccessKey((demo as { accessKey: string }).accessKey);
      return;
    }

    const nonAdminDemo = demo as { email: string; phone: string; password: string };
    setCredential(nonAdminDemo.email);
    setPassword(nonAdminDemo.password);
    setAccessKey('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'admin') {
        if (!accessKey.trim()) {
          throw new Error('مفتاح الدخول مطلوب.');
        }

        if (accessKey.trim() !== DEMO_CREDENTIALS.admin.accessKey) {
          throw new Error('مفتاح الدخول غير صالح أو غير مصرح به.');
        }

        router.push('/admin-hub');
        return;
      }

      const input = credential.trim();
      if (!input) {
        throw new Error('البريد الإلكتروني أو رقم الهاتف مطلوب.');
      }

      if (!password) {
        throw new Error('كلمة المرور مطلوبة.');
      }

      const usePhone = isPhoneInput(input);
      const loginEmail = usePhone ? DEMO_CREDENTIALS[role].email : input;
      const loginPassword = password;
      const demoMatch =
        loginEmail === DEMO_CREDENTIALS[role].email && loginPassword === DEMO_CREDENTIALS[role].password;
      const phoneMatch = usePhone && normalizePhone(input) === normalizePhone(DEMO_CREDENTIALS[role].phone) && loginPassword === DEMO_CREDENTIALS[role].password;

      if (isSupabaseConfigured()) {
        await signIn(loginEmail, loginPassword);
      } else if (!demoMatch && !phoneMatch) {
        throw new Error('بيانات الدخول غير صحيحة. استخدم بيانات العرض التجريبي أو سجل بحساب صالح.');
      }

      router.push(role === 'supplier' ? '/supplier-dashboard' : '/retailer-home');
    } catch (caught: any) {
      setError(caught?.message || 'حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-8 px-4" dir="rtl">
      <div className="grid w-full max-w-6xl gap-8 xl:grid-cols-[420px_minmax(420px,1fr)]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-300">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white font-arabic">أمن بيانات جُمْلَتِي</h1>
              <p className="mt-1 text-sm text-slate-400 font-arabic">مصمم لبيئة التجارة العراقية ودعم تسعير IQD.</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-slate-300 font-arabic leading-7">
            <p>هذا النموذج يدعم الدخول كالتالي:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>الفرع / التاجر: بريد إلكتروني أو رقم هاتف عراقي يبدأ بـ 077 أو 078.</li>
              <li>المورد: بريد إلكتروني أو رقم هاتف لإدارة الطلبات والمخزون.</li>
              <li>المدير: مفتاح وصول آمن لإدارة منصة جُمْلَتِي.</li>
            </ul>
            <p>الأسعار والجلسات في المنصة مدعومة بالعملة المحلية <strong>الدينار العراقي (IQD)</strong>.</p>
            <p>باستخدامك للخدمة، أنت توافق على سياسة الخصوصية وقوانين التجارة العراقية المرتبطة بالتعامل الإلكتروني.</p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300 font-arabic">
            <div className="flex items-center gap-2 mb-3 text-slate-100">
              <Info size={16} />
              <p className="font-semibold">ملاحظة تنظيمية</p>
            </div>
            <p className="leading-6">يُرجى الحفاظ على بيانات الدخول الخاصة بك وعدم مشاركة مفتاح المدير. نوصي باستخدام بيانات الحساب التجريبي فقط للعرض والتجربة.</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-300 tracking-widest font-arabic">تسجيل دخول</p>
              <h2 className="mt-2 text-3xl font-black text-white font-arabic">حدد نوع الحساب للبدء</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(roles) as AuthRole[]).map((item) => {
                const meta = roles[item];
                const isActive = item === role;
                const RoleIcon = meta.icon;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleRoleChange(item)}
                    className={`rounded-3xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-emerald-500/70 bg-emerald-500/10 text-white shadow-lg'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-emerald-300">
                        <RoleIcon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-bold font-arabic">{meta.label}</p>
                        <p className="text-xs text-slate-400 font-arabic">{meta.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-100 font-arabic text-sm flex items-start gap-3">
                <AlertCircle size={18} />
                <div>
                  <p className="font-semibold">حدث خطأ</p>
                  <p className="mt-1 text-slate-100">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-100 font-arabic">{credentialLabel}</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-slate-500">
                  {role === 'admin' ? <KeyRound size={18} /> : isPhoneInput(credential) ? <Phone size={18} /> : <Mail size={18} />}
                </span>
                <input
                  type="text"
                  value={role === 'admin' ? accessKey : credential}
                  onChange={(event) => (role === 'admin' ? setAccessKey(event.target.value) : setCredential(event.target.value))}
                  placeholder={credentialPlaceholder}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60"
                  dir="ltr"
                  autoComplete={role === 'admin' ? 'off' : 'username'}
                />
              </div>
            </div>

            {role !== 'admin' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-100 font-arabic">كلمة المرور</label>
                  <span className="text-xs text-slate-500 font-arabic">6 أحرف على الأقل</span>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-slate-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60"
                    autoComplete="current-password"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'جاري تسجيل الدخول...' : role === 'admin' ? 'دخول المدير' : 'دخول المنصة'}
            </button>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-300 text-sm font-arabic">
              <p className="font-semibold text-slate-100">بيانات تجريبية</p>
              <p className="mt-2 leading-6">استخدم أي من الحسابات التالية لتجربة الدخول بسرعة.</p>
              <div className="mt-4 grid gap-3">
                {(['retailer', 'supplier', 'admin'] as AuthRole[]).map((demoRole) => {
                  const demo = DEMO_CREDENTIALS[demoRole];
                  const isAdmin = demoRole === 'admin';
                  return (
                    <button
                      key={demoRole}
                      type="button"
                      onClick={() => handleDemoFill(demoRole)}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-xs hover:border-emerald-500/40 transition"
                    >
                      <span className="font-semibold text-slate-100 font-arabic">{roles[demoRole].label}</span>
                      <span className="text-slate-400 font-arabic" dir="ltr">
                        {isAdmin
                          ? `مفتاح: ${(demo as { accessKey: string }).accessKey}`
                          : (demo as { email: string }).email}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export type { };
