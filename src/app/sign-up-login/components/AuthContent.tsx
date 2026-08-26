'use client';
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import RoleSelector from './RoleSelector';
import AppLogo from '../../../components/ui/AppLogo';
import { ShoppingBag, Truck, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export type UserRole = 'retailer' | 'supplier' | 'admin';
export type AuthMode = 'login' | 'signup';

const ADMIN_LOGGED_OUT_KEY = 'jumlaati_admin_was_logged_out';

const roleLabels: Record<UserRole, string> = {
  retailer: 'صاحب المحل / الفرع',
  supplier: 'تاجر الجملة / المورد',
  admin: 'مدير النظام',
};

const roleIcons: Record<UserRole, React.ElementType> = {
  retailer: ShoppingBag,
  supplier: Truck,
  admin: Shield,
};

const roleDescriptions: Record<UserRole, string> = {
  retailer: 'اطلب بضاعتك من الموردين بسهولة',
  supplier: 'أدر طلباتك ومخزونك بكفاءة',
  admin: 'راقب وأدر منصة جُمْلَتِي',
};

const roleFeatures: Record<UserRole, string[]> = {
  supplier: ['استقبل الطلبات وأدرها بلحظة', 'راقب مخزونك وتنبيهات النفاد', 'تتبع إيراداتك اليومية والشهرية'],
  retailer: ['قارن أسعار الموردين بضغطة', 'اطلب بضاعتك بدون مكالمات', 'ادفع كاش أو آجل حسب اتفاقك'],
  admin: ['وافق على الموردين والمحلات', 'راقب العمولات والمبيعات', 'أدر تذاكر الدعم الفني'],
};

export default function AuthContent() {
  const [role, setRole] = useState<UserRole>('supplier');
  const [mode, setMode] = useState<AuthMode>('login');
  const [showAdmin, setShowAdmin] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const RoleIcon = roleIcons[role];

  // Determine if admin option should be shown:
  // Show admin if: no active session AND (first install OR admin previously signed out)
  useEffect(() => {
    const checkAdminVisibility = () => {
      // Check if there's an active mock session
      try {
        const mockSession = localStorage.getItem('jumlaati_mock_session');
        const session = mockSession ? JSON.parse(mockSession) : null;
        const isLoggedIn = !!session?.user;

        if (isLoggedIn) {
          // Someone is logged in — hide admin
          setShowAdmin(false);
          return;
        }

        // No active session — check if admin was previously logged out or first install
        const adminLoggedOut = localStorage.getItem(ADMIN_LOGGED_OUT_KEY);
        const mockUsers = localStorage.getItem('jumlaati_mock_users');
        const hasUsers = mockUsers && Object.keys(JSON.parse(mockUsers)).length > 0;

        if (!hasUsers) {
          // First install — show admin
          setShowAdmin(true);
        } else if (adminLoggedOut === 'true') {
          // Admin explicitly signed out — show admin again
          setShowAdmin(true);
        } else {
          // Users exist but admin never signed out — hide admin
          setShowAdmin(false);
        }
      } catch {
        setShowAdmin(true); // Default: show on error
      }
    };

    checkAdminVisibility();
  }, []);

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent translate-x-[-40%] translate-y-[-40%]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent translate-x-[40%] translate-y-[40%]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={44} />
          <div>
            <span className="font-arabic font-bold text-white text-2xl leading-none">جُمْلَتِي</span>
            <p className="text-white/60 text-sm font-arabic mt-0.5">منصة التوريد بالجملة</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RoleIcon size={48} className="text-accent" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }} />
          </div>
          <h2 className="font-arabic font-bold text-3xl text-white mb-3">
            {roleLabels[role]}
          </h2>
          <p className="font-arabic text-white/70 text-lg leading-relaxed max-w-xs mx-auto">
            {roleDescriptions[role]}
          </p>

          {/* Feature bullets */}
          <div className="mt-8 space-y-3 text-right max-w-xs mx-auto">
            {roleFeatures[role].map((f) => (
              <div key={`feature-${f}`} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">✓</span>
                </span>
                <span className="font-arabic text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10 text-center">
          <p className="font-arabic text-white/40 text-xs">
            © 2026 جُمْلَتِي — منصة التوريد بالجملة في العراق
          </p>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <AppLogo size={36} />
            <span className="font-arabic font-bold text-primary text-xl">جُمْلَتِي</span>
          </div>
          {/* Dark mode toggle on mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            aria-label={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-arabic font-bold text-2xl text-foreground">
                  {mode === 'login' ? 'أهلاً بعودتك 👋' : 'إنشاء حساب جديد'}
                </h1>
                <p className="font-arabic text-muted-foreground text-sm mt-1">
                  {mode === 'login' ?'سجّل دخولك للوصول إلى حسابك' :'انضم إلى جُمْلَتِي وابدأ التجارة اليوم'}
                </p>
              </div>
              {/* Dark mode toggle on desktop */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                aria-label={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Role selector — shown for both login and signup */}
          <RoleSelector role={role} onRoleChange={setRole} showAdmin={showAdmin} />

          {/* Mode tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold transition-all ${
                mode === 'login' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold transition-all ${
                mode === 'signup' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form */}
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