'use client';

import { useState } from 'react';
import Link from 'next/link';
import RoleSelector, { type UserRole } from '../components/RoleSelector';
import SignupForm from '../components/SignupForm';
import AppLogo from '@/components/ui/AppLogo';

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('retailer');

  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/10 translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={44} />
          <div>
            <span className="font-arabic font-bold text-white text-2xl">جُمْلَتِي</span>
            <p className="text-white/60 text-sm font-arabic">منصة التوريد بالجملة</p>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="font-arabic font-bold text-3xl text-white mb-3">
            انضم إلى جُمْلَتِي
          </h2>
          <p className="font-arabic text-white/70 text-lg leading-relaxed">
            ابدأ التجارة بالجملة بسهولة — اختر دورك وأكمل التسجيل
          </p>
        </div>
        <p className="relative z-10 text-center font-arabic text-white/40 text-xs">
          © 2026 جُمْلَتِي
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={36} />
            <span className="font-arabic font-bold text-primary text-xl">جُمْلَتِي</span>
          </div>

          <h1 className="font-arabic font-bold text-2xl text-foreground mb-1">
            إنشاء حساب جديد
          </h1>
          <p className="font-arabic text-muted-foreground text-sm mb-6">
            انضم إلى جُمْلَتِي وابدأ التجارة اليوم
          </p>

          <RoleSelector role={role} onRoleChange={setRole} />

          <SignupForm role={role} onSwitchToLogin={() => {}} />

          <p className="text-center text-xs font-arabic text-muted-foreground mt-6">
            <Link href="/login" className="text-accent font-semibold hover:underline">
              لديك حساب؟ سجّل الدخول ←
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
