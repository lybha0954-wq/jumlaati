'use client';
import React from 'react';
import { Store, Truck, ShoppingBag, Shield, CheckCircle } from 'lucide-react';
import type { UserRole } from './AuthContent';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (r: UserRole) => void;
  showAdmin?: boolean;
}

const operationalRoles: { id: UserRole; label: string; sublabel: string; icon: React.ElementType; desc: string; color: string }[] = [
  {
    id: 'retailer',
    label: 'سوبرماركت ومحل',
    sublabel: 'طلب البضاعة',
    icon: Store,
    desc: 'اطلب بضاعتك من محلات الجملة مباشرة وبأفضل الأسعار',
    color: 'emerald',
  },
  {
    id: 'supplier',
    label: 'تاجر جملة',
    sublabel: 'محل ومستودع جملة',
    icon: Truck,
    desc: 'اعرض بضاعتك وأدر مبيعاتك وطلبات المحلات',
    color: 'blue',
  },
  {
    id: 'delivery',
    label: 'مندوب توصيل',
    sublabel: 'شحن وتوصيل',
    icon: ShoppingBag,
    desc: 'استلم طلبيات البضاعة ووصلها للمحلات وزوّد أرباحك',
    color: 'amber',
  },
];

const colorMap: Record<string, { active: string; hover: string; icon: string }> = {
  emerald: {
    active: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-500',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  blue: {
    active: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  amber: {
    active: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-500',
    hover: 'hover:border-amber-300 dark:hover:border-amber-700',
    icon: 'text-amber-600 dark:text-amber-400',
  },
};

export default function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-foreground font-arabic mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        اختر نوع حسابك (الأدوار التجارية الثلاثة)
      </label>
      <div className="grid grid-cols-3 gap-2.5">
        {operationalRoles.map((r) => {
          const RoleIcon = r.icon;
          const active = role === r.id;
          const colors = colorMap[r.color];
          return (
            <button
              key={`role-btn-${r.id}`}
              type="button"
              onClick={() => onRoleChange(r.id)}
              className={`relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 group ${active ? `${colors.active} shadow-md` : `border-border bg-card text-muted-foreground ${colors.hover} hover:bg-muted/40`}`}
            >
              {active && (
                <span className="absolute top-2 left-2">
                  <CheckCircle size={14} className={colors.icon} />
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? `bg-white/60 dark:bg-white/10 ${colors.icon}` : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
                <RoleIcon size={22} />
              </div>
              <div className="text-center">
                <span className={`font-arabic text-sm font-bold block leading-tight ${active ? 'text-foreground' : 'text-foreground/80'}`}>{r.label}</span>
                <span className={`font-arabic text-[10px] mt-0.5 block ${active ? colors.icon : 'text-muted-foreground'}`}>{r.sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-arabic text-muted-foreground">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Shield size={13} className="text-primary/70" />
          كادر الإدارة والتشغيل؟
        </span>
        <a
          href="/admin/login"
          className="text-primary hover:underline font-semibold flex items-center gap-1 transition-colors"
        >
          بوابة الإدارة المستقلة ←
        </a>
      </div>
    </div>
  );
}
