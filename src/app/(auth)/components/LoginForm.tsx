'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDashboardPath } from '@/config/routes';

export default function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
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

      // استخدام getDashboardPath — مصدر واحد للحقيقة
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{error}</p>
        </div>
      )}

      <Input label="البريد الإلكتروني" type="email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@jumlati.iq" icon={<Mail size={15} />} dir="ltr" required />

      <Input label="كلمة المرور" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••" icon={<Lock size={15} />} dir="ltr" required />

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        تسجيل الدخول
      </Button>

      <p className="text-center text-xs font-arabic text-muted-foreground">
        لا تملك حساباً؟{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-accent font-semibold hover:underline">
          أنشئ حساباً جديداً
        </button>
      </p>
    </form>
  );
}
