'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, ShieldCheck, Users, UserCircle, Home, Grid3X3, ClipboardList, Wallet, Settings, CreditCard } from 'lucide-react';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const retailerNav: BottomNavItem[] = [
  { id: 'r-home',    label: 'الرئيسية', icon: Home,        href: '/retailer-home' },
  { id: 'r-catalog', label: 'الأقسام',  icon: Grid3X3,     href: '/retailer-catalog' },
  { id: 'r-orders',  label: 'السلة',    icon: ShoppingCart, href: '/retailer-orders' },
  { id: 'r-profile', label: 'حسابي',   icon: UserCircle,  href: '/retailer-profile' },
];

const supplierNav: BottomNavItem[] = [
  { id: 's-dashboard', label: 'الرئيسية', icon: LayoutDashboard, href: '/supplier-dashboard' },
  { id: 's-catalog',   label: 'الكتالوج', icon: Package,          href: '/supplier-catalog' },
  { id: 's-orders',    label: 'الطلبات',  icon: ClipboardList,    href: '/supplier-incoming-orders', badge: 2 },
  { id: 's-finance',   label: 'المالية',  icon: Wallet,           href: '/supplier-finance' },
];

const adminNav: BottomNavItem[] = [
  { id: 'a-hub',          label: 'التحكم',    icon: ShieldCheck, href: '/admin-hub' },
  { id: 'a-users',        label: 'الحسابات',  icon: Users,       href: '/admin-users' },
  { id: 'a-transactions', label: 'المعاملات', icon: CreditCard,  href: '/admin-transactions' },
  { id: 'a-settings',     label: 'الإعدادات', icon: Settings,    href: '/admin-settings' },
];

const navByRole: Record<string, BottomNavItem[]> = {
  retailer: retailerNav,
  supplier: supplierNav,
  admin:    adminNav,
};

export default function BottomNavBar() {
  const pathname = usePathname();

  // Detect role from pathname
  const role = pathname?.startsWith('/admin') ? 'admin'
    : pathname?.startsWith('/supplier') ? 'supplier'
    : 'retailer';

  const items = navByRole[role] || retailerNav;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const NavIcon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5 relative
                transition-all duration-200 active:scale-95
                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <div className="relative">
                <NavIcon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-arabic leading-none ${active ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
