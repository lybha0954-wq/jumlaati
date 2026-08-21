'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Building2, User, Phone, Mail, Lock, MapPin, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { UserRole } from './AuthContent';

interface SignupFormProps {
  role: UserRole;
  onSwitchToLogin: () => void;
}

interface SignupValues {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  registrationNumber: string;
  terms: boolean;
}

const cities = [
  'بغداد', 'البصرة', 'الموصل', 'أربيل', 'النجف', 'كربلاء',
  'كركوك', 'السليمانية', 'الديوانية', 'الحلة', 'العمارة', 'الناصرية',
  'الرمادي', 'تكريت', 'سامراء', 'الفلوجة',
];

export default function SignupForm({ role, onSwitchToLogin }: SignupFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupValues>({
    defaultValues: {
      businessName: '', ownerName: '', phone: '', email: '',
      password: '', confirmPassword: '', city: 'بغداد',
      registrationNumber: '', terms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (values: SignupValues) => {
    setSignupError('');
    setLoading(true);
    try {
      await signUp(values.email, values.password, {
        full_name: values.ownerName,
        role,
        business_name: values.businessName,
        phone: values.phone,
        city: values.city,
        registration_number: values.registrationNumber || '',
      });

      // Auto sign-in after successful registration
      try {
        await signIn(values.email, values.password);
      } catch {
        // If auto sign-in fails (e.g. email confirmation required), fall back to login tab
        toast.success('تم إنشاء حسابك بنجاح!', {
          description: 'يمكنك تسجيل الدخول الآن',
        });
        onSwitchToLogin();
        return;
      }

      toast.success('تم إنشاء حسابك بنجاح!', {
        description: 'مرحباً بك في جُمْلَتِي',
      });

      // Redirect to role-specific dashboard
      if (role === 'admin') {
        router.push('/admin-dashboard');
      } else if (role === 'supplier') {
        router.push('/');
      } else {
        router.push('/retailer-shop');
      }
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setSignupError('هذا البريد الإلكتروني مسجل مسبقاً — سجّل الدخول بدلاً من ذلك');
      } else {
        setSignupError(msg || 'حدث خطأ أثناء إنشاء الحساب، حاول مجدداً');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === 'supplier' ? 'المورد' : role === 'retailer' ? 'المحل' : 'المدير';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {signupError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{signupError}</p>
        </div>
      )}

      {/* Business info section */}
      <div className="border border-border rounded-xl p-4 space-y-4 bg-muted/20">
        <h4 className="font-arabic font-semibold text-sm text-foreground pb-1 border-b border-border">
          معلومات {roleLabel}
        </h4>

        <div>
          <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
            اسم {role === 'retailer' ? 'المحل / السوبرماركت' : 'الشركة / المستودع'} <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Building2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              {...register('businessName', { required: 'اسم النشاط التجاري مطلوب' })}
              placeholder={role === 'retailer' ? 'سوبرماركت النخيل' : 'مستودع الجبوري للمواد الغذائية'}
              className="w-full bg-background border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
          {errors.businessName && (
            <p className="text-xs text-danger font-arabic mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              اسم صاحب النشاط <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                {...register('ownerName', { required: 'الاسم مطلوب' })}
                placeholder="أحمد الجبوري"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
            {errors.ownerName && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.ownerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              المدينة <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <MapPin size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <select
                {...register('city', { required: 'المدينة مطلوبة' })}
                className="w-full bg-background border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all appearance-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={`city-opt-${c}`} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(role === 'supplier' || role === 'admin') && (
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              رقم السجل التجاري
              {role === 'supplier' && <span className="text-danger"> *</span>}
            </label>
            <div className="relative">
              <Hash size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                {...register('registrationNumber', {
                  required: role === 'supplier' ? 'رقم السجل التجاري مطلوب للموردين' : false,
                })}
                placeholder="IQ-2024-XXXXXX"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              رقم السجل التجاري الصادر من وزارة التجارة العراقية
            </p>
            {errors.registrationNumber && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.registrationNumber.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Contact info section */}
      <div className="border border-border rounded-xl p-4 space-y-4 bg-muted/20">
        <h4 className="font-arabic font-semibold text-sm text-foreground pb-1 border-b border-border">
          معلومات التواصل والدخول
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              رقم الهاتف <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="tel"
                {...register('phone', {
                  required: 'رقم الهاتف مطلوب',
                  pattern: { value: /^07[0-9]{9}$/, message: 'رقم عراقي غير صحيح (07XXXXXXXXX)' },
                })}
                placeholder="07X XXXX XXXX"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                dir="ltr"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.phone.message}</p>
            )}
          </div>

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
                placeholder="name@example.iq"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                  minLength: { value: 8, message: '8 أحرف على الأقل' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[0-9])/,
                    message: 'يجب أن تحتوي على حرف كبير ورقم',
                  },
                })}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="إظهار/إخفاء كلمة المرور"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              تأكيد كلمة المرور <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'تأكيد كلمة المرور مطلوب',
                  validate: (v) => v === password || 'كلمتا المرور غير متطابقتين',
                })}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pr-9 pl-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="إظهار/إخفاء تأكيد كلمة المرور"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger font-arabic mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          {...register('terms', { required: 'يجب الموافقة على الشروط والأحكام' })}
          className="rounded border-border cursor-pointer mt-0.5 flex-shrink-0"
        />
        <label htmlFor="terms" className="font-arabic text-xs text-muted-foreground cursor-pointer leading-relaxed">
          أوافق على{' '}
          <span className="text-accent font-semibold hover:underline cursor-pointer">شروط الاستخدام</span>
          {' '}و{' '}
          <span className="text-accent font-semibold hover:underline cursor-pointer">سياسة الخصوصية</span>
          {' '}لمنصة جُمْلَتِي
        </label>
      </div>
      {errors.terms && (
        <p className="text-xs text-danger font-arabic -mt-2">{errors.terms.message}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-arabic font-bold text-sm hover:bg-accent/90 disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            جاري إنشاء الحساب...
          </>
        ) : (
          role === 'supplier' ? 'إرسال طلب التسجيل كمورد' : 'إنشاء الحساب'
        )}
      </button>

      {role === 'supplier' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-xs text-amber-700 leading-relaxed">
            ⚠️ حسابات الموردين تخضع للمراجعة من قبل إدارة جُمْلَتِي قبل التفعيل. ستصلك رسالة تأكيد خلال 24 ساعة.
          </p>
        </div>
      )}
    </form>
  );
}