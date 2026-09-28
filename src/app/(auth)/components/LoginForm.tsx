'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDashboardPath } from '@/config/routes';

type LoginMode = 'email' | 'phone';

export default function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [mode, setMode] = useState<LoginMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signIn(email, password);
      const metaRole = data?.user?.user_metadata?.role;
      const finalRole = metaRole || 'retailer';
      const dashboardPath = getDashboardPath(finalRole);

      toast.success('تم تسجيل الدخول بنجاح');
      router.push(dashboardPath);
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.includes('Invalid login') ? 'بيانات الدخول غير صحيحة' : (msg || 'فشل تسجيل الدخول'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* التبويبات */}
      <div className="inline-flex w-full rounded-xl bg-gray-100 p-1">
        <TabBtn active={mode === 'email'} onClick={() => setMode('email')}>
          <Mail size={14} />
          البريد الإلكتروني
        </TabBtn>
        <TabBtn active={mode === 'phone'} onClick={() => setMode('phone')}>
          <Phone size={14} />
          رقم الهاتف
        </TabBtn>
      </div>

      {/* محتوى التبويب */}
      {mode === 'email' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="font-arabic text-sm text-danger">{error}</p>
            </div>
          )}

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@jumlati.iq"
            icon={<Mail size={15} />}
            dir="ltr"
            required
          />

          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock size={15} />}
            dir="ltr"
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            تسجيل الدخول
          </Button>
        </form>
      ) : (
        <ComingSoonCard />
      )}

      {/* التبديل للتسجيل */}
      <p className="pt-2 text-center text-xs font-arabic text-muted-foreground">
        لا تملك حساباً؟{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-[#2e8b73] hover:underline"
        >
          أنشئ حساباً جديداً
        </button>
      </p>
    </div>
  );
}

/* ═════════ مكونات فرعية ═════════ */

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
        active
          ? 'bg-white text-[#1e6b57] shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function ComingSoonCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#2e8b73]/30 bg-[#e8f4f0]/30 p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2e8b73]/10">
        <Sparkles size={22} className="text-[#2e8b73]" />
      </div>
      <h3 className="mb-2 text-base font-black text-[#1e6b57]">
        الدخول برقم الهاتف
      </h3>
      <p className="mb-4 text-xs leading-relaxed text-gray-600">
        نعمل على تجهيز هذه الميزة الآن 🌿
        <br />
        ستتمكن قريباً من الدخول برقم هاتفك مباشرة — بدون كلمة مرور.
      </p>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#2e8b73] shadow-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2e8b73]" />
        قريباً جداً
      </div>
    </div>
  );
}
