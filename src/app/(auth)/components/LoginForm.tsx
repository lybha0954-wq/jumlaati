'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
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
      const userRole = data?.user?.user_metadata?.role || 'retailer';

      toast.success('تم تسجيل الدخول بنجاح');

      if (userRole === 'admin') router.push('/admin/dashboard');
      else if (userRole === 'supplier') router.push('/supplier/dashboard');
      else if (userRole === 'delivery') router.push('/delivery/tasks');
      else router.push('/retailer/home');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('بيانات الدخول غير صحيحة');
      } else {
        setError(msg || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{error}</p>
        </div>
      )}

      <Input
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@jumlaati.iq"
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

      <p className="text-center text-xs font-arabic text-muted-foreground">
        لا تملك حساباً؟{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-accent font-semibold hover:underline"
        >
          أنشئ حساباً جديداً
        </button>
      </p>
    </form>
  );
}
