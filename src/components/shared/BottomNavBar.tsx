"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ShoppingCart, Package, Wallet, User,
  Tag, Truck, DollarSign, ListChecks, Users, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/userStore";

/* ═══════════════════════════════════════════
   تعريف التبويبات لكل دور
   ═══════════════════════════════════════════ */

interface Tab {
  key: string;
  href: string;
  label: string;
  Icon: any;
}

const TABS_BY_ROLE: Record<string, Tab[]> = {
  retailer: [
    { key: 'home',    href: '/retailer/overview',   label: 'الرئيسية', Icon: Home },
    { key: 'shop',    href: '/products',             label: 'تسوّق',    Icon: ShoppingCart },
    { key: 'orders',  href: '/retailer/orders',      label: 'طلباتي',   Icon: Package },
    { key: 'wallet',  href: '/retailer/commissions', label: 'حسابي',    Icon: Wallet },
    { key: 'me',      href: '/retailer/settings',    label: 'ملفي',     Icon: User },
  ],
  supplier: [
    { key: 'home',     href: '/wholesale/overview', label: 'الرئيسية', Icon: Home },
    { key: 'products', href: '/wholesale/products', label: 'منتجاتي',  Icon: Tag },
    { key: 'orders',   href: '/wholesale/orders',   label: 'الطلبات',  Icon: Package },
    { key: 'earnings', href: '/wholesale/payouts',  label: 'مستحقاتي', Icon: DollarSign },
    { key: 'me',       href: '/wholesale/settings', label: 'ملفي',     Icon: User },
  ],
  delivery: [
    { key: 'home',     href: '/delivery/overview',     label: 'الرئيسية', Icon: Home },
    { key: 'tasks',    href: '/delivery/tasks',        label: 'مهامي',    Icon: ListChecks },
    { key: 'history',  href: '/delivery/task-history', label: 'السجل',    Icon: Truck },
    { key: 'earnings', href: '/delivery/earnings',     label: 'أرباحي',   Icon: DollarSign },
    { key: 'me',       href: '/delivery/settings',     label: 'ملفي',     Icon: User },
  ],
  admin: [
    { key: 'home',        href: '/admin/home',        label: 'الرئيسية', Icon: Home },
    { key: 'users',       href: '/admin/users',       label: 'المستخدمون', Icon: Users },
    { key: 'reports',     href: '/admin/analytics',   label: 'التقارير',  Icon: BarChart3 },
    { key: 'commissions', href: '/admin/commissions', label: 'العمولات',  Icon: DollarSign },
    { key: 'me',          href: '/admin/settings',    label: 'ملفي',      Icon: User },
  ],
};

/* ═══════════════════════════════════════════
   المكوّن
   ═══════════════════════════════════════════ */

export function BottomNavBar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const role = user?.role;

  // الزائر أو الدور غير معروف → لا نعرض شيئاً
  if (!role) return null;
  const tabs = TABS_BY_ROLE[role] || TABS_BY_ROLE.retailer;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid h-16 grid-cols-5">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            pathname.startsWith(tab.href + '/');
          const Icon = tab.Icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 transition-colors',
                active ? 'text-[#2e8b73]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {/* خط علوي أخضر عند النشاط */}
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[#2e8b73]" />
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={cn('transition-transform', active && 'scale-110')}
              />

              <span
                className={cn(
                  'text-[10px] leading-none',
                  active ? 'font-bold' : 'font-medium'
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
