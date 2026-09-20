'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';

interface AdminLoginValues {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: AdminLoginValues) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const data = await signIn(values.email, values.password);
      const role = data?.role || data?.user?.user_metadata?.role;
      
      // Verification check: ensure role is admin or owner
      if (role && role !== 'admin' && role !== 'owner') {
        toast.info('تم تسجيل الدخول بحساب تجاري', {
          description: 'جاري توجيهك إلى بوابتك التجارية المناسبة لدورك',
        });
        if (role === 'supplier') {
          router.push('/supplier/dashboard');
        } else if (role === 'delivery') {
          router.push('/delivery/tasks');
        } else {
          router.push('/retailer/home');
        }
        return;
      }

      toast.success('مرحباً بك في لوحة الإدارة العليا', {
        description: 'تم التحقق من صلاحيات الكادر الإداري بنجاح',
      });
      router.push('/admin-hub');
    } catch (error: any) {
      const code = error?.code || '';
      const msg = error?.message || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        msg.includes('invalid-credential')
      ) {
        setErrorMsg('بيانات الدخول الإدارية غير صحيحة، يرجى مراجعة مسؤول النظام');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('تم تقييد محاولات الدخول مؤقتاً لحماية النظام. يرجى الانتظار');
      } else {
        setErrorMsg(msg || 'فشل تسجيل الدخول، يرجى المحاولة مجدداً');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6" dir="rtl">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <AppLogo size={36} />
          <div>
            <span className="font-arabic font-bold text-white text-lg">جُمْلَتِي</span>
            <span className="text-[10px] block font-arabic text-amber-400 font-semibold tracking-wide">بوابة الإدارة العليا والتشغيل</span>
          </div>
        </Link>
        <Link
          href="/sign-up-login"
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-arabic transition-colors py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          <ArrowRight size={13} />
          بوابة التجارة العامة
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Security watermark */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield size={28} />
            </div>
            <h1 className="font-arabic font-bold text-xl sm:text-2xl text-white">
              تسجيل دخول كادر الإدارة
            </h1>
            <p className="font-arabic text-xs sm:text-sm text-slate-400 mt-1.5">
              مخصص فقط للمدير العام، المشرفين، وموظفي العمليات المعتمدين
            </p>
          </div>

          {/* Separation Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-right">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="font-arabic text-xs text-amber-200/90 leading-relaxed">
              هذه البوابة مستقلة عن حسابات السوق (السوبرماركت، تجار الجملة، المندوبين). لا يتم إنشاء حسابات الإدارة بالتسجيل الذاتي بل تصدرها الإدارة المركزية حصراً.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <p className="font-arabic text-xs text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-arabic mb-1.5">
                البريد الإلكتروني الإداري
              </label>
              <div className="relative">
                <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'البريد الإلكتروني مطلوب',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'صيغة البريد الإلكتروني غير صحيحة',
                    },
                  })}
                  placeholder="admin@jumlaati.iq"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm font-arabic text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-arabic mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 font-arabic mb-1.5">
                كلمة المرور المشفرة
              </label>
              <div className="relative">
                <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'كلمة المرور مطلوبة' })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-sm font-arabic text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-arabic mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-arabic font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>جاري التحقق من الصلاحيات...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>دخول لوحة التحكم المركزية</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs font-arabic text-slate-500">
              أنت تاجر جملة، صاحب سوبرماركت، أو مندوب توصيل؟
            </p>
            <Link
              href="/sign-up-login"
              className="inline-block mt-1 text-xs font-arabic font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              الانتقال إلى بوابة الأدوار التجارية الثلاثة ←
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-slate-600 font-arabic text-xs">
        © 2026 منصة جُمْلَتِي — نظام الإدارة المركزية والرقابة اللوجستية في العراق
      </div>
    </div>
  );
}
