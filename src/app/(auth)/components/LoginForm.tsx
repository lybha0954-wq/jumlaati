'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDashboardPath } from '@/config/routes';
import {
  normalizeIraqiPhone,
  phoneToAuthEmail,
  isValidIraqiPhone,
} from '@/lib/utils/phone';

type LoginMode = 'phone' | 'email';

export default function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [mode, setMode] = useState<LoginMode>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // التحقق
    let authEmail = '';
    if (mode === 'phone') {
      if (!isValidIraqiPhone(phone)) {
        setError('رقم الهاتف غير صحيح — مثال: 07701234567');
        return;
      }
      authEmail = phoneToAuthEmail(phone);
    } else {
      if (!email.trim()) {
        setError('أدخل البريد الإلكتروني');
        return;
      }
      authEmail = email.trim();
    }

    setLoading(true);
    try {
      const data = await signIn(authEmail, password);
      const metaRole = data?.user?.user_metadata?.role || 'retailer';
      toast.success('مرحباً بك 🌿');
      router.push(getDashboardPath(metaRole));
    } catch (err: any) {
      const msg = err?.message || '';
      setError(
        msg.includes('Invalid login')
          ? 'بيانات الدخول غير صحيحة'
          : msg || 'فشل تسجيل الدخول'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* التبويبات */}
      <div className="inline-flex w-full rounded-xl bg-gray-100 p-1">
        <TabBtn active={mode === 'phone'} onClick={() => { setMode('phone'); setError(''); }}>
          <Phone size={14} />
          رقم الهاتف
        </TabBtn>
        <TabBtn active={mode === 'email'} onClick={() => { setMode('email'); setError(''); }}>
          <Mail size={14} />
          البريد
        </TabBtn>
      </div>

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {mode === 'phone' ? (
          <Input
            label="رقم الهاتف"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07701234567"
            icon={<Phone size={15} />}
            dir="ltr"
            inputMode="numeric"
            autoComplete="tel"
            required
          />
        ) : (
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@jumlati.iq"
            icon={<Mail size={15} />}
            dir="ltr"
            autoComplete="email"
            required
          />
        )}

        <Input
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          dir="ltr"
          autoComplete="current-password"
          required
        />

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          تسجيل الدخول
        </Button>
      </form>

      {/* التبديل للتسجيل */}
      <p className="pt-2 text-center text-xs text-muted-foreground">
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

/* ═════════ مكون فرعي ═════════ */

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
