'use client';
import React from 'react';
import { ShoppingBag, Truck, PackageCheck } from 'lucide-react';
import type { UserRole } from './AuthContent';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  showAdmin: boolean; // لن يتم استخدامه بعد الآن، لكن نبقيه للتوافق
}

const roles: { id: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'retailer', label: 'صاحب محل / سوبر ماركت', icon: ShoppingBag, description: 'اطلب بضاعتك' },
  { id: 'supplier', label: 'مجهز / جملة', icon: Truck, description: 'أدر طلباتك' },
  { id: 'delivery', label: 'سائق توصيل', icon: PackageCheck, description: 'نقل البضاعة' },
];

export default function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  // لا نعرض أي دور غير الثلاثة، المدير مخفي تماماً
  const visibleRoles = roles; // حذف فلترة admin

  return (
    <div className="mb-6" dir="rtl">
      <p className="font-arabic text-sm font-medium text-muted-foreground mb-3">اختر نوع حسابك</p>
      <div className="grid gap-2 grid-cols-3">
        {visibleRoles.map(({ id, label, icon: Icon, description }) => {
          const isActive = role === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onRoleChange(id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-md'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground'
              }`}
            >
              <Icon size={22} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-arabic text-xs font-bold leading-tight text-center">{label}</span>
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
