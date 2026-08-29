'use client';
import React from 'react';
import { ShoppingBag, Truck, Shield } from 'lucide-react';
import type { UserRole } from './AuthContent';
import Icon from '@/components/ui/AppIcon';


interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  showAdmin: boolean;
}

const roles: { id: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'retailer', label: 'صاحب المحل', icon: ShoppingBag, description: 'اطلب بضاعتك' },
  { id: 'supplier', label: 'تاجر الجملة', icon: Truck, description: 'أدر طلباتك' },
  { id: 'admin', label: 'مدير النظام', icon: Shield, description: 'إدارة المنصة' },
];

export default function RoleSelector({ role, onRoleChange, showAdmin }: RoleSelectorProps) {
  const visibleRoles = roles.filter((r) => r.id !== 'admin' || showAdmin);

  return (
    <div className="mb-6" dir="rtl">
      <p className="font-arabic text-sm font-medium text-muted-foreground mb-3">اختر نوع حسابك</p>
      <div className={`grid gap-2 ${visibleRoles.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {visibleRoles.map(({ id, label, icon: Icon, description }) => {
          const isActive = role === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onRoleChange(id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 text-primary' :'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-arabic text-xs font-semibold leading-tight text-center">{label}</span>
              <span className="font-arabic text-[10px] text-muted-foreground leading-tight text-center hidden sm:block">
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
