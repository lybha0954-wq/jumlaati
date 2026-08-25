'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Shield, CheckCircle } from 'lucide-react';
import type { UserRole } from './AuthContent';
import Icon from '@/components/ui/AppIcon';


interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (r: UserRole) => void;
  showAdmin: boolean;
}

const baseRoles: { id: UserRole; label: string; sublabel: string; icon: React.ElementType; desc: string; color: string }[] = [
  {
    id: 'retailer',
    label: 'محل / فرع',
    sublabel: 'صاحب المحل',
    icon: ShoppingBag,
    desc: 'اطلب بضاعتك من الموردين بسهولة',
    color: 'emerald',
  },
  {
    id: 'supplier',
    label: 'تجار الجملة',
    sublabel: 'المورد / الموزع',
    icon: Truck,
    desc: 'أدر طلباتك ومخزونك بكفاءة',
    color: 'blue',
  },
];

const adminRole: { id: UserRole; label: string; sublabel: string; icon: React.ElementType; desc: string; color: string } = {
  id: 'admin',
  label: 'مدير النظام',
  sublabel: 'Admin',
  icon: Shield,
  desc: 'راقب وأدر منصة جُمْلَتِي',
  color: 'purple',
};

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
  purple: {
    active: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-500',
    hover: 'hover:border-purple-300 dark:hover:border-purple-700',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

export default function RoleSelector({ role, onRoleChange, showAdmin }: RoleSelectorProps) {
  const visibleRoles = showAdmin ? [...baseRoles, adminRole] : baseRoles;

  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-foreground font-arabic mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        اختر نوع حسابك
      </label>
      <div className={`grid gap-2.5 ${showAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {visibleRoles.map((r) => {
          const Icon = r.icon;
          const active = role === r.id;
          const colors = colorMap[r.color];
          return (
            <button
              key={`role-btn-${r.id}`}
              type="button"
              onClick={() => onRoleChange(r.id)}
              className={`
                relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 group
                ${active
                  ? `${colors.active} shadow-md`
                  : `border-border bg-card text-muted-foreground ${colors.hover} hover:bg-muted/40`
                }
              `}
            >
              {active && (
                <span className="absolute top-2 left-2">
                  <CheckCircle size={14} className={colors.icon} />
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                active ? `bg-white/60 dark:bg-white/10 ${colors.icon}` : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
              }`}>
                <Icon size={22} />
              </div>
              <div className="text-center">
                <span className={`font-arabic text-sm font-bold block leading-tight ${active ? 'text-foreground' : 'text-foreground/80'}`}>
                  {r.label}
                </span>
                <span className={`font-arabic text-[10px] mt-0.5 block ${active ? colors.icon : 'text-muted-foreground'}`}>
                  {r.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {showAdmin && (
        <p className="mt-2 text-[10px] text-muted-foreground font-arabic text-center flex items-center justify-center gap-1">
          <Shield size={10} />
          خيار مدير النظام متاح بعد تسجيل الخروج الكامل
        </p>
      )}
    </div>
  );
}