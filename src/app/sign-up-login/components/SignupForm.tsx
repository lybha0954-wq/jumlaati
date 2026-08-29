'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { UserRole } from './AuthContent';

interface SignupFormProps {
  role: UserRole;
  onSwitchToLogin: () => void;
}

const roleRedirects: Record<UserRole, string> = {
  retailer: '/retailer-home',
  supplier: '/supplier-dashboard',
  admin: '/admin-hub',
};

export default function SignupForm({ role, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, {
        full_name: fullName.trim(),
        role,
        business_name: businessName.trim(),
        phone: phone.trim(),
        city: city.trim(),
      });
      router.push(roleRedirects[role] || '/retailer-home');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setError('هذا البريد الإلكتروني مسجّل مسبقاً، يرجى تسجيل الدخول');
      } else if (msg.includes('Password should be')) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {/* Full Name */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="محمد أحمد"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* Business Name */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          اسم المتجر / الشركة
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={role === 'supplier' ? 'شركة التوريد الذهبية' : 'متجر النور'}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* Phone & City */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxxx"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            المدينة
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="بغداد"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          البريد الإلكتروني <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          كلمة المرور <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm pl-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          تأكيد كلمة المرور <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-arabic font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <UserPlus size={18} />
        )}
        <span>{loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}</span>
      </button>

      {/* Switch to login */}
      <p className="text-center font-arabic text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary font-semibold hover:underline"
        >
          سجّل دخولك
        </button>
      </p>
    </form>
  );
}
