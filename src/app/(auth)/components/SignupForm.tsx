'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, Building2, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { UserRole } from './RoleSelector';

interface SignupFormProps {
  role: UserRole;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ role, onSwitchToLogin }: SignupFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    password: '',
    city: 'بغداد',
    vehicleType: 'دراجة نارية',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(form.email, form.password, {
        full_name: role === 'delivery' ? form.businessName : form.fullName,
        role,
        business_name: form.businessName,
        phone: form.phone,
        city: form.city,
        vehicle_type: role === 'delivery' ? form.vehicleType : '',
      });

      try {
        await signIn(form.email, form.password);
      } catch {
        toast.success('تم إنشاء حسابك — يمكنك تسجيل الدخول');
        onSwitchToLogin();
        return;
      }

      toast.success('مرحباً بك في جُمْلَتِي');

      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'supplier') router.push('/supplier/dashboard');
      else if (role === 'delivery') router.push('/delivery/tasks');
      else router.push('/retailer/home');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already registered')) {
        setError('هذا البريد مسجل مسبقاً');
      } else {
        setError(msg || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } finally {
      setLoading(false);
    }
  };

  const isDelivery = role === 'delivery';
  const businessLabel = isDelivery
    ? 'الاسم الكامل'
    : role === 'supplier'
    ? 'اسم الشركة / المستودع'
    : 'اسم المحل / السوبرماركت';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-danger">{error}</p>
        </div>
      )}

      <Input
        label={businessLabel}
        value={form.businessName}
        onChange={(e) => setField('businessName', e.target.value)}
        placeholder={isDelivery ? 'أحمد الجبوري' : 'اسم النشاط التجاري'}
        icon={isDelivery ? <Navigation size={15} /> : <Building2 size={15} />}
        required
      />

      {!isDelivery && (
        <Input
          label="اسم صاحب النشاط"
          value={form.fullName}
          onChange={(e) => setField('fullName', e.target.value)}
          placeholder="أحمد الجبوري"
          icon={<User size={15} />}
          required
        />
      )}

      {isDelivery && (
        <div>
          <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
            نوع المركبة
          </label>
          <select
            value={form.vehicleType}
            onChange={(e) => setField('vehicleType', e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="دراجة نارية">دراجة نارية</option>
            <option value="سيارة صغيرة">سيارة صغيرة</option>
            <option value="سيارة حمل">سيارة حمل</option>
            <option value="شاحنة">شاحنة</option>
          </select>
        </div>
      )}

      <Input
        label="رقم الهاتف"
        type="tel"
        value={form.phone}
        onChange={(e) => setField('phone', e.target.value)}
        placeholder="07XXXXXXXXX"
        icon={<Phone size={15} />}
        dir="ltr"
        required
      />

      <Input
        label="البريد الإلكتروني"
        type="email"
        value={form.email}
        onChange={(e) => setField('email', e.target.value)}
        placeholder="example@jumlaati.iq"
        icon={<Mail size={15} />}
        dir="ltr"
        required
      />

      <Input
        label="كلمة المرور"
        type="password"
        value={form.password}
        onChange={(e) => setField('password', e.target.value)}
        placeholder="••••••••"
        hint="8 أحرف على الأقل"
        icon={<Lock size={15} />}
        dir="ltr"
        required
      />

      <div>
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          المدينة
        </label>
        <select
          value={form.city}
          onChange={(e) => setField('city', e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          {['بغداد', 'البصرة', 'الموصل', 'أربيل', 'النجف', 'كربلاء', 'كركوك', 'السليمانية', 'الحلة', 'الناصرية'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Button type="submit" variant="accent" fullWidth loading={loading}>
        {role === 'supplier' ? 'إرسال طلب التسجيل' : 'إنشاء الحساب'}
      </Button>

      <p className="text-center text-xs font-arabic text-muted-foreground">
        لديك حساب؟{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-accent font-semibold hover:underline"
        >
          سجّل الدخول
        </button>
      </p>
    </form>
  );
}
