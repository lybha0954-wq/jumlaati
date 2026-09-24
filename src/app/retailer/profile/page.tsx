'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, Building2, MapPin, LogOut, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RetailerProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    storeName: '', ownerName: '', phone: '', email: '', city: '',
  });

  useEffect(() => {
    if (!user) return;
    setProfile({
      storeName: user.user_metadata?.business_name || '',
      ownerName: user.user_metadata?.full_name || '',
      phone: user.user_metadata?.phone || '',
      email: user.email || '',
      city: user.user_metadata?.city || '',
    });
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) return;

      const { error } = await supabase.auth.updateUser({
        data: {
          business_name: profile.storeName,
          full_name: profile.ownerName,
          phone: profile.phone,
          city: profile.city,
        },
      });

      if (error) throw error;

      // Update user_profiles
      await supabase
        .from('user_profiles')
        .update({
          business_name: profile.storeName,
          full_name: profile.ownerName,
          phone: profile.phone,
          governorate: profile.city,
        })
        .eq('id', user?.id);

      toast.success('تم الحفظ بنجاح');
    } catch (e: any) {
      toast.error(e?.message || 'فشل الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await signOut(); } catch {}
    router.push('/login');
  };

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      <div className="bg-gradient-to-l from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl font-arabic">
            {(profile.storeName || 'م').charAt(0)}
          </div>
          <div>
            <h2 className="font-arabic font-bold text-foreground text-base">
              {profile.storeName || 'متجرك'}
            </h2>
            <p className="font-arabic text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-arabic font-bold text-sm">المعلومات الشخصية</h3>

        <Input label="اسم المتجر" value={profile.storeName}
          onChange={(e) => setProfile((p) => ({ ...p, storeName: e.target.value }))}
          icon={<Building2 size={15} />} />

        <Input label="اسم المالك" value={profile.ownerName}
          onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))}
          icon={<User size={15} />} />

        <Input label="رقم الهاتف" type="tel" value={profile.phone}
          onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
          icon={<Phone size={15} />} dir="ltr" />

        <Input label="البريد الإلكتروني" value={profile.email} disabled
          icon={<Mail size={15} />} dir="ltr" />

        <Input label="المدينة" value={profile.city}
          onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
          icon={<MapPin size={15} />} />

        <Button onClick={handleSave} loading={loading} fullWidth leftIcon={<Save size={16} />}>
          حفظ التغييرات
        </Button>
      </div>

      <Button onClick={handleLogout} variant="danger" fullWidth leftIcon={<LogOut size={16} />}>
        تسجيل الخروج
      </Button>
    </div>
  );
}
