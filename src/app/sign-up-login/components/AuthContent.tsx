'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import RoleSelector from './RoleSelector';
import AppLogo from '@/components/ui/AppLogo';
import { ShoppingBag, Truck, PackageCheck, Lock } from 'lucide-react';

export type UserRole = 'retailer' | 'supplier' | 'delivery' | 'admin';
export type AuthMode = 'login' | 'signup';

const roleLabels: Record<UserRole, string> = {
  retailer: 'صاحب محل / سوبر ماركت',
  supplier: 'مجهز / جملة',
  delivery: 'سائق توصيل',
  admin: 'مدير النظام', // لن يظهر أبداً
};

const roleIcons: Record<UserRole, React.ElementType> = {
  retailer: ShoppingBag,
  supplier: Truck,
  delivery: PackageCheck,
  admin: ShoppingBag,
};

const roleDescriptions: Record<UserRole, string> = {
  retailer: 'اطلب بضاعتك من الموردين بسهولة',
  supplier: 'أدر طلباتك ومخزونك بكفاءة',
  delivery: 'انقل البضائع بسرعة وأمان',
  admin: 'إدارة المنصة',
};

const roleFeatures: Record<UserRole, string[]> = {
  supplier: ['استقبل الطلبات وأدرها بلحظة', 'راقب مخزونك وتنبيهات النفاد', 'تتبع إيراداتك اليومية'],
  retailer: ['قارن أسعار الموردين بضغطة', 'اطلب بضاعتك بدون مكالمات', 'ادفع كاش أو آجل حسب اتفاقك'],
  delivery: ['استقبل طلبات التوصيل فوراً', 'حدد حالة التسليم لحظة بلحظة', 'تابع أرباحك اليومية'],
  admin: [],
};

export default function AuthContent() {
  const [role, setRole] = useState<UserRole>('supplier');
  const [mode, setMode] = useState<AuthMode>('login');
  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex" dir="rtl">
      {/* Left: Brand panel - ألوان متدرجة جذابة */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        {/* خلفية متدرجة وجمالية */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={48} />
          <div>
            <span className="font-arabic font-extrabold text-white text-3xl">جُمْلَتِي</span>
            <p className="text-white/70 text-sm font-arabic">منصة التوريد الذكية</p>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <RoleIcon size={56} className="text-white" />
          </div>
          <h2 className="font-arabic font-extrabold text-4xl text-white mb-4">{roleLabels[role]}</h2>
          <p className="font-arabic text-white/80 text-lg leading-relaxed max-w-sm mx-auto">
            {roleDescriptions[role]}
          </p>
          <div className="mt-10 space-y-4 text-right max-w-sm mx-auto bg-white/10 p-6 rounded-2xl backdrop-blur-md">
            {roleFeatures[role].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">✓</span>
                </span>
                <span className="font-arabic text-white text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center">
          <p className="font-arabic text-white/50 text-xs">© 2026 جُمْلَتِي</p>
        </div>
      </div>

      {/* Right: Auth form - خلفية بيضاء نظيفة */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 bg-background">
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <AppLogo size={36} />
            <span className="font-arabic font-bold text-primary text-2xl">جُمْلَتِي</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="font-arabic font-extrabold text-3xl text-foreground">
              {mode === 'login' ? 'أهلاً بعودتك 👋' : 'انضم إلينا الآن'}
            </h1>
            <p className="font-arabic text-muted-foreground mt-2">
              {mode === 'login' ? 'سجّل دخولك للمتابعة' : 'أنشئ حسابك في دقيقة واحدة'}
            </p>
          </div>

          {/* رسالة توضيحية قبل اختيار الدور */}
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6">
            <Lock size={18} className="text-primary flex-shrink-0" />
            <p className="font-arabic text-xs text-muted-foreground">
              اختر دورك أولاً، وسيتم فتح النموذج المناسب لك تلقائياً.
            </p>
          </div>

          {/* شريط اختيار الدور - تصميم محسن */}
          <RoleSelector role={role} onRoleChange={setRole} showAdmin={false} />

          {/* تبويبات الوضع */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-arabic font-bold transition-all ${
                mode === 'login' ? 'bg-card text-primary shadow-sm border border-primary/20' : 'text-muted-foreground'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-arabic font-bold transition-all ${
                mode === 'signup' ? 'bg-card text-primary shadow-sm border border-primary/20' : 'text-muted-foreground'
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* النموذج */}
          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setMode('signup')} selectedRole={role} />
          ) : (
            <SignupForm role={role} onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
