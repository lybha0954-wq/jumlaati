'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User, Phone, Mail, Navigation, MapPin } from 'lucide-react';

export default function DeliveryProfilePage() {
  const { user } = useAuth();
  const meta = user?.user_metadata || {};

  const fields = [
    { label: 'الاسم الكامل', value: meta.full_name, icon: User },
    { label: 'رقم الهاتف', value: meta.phone, icon: Phone },
    { label: 'البريد الإلكتروني', value: user?.email, icon: Mail },
    { label: 'نوع المركبة', value: meta.vehicle_type, icon: Navigation },
    { label: 'المدينة', value: meta.city, icon: MapPin },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <div className="bg-gradient-to-l from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold font-arabic">
            {(meta.full_name || 'م').charAt(0)}
          </div>
          <div>
            <p className="font-arabic font-bold text-lg">{meta.full_name || 'مندوب'}</p>
            <p className="text-white/80 text-sm font-arabic">مندوب توصيل</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border">
        {fields.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-arabic">{f.label}</p>
                <p className="font-arabic font-semibold text-sm truncate mt-0.5">
                  {f.value || '—'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
