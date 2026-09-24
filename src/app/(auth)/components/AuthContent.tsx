'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import RoleSelector from './RoleSelector';
import AppLogo from '@/components/ui/AppLogo';
import { ShoppingBag, Truck, Shield, Navigation, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export type UserRole = 'retailer' | 'supplier' | 'admin' | 'delivery';
export type AuthMode = 'login' | 'signup';

const roleLabels: Record<UserRole, string> = {
  retailer: 'صاحب المحل / السوبرماركت',
  supplier: 'تاجر الجملة',
  admin: 'مدير النظام',
  delivery: 'مندوب التوصيل',
};

const roleIcons: Record<UserRole, React.ElementType> = {
  retailer: ShoppingBag,
  supplier: Truck,
  admin: Shield,
  delivery: Navigation,
};

const roleDescriptions: Record<UserRole, string> = {
  retailer: 'اطلب بضاعتك من تجار الجملة بسهولة',
  supplier: 'أدر طلباتك ومخزونك بكفاءة',
  admin: 'راقب وأدر منصة جُمْلَتِي',
  delivery: 'أوصّل الطلبات وتابع مهامك اليومية',
};

const roleFeatures: Record<UserRole, string[]> = {
  supplier: ['استقبل الطلبات وأدرها بلحظة', 'راقب مخزونك وتنبيهات النفاد', 'تتبع إيراداتك اليومية والشهرية'],
  retailer: ['قارن أسعار تجار الجملة بضغطة', 'اطلب بضاعتك بدون مكالمات', 'ادفع كاش أو آجل حسب اتفاقك'],
  admin: ['وافق على التجار والمحلات', 'راقب العمولات والمبيعات', 'أدر تذاكر الدعم الفني'],
  delivery: ['استلم مهام التوصيل فوراً', 'تابع حالة كل طلبية', 'أكّد التسليم بضغطة واحدة'],
};

interface AuthContentProps {
  initialMode?: AuthMode;
}

export default function AuthContent({ initialMode = 'login' }: AuthContentProps) {
  const [role, setRole] = useState<UserRole>('retailer');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { isDark, toggleTheme } = useTheme();
  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent translate-x-[-40%] translate-y-[-40%]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent translate-x-[40%] translate-y-[40%]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/20" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={44} />
          <div>
            <span className="font-arabic font-bold text-white text-2xl leading-none">جُمْلَتِي</span>
            <p className="text-white/60 text-sm font-arabic mt-0.5">منصة التوريد بالجملة</p>
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <RoleIcon size={48} className="text-accent" />
          </div>
          <h2 className="font-arabic font-bold text-3xl text-white mb-3">{roleLabels[role]}</h2>
          <p className="font-arabic text-white/70 text-lg leading-relaxed max-w-xs mx-auto">{roleDescriptions[role]}</p>
          <div className="mt-8 space-y-3 text-right max-w-xs mx-auto">
            {roleFeatures[role].map((f) => (
              <div key={`feature-${f}`} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </span>
                <span className="font-arabic text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="font-arabic text-white/40 text-xs">© 2026 جُمْلَتِي — منصة التوريد بالجملة في العراق</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <AppLogo size={36} />
            <span className="font-arabic font-bold text-primary text-xl">جُمْلَتِي</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-arabic font-bold text-2xl text-foreground">
                  {mode === 'login' ? 'أهلاً بعودتك 👋' : 'إنشاء حساب جديد'}
                </h1>
                <p className="font-arabic text-muted-foreground text-sm mt-1">
                  {mode === 'login' ? 'سجّل دخولك للوصول إلى حسابك' : 'انضم إلى جُمْلَتِي وابدأ التجارة اليوم'}
                </p>
              </div>
              <button onClick={toggleTheme} className="hidden lg:flex p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
          <RoleSelector role={role} onRoleChange={setRole} showAdmin={true} />
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold transition-all ${mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>تسجيل الدخول</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold transition-all ${mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>إنشاء حساب</button>
          </div>
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
