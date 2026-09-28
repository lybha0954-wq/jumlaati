'use client';

import { ShoppingBag, Truck, Navigation, Shield, CheckCircle } from 'lucide-react';

export type UserRole = 'retailer' | 'supplier' | 'delivery' | 'admin';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (r: UserRole) => void;
  showAdmin?: boolean;
}

const baseRoles = [
  { id: 'retailer' as const, label: 'محل / سوبرماركت', sublabel: 'صاحب المحل', icon: ShoppingBag, color: 'emerald' },
  { id: 'supplier' as const, label: 'تاجر جملة', sublabel: 'المورد', icon: Truck, color: 'blue' },
  { id: 'delivery' as const, label: 'مندوب توصيل', sublabel: 'سائق / موزع', icon: Navigation, color: 'amber' },
];

const adminRole = {
  id: 'admin' as const,
  label: 'مدير النظام',
  sublabel: 'Admin',
  icon: Shield,
  color: 'purple',
};

const colorMap: Record<string, { active: string; hover: string; icon: string }> = {
  emerald: { active: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30', hover: 'hover:border-emerald-300', icon: 'text-emerald-600' },
  blue: { active: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30', hover: 'hover:border-blue-300', icon: 'text-blue-600' },
  amber: { active: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30', hover: 'hover:border-amber-300', icon: 'text-amber-600' },
  purple: { active: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30', hover: 'hover:border-purple-300', icon: 'text-purple-600' },
};

export default function RoleSelector({ role, onRoleChange, showAdmin = true }: RoleSelectorProps) {
  const visibleRoles = showAdmin ? [...baseRoles, adminRole] : baseRoles;

  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-foreground font-arabic mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        اختر نوع حسابك
      </label>
      <div className={`grid gap-2.5 grid-cols-2 ${showAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {visibleRoles.map((r) => {
          const RoleIcon = r.icon;
          const active = role === r.id;
          const colors = colorMap[r.color];
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoleChange(r.id)}
              className={`relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all group ${
                active
                  ? `${colors.active} shadow-md`
                  : `border-border bg-card text-muted-foreground ${colors.hover} hover:bg-muted/40`
              }`}
            >
              {active && (
                <span className="absolute top-2 left-2">
                  <CheckCircle size={14} className={colors.icon} />
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                active ? `bg-white/60 dark:bg-white/10 ${colors.icon}` : 'bg-muted text-muted-foreground'
              }`}>
                <RoleIcon size={22} />
              </div>
              <div className="text-center">
                <span className={`font-arabic text-sm font-bold block leading-tight ${
                  active ? 'text-foreground' : 'text-foreground/80'
                }`}>
                  {r.label}
                </span>
                <span className={`font-arabic text-[10px] mt-0.5 block ${
                  active ? colors.icon : 'text-muted-foreground'
                }`}>
                  {r.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
