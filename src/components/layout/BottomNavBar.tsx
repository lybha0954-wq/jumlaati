'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, UserCircle, Navigation, History, Wallet, ShieldCheck, Users, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BottomItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navByRole: Record<string, BottomItem[]> = {
  retailer: [
    { id: 'home', label: 'الرئيسية', icon: Home, href: '/retailer/home' },
    { id: 'catalog', label: 'الكتالوج', icon: Package, href: '/retailer/catalog' },
    { id: 'cart', label: 'السلة', icon: ShoppingCart, href: '/retailer/cart' },
    { id: 'profile', label: 'حسابي', icon: UserCircle, href: '/retailer/profile' },
  ],
  supplier: [
    { id: 'dashboard', label: 'الرئيسية', icon: Home, href: '/supplier/dashboard' },
    { id: 'products', label: 'المنتجات', icon: Package, href: '/supplier/products' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, href: '/supplier/orders' },
    { id: 'finance', label: 'المالية', icon: Wallet, href: '/supplier/finance' },
  ],
  delivery: [
    { id: 'tasks', label: 'مهامي', icon: Navigation, href: '/delivery/tasks' },
    { id: 'history', label: 'السجل', icon: History, href: '/delivery/history' },
    { id: 'earnings', label: 'أرباحي', icon: Wallet, href: '/delivery/earnings' },
    { id: 'profile', label: 'حسابي', icon: UserCircle, href: '/delivery/profile' },
  ],
  admin: [
    { id: 'dashboard', label: 'التحكم', icon: ShieldCheck, href: '/admin/dashboard' },
    { id: 'users', label: 'الحسابات', icon: Users, href: '/admin/users' },
    { id: 'financials', label: 'المالية', icon: BarChart2, href: '/admin/financials' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, href: '/admin/orders' },
  ],
};

export default function BottomNavBar() {
  const { role } = useAuth();
  const pathname = usePathname();
  const currentRole = role || 'retailer';
  const items = navByRole[currentRole] || navByRole.retailer;

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all active:scale-95 ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] font-arabic leading-none ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
