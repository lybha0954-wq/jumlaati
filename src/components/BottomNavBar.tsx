'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, ShieldCheck, Users, UserCircle, Home, ClipboardList, Wallet, Settings, CreditCard, History, DollarSign } from 'lucide-react';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const retailerNav: BottomNavItem[] = [
  { id: 'r-dashboard', label: 'الرئيسية', icon: Home,         href: '/retailer-dashboard' },
  { id: 'r-cart',      label: 'السلة',     icon: ShoppingCart, href: '/retailer-cart' },
  { id: 'r-orders',    label: 'طلباتي',    icon: ClipboardList, href: '/retailer-orders' },
  { id: 'r-profile',   label: 'حسابي',     icon: UserCircle,    href: '/retailer-profile' },
];

const supplierNav: BottomNavItem[] = [
  { id: 's-dashboard', label: 'الرئيسية', icon: LayoutDashboard, href: '/supplier-dashboard' },
  { id: 's-inventory', label: 'المخزون',  icon: Package,         href: '/supplier-inventory' },
  { id: 's-orders',    label: 'الطلبات',  icon: ClipboardList,   href: '/supplier-orders', badge: 2 },
  { id: 's-analytics', label: 'التحليلات', icon: Wallet,          href: '/supplier-analytics' },
];

const deliveryNav: BottomNavItem[] = [
  { id: 'd-dashboard', label: 'الرئيسية', icon: Home,          href: '/delivery-dashboard' },
  { id: 'd-tasks',     label: 'المهام',    icon: ClipboardList, href: '/delivery-tasks', badge: 5 },
  { id: 'd-history',   label: 'السجل',     icon: History,       href: '/delivery-history' },
  { id: 'd-earnings',  label: 'أرباحي',    icon: DollarSign,    href: '/delivery-earnings' },
];

const adminNav: BottomNavItem[] = [
  { id: 'a-dashboard', label: 'التحكم',    icon: ShieldCheck, href: '/admin-dashboard' },
  { id: 'a-users',     label: 'الحسابات',  icon: Users,       href: '/admin-users' },
  { id: 'a-orders',    label: 'الطلبات',   icon: CreditCard,  href: '/orders-routing' },
  { id: 'a-settings',  label: 'الإعدادات', icon: Settings,    href: '/admin-settings' },
];

const navByRole: Record<string, BottomNavItem[]> = {
  retailer: retailerNav,
  supplier: supplierNav,
  delivery: deliveryNav,
  admin:    adminNav,
};

export default function BottomNavBar() {
  const pathname = usePathname();

  // Detect role from pathname
  const role = pathname?.startsWith('/admin') ? 'admin'
    : pathname?.startsWith('/supplier') ? 'supplier'
    : pathname?.startsWith('/delivery') ? 'delivery'
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
