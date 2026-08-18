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

const ADMIN_LOGGED_OUT_KEY = 'jumlaati_admin_was_logged_out';

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
    setValue,
  } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setAuthError('');
    setLoading(true);
    try {
      const data = await signIn(values.email, values.password);
      const userRole = data?.user?.user_metadata?.role || selectedRole || 'retailer';

      // If admin logs in, clear the "admin logged out" flag
      if (userRole === 'admin') {
        localStorage.removeItem(ADMIN_LOGGED_OUT_KEY);
      }

      toast.success('تم تسجيل الدخول بنجاح!', { description: 'مرحباً بك في جُمْلَتِي' });

      // Small delay to allow role state to propagate, then redirect
      await new Promise((r) => setTimeout(r, 150));

      if (userRole === 'supplier') {
        router.push('/supplier-dashboard');
      } else if (userRole === 'retailer') {
        router.push('/retailer-shop');
      } else if (userRole === 'admin') {
        router.push('/admin-hub');
      } else {
        router.push('/retailer-shop');
      }
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setAuthError('بيانات الدخول غير صحيحة — تحقق من البريد الإلكتروني وكلمة المرور');
      } else if (msg.includes('Email not confirmed')) {
        setAuthError('البريد الإلكتروني غير مؤكد — تحقق من بريدك الوارد');
      } else {
        setAuthError(msg || 'حدث خطأ أثناء تسجيل الدخول، حاول مجدداً');
      }
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (role: 'retailer' | 'supplier' | 'admin') => {
    const demos = {
      retailer: { email: 'hassan.albaqali@jumlaati.iq', password: 'Retailer@2026' },
      supplier: { email: 'ahmed.aljabouri@jumlaati.iq', password: 'Supplier@2026' },
      admin: { email: 'admin@jumlaati.iq', password: 'Admin@2026!' },
    };
    setValue('email', demos[role].email);
    setValue('password', demos[role].password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {authError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{authError}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="email"
            {...register('email', {
              required: 'البريد الإلكتروني مطلوب',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'صيغة البريد غير صحيحة' },
            })}
            placeholder="example@jumlaati.iq"
            autoComplete="email"
            className="w-full bg-background border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            dir="ltr"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-danger font-arabic mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
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
            aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger font-arabic mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
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

      {/* Demo quick-fill */}
      <div className="border border-dashed border-border rounded-xl p-3 space-y-2">
        <p className="font-arabic text-xs text-muted-foreground text-center">تعبئة سريعة بحساب تجريبي</p>
        <div className="grid grid-cols-3 gap-2">
          {(['retailer', 'supplier', 'admin'] as const).map((r) => (
            <button
              key={`demo-${r}`}
              type="button"
              onClick={() => autofillDemo(r)}
              className="py-1.5 text-xs font-arabic text-muted-foreground border border-border rounded-lg hover:border-primary/40 hover:text-primary transition-all"
            >
              {r === 'retailer' ? 'صاحب محل' : r === 'supplier' ? 'مورد' : 'مدير'}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}