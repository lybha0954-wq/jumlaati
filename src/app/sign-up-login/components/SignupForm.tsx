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

// التوجيه الجديد حسب الواجهات المضافة
const roleRedirects: Record<UserRole, string> = {
  retailer: '/retailer-dashboard', // بدلاً من /retailer-home
  supplier: '/supplier-dashboard', // نفس الاسم
  admin: '/admin-dashboard',       // بدلاً من /admin-hub
  delivery: '/delivery-dashboard', // نفس الاسم
};

// قائمة المحافظات العراقية
const governorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'الأنبار', 'ديالى',
  'ذي قار', 'السليمانية', 'صلاح الدين', 'بابل', 'واسط', 'ميسان', 'المثنى',
  'القادسية', 'كركوك'
];

// أنواع السيارات لسائق التوصيل
const vehicleTypes = ['شاحنة صغيرة', 'فان', 'شاحنة كبيرة', 'دراجة نارية', 'سيارة صالون'];

export default function SignupForm({ role, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState(''); 
  const [vehicleType, setVehicleType] = useState(''); 
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSupplier = role === 'supplier';
  const isDelivery = role === 'delivery';
  const isRetailer = role === 'retailer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !phone.trim()) {
      setError('يرجى تعبئة الاسم الكامل ورقم الهاتف');
      return;
    }
    if (isDelivery && !vehicleType) {
      setError('يرجى اختيار نوع السيارة');
      return;
    }
    if (password.length < 6 || password !== confirmPassword) {
      setError('تأكد من كلمة المرور (6 أحرف على الأقل) ومطابقتها');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim() || phone.trim(), password, {
        full_name: fullName.trim(),
        role,
        business_name: businessName.trim(),
        vehicle_type: vehicleType, 
        phone: phone.trim(),
        governorate,
      });
      router.push(roleRedirects[role] || '/retailer-dashboard');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setError('هذا البريد/الهاتف مسجّل مسبقاً، يرجى تسجيل الدخول');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {/* الاسم الكامل */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="محمد أحمد"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* الحقول الخاصة بالدور */}
      {isSupplier && (
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            اسم الجملة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="مثال: شركة الرافدين للتجهيزات"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
        </div>
      )}

      {isDelivery && (
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            نوع السيارة <span className="text-red-500">*</span>
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          >
            <option value="">اختر نوع السيارة</option>
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      )}

      {isRetailer && (
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            اسم المتجر <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="مثال: سوبرماركت النور"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
        </div>
      )}

      {/* الهاتف والمحافظة */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxxx"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
            المحافظة <span className="text-red-500">*</span>
          </label>
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          >
            <option value="">اختر</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* البريد الإلكتروني اختياري */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          البريد الإلكتروني (اختياري)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {/* كلمة المرور */}
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
            className="w-full px-4 py-3 rounded-xl border border-border bg-background pl-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="block font-arabic text-sm font-medium text-foreground mb-1.5">
          تأكيد كلمة المرور <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-arabic text-sm"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-arabic text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-arabic font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-lg"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
        <span>{loading ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}</span>
      </button>

      <p className="text-center font-arabic text-sm text-muted-foreground">
        لديك حساب؟{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-primary font-bold hover:underline">
          سجّل دخولك
        </button>
      </p>
    </form>
  );
        }
