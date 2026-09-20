'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from './AuthContent';

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  selectedRole?: UserRole;
}

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm({ onSwitchToSignup, selectedRole }: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setAuthError('');
    setLoading(true);
    try {
      const data = await signIn(values.email, values.password);
      const userRole = data?.role || data?.user?.user_metadata?.role || selectedRole || 'retailer';
      
      toast.success('تم تسجيل الدخول بنجاح!', { description: 'مرحباً بك في جُمْلَتِي' });
      if (userRole === 'admin') {
        router.push('/admin-hub');
      } else if (userRole === 'supplier') {
        router.push('/supplier/dashboard');
      } else if (userRole === 'delivery') {
        router.push('/delivery/tasks');
      } else {
        router.push('/retailer/home');
      }
    } catch (error: any) {
      const code = error?.code || '';
      const msg = error?.message || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        msg.includes('invalid-credential') ||
        msg.includes('user-not-found')
      ) {
        setAuthError('بيانات الدخول غير صحيحة — تحقق من البريد الإلكتروني وكلمة المرور');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار والمحاولة لاحقاً');
      } else if (code === 'auth/invalid-email') {
        setAuthError('صيغة البريد الإلكتروني غير صحيحة');
      } else if (code === 'auth/network-request-failed') {
        setAuthError('فشل الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت');
      } else {
        setAuthError(msg || 'حدث خطأ أثناء تسجيل الدخول، حاول مجدداً');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {authError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{authError}</p>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          البريد الإلكتروني <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            {...register('email', {
              required: 'البريد الإلكتروني مطلوب',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'صيغة البريد غير صحيحة' },
            })}
            placeholder="name@business.iq"
            autoComplete="email"
            className="w-full bg-background border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            dir="ltr"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-danger font-arabic mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          كلمة المرور <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type={showPass ? 'text' : 'password'}
            {...register('password', {
              required: 'كلمة المرور مطلوبة',
              minLength: { value: 6, message: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' },
            })}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full bg-background border border-border rounded-xl pr-9 pl-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger font-arabic mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-arabic font-bold text-sm hover:bg-primary/90 disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            جاري تسجيل الدخول...
          </>
        ) : (
          'تسجيل الدخول'
        )}
      </button>

      {onSwitchToSignup && (
        <p className="text-center text-xs font-arabic text-muted-foreground mt-4">
          ليس لديك حساب بعد؟{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary font-bold hover:underline"
          >
            إنشاء حساب جديد
          </button>
        </p>
      )}
    </form>
  );
}
