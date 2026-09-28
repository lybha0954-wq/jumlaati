'use client';
import { getDashboardPath } from '@/config/routes';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, Building2, Navigation, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { UserRole } from './RoleSelector';

/** التطبيق حالياً مخصص لمحافظة كربلاء المقدسة */
const DEFAULT_CITY = 'كربلاء المقدسة';
const VEHICLES = ['دراجة نارية', 'سيارة صغيرة', 'سيارة حمل', 'شاحنة'];

export default function SignupForm({ role, onSwitchToLogin }: { role: UserRole; onSwitchToLogin: () => void }) {
  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    password: '',
    city: DEFAULT_CITY,
    vehicleType: 'دراجة نارية',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const setField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(form.email, form.password, {
        full_name: role === 'delivery' ? form.businessName : form.fullName,
        role: role,
        business_name: form.businessName,
        phone: form.phone,
        city: form.city,
        vehicle_type: role === 'delivery' ? form.vehicleType : '',
      });

      try {
        await signIn(form.email, form.password);
      } catch {
        toast.success('تم إنشاء حسابك');
        onSwitchToLogin();
        return;
      }

      toast.success('مرحباً بك في جُمْلَتِي 🌿');
      router.push(getDashboardPath(role));
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.includes('already') ? 'البريد مسجل مسبقاً' : (msg || 'فشل التسجيل'));
    } finally {
      setLoading(false);
    }
  };

  const isDelivery = role === 'delivery';
  const bizLabel = isDelivery
    ? 'الاسم الكامل'
    : role === 'supplier'
    ? 'اسم الشركة / المستودع'
    : 'اسم المحل / السوبرماركت';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="font-arabic text-sm text-danger">{error}</p>
        </div>
      )}

      <Input
        label={bizLabel}
        value={form.businessName}
        onChange={(e) => setField('businessName', e.target.value)}
        placeholder={isDelivery ? 'أحمد الجبوري' : 'اسم النشاط'}
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
          <label className="mb-1.5 block text-xs font-semibold font-arabic">
            نوع المركبة
          </label>
          <select
            value={form.vehicleType}
            onChange={(e) => setField('vehicleType', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-arabic focus:border-[#2e8b73] focus:outline-none focus:ring-2 focus:ring-[#2e8b73]/20"
          >
            {VEHICLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
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

      {/* المدينة — مقروءة حالياً، مخصص لكربلاء */}
      <div>
        <Input
          label="المدينة"
          value={form.city}
          onChange={(e) => setField('city', e.target.value)}
          icon={<MapPin size={15} />}
          readOnly
        />
        <p className="mt-1 text-[11px] font-arabic text-muted-foreground">
          التطبيق حالياً مخصص لمحافظة كربلاء المقدسة — قريباً محافظات أخرى 🌿
        </p>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {role === 'supplier' ? 'إرسال طلب التسجيل' : 'إنشاء الحساب'}
      </Button>

      <p className="pt-2 text-center text-xs font-arabic text-muted-foreground">
        لديك حساب؟{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-[#2e8b73] hover:underline"
        >
          سجّل الدخول
        </button>
      </p>
    </form>
  );
}
