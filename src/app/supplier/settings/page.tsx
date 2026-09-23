'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User, Phone, Mail, Building2 } from 'lucide-react';

export default function SupplierSettingsPage() {
  const { user } = useAuth();
  const meta = user?.user_metadata || {};

  const fields = [
    { label: 'اسم الشركة / المستودع', value: meta.business_name, icon: Building2 },
    { label: 'الاسم الكامل', value: meta.full_name, icon: User },
    { label: 'رقم الهاتف', value: meta.phone, icon: Phone },
    { label: 'البريد الإلكتروني', value: user?.email, icon: Mail },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold font-arabic">الإعدادات</h2>

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
