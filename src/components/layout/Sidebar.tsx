'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Home, UserCircle, Package, ShoppingCart, Users, Wallet, BarChart2, Settings, Navigation, History, ShieldCheck, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navByRole: Record<string, NavItem[]> = {
  retailer: [
    { id: 'home', label: 'الرئيسية', icon: Home, href: '/retailer/home' },
    { id: 'catalog', label: 'الكتالوج', icon: Package, href: '/retailer/catalog' },
    { id: 'cart', label: 'السلة', icon: ShoppingCart, href: '/retailer/cart' },
    { id: 'orders', label: 'طلباتي', icon: ClipboardList, href: '/retailer/orders' },
    { id: 'ledger', label: 'كشف الحساب', icon: Wallet, href: '/retailer/ledger' },
    { id: 'profile', label: 'حسابي', icon: UserCircle, href: '/retailer/profile' },
  ],
  supplier: [
    { id: 'dashboard', label: 'الرئيسية', icon: Home, href: '/supplier/dashboard' },
    { id: 'products', label: 'المنتجات', icon: Package, href: '/supplier/products' },
    { id: 'inventory', label: 'المخزون', icon: Package, href: '/supplier/inventory' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart, href: '/supplier/orders' },
    { id: 'finance', label: 'المالية', icon: Wallet, href: '/supplier/finance' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/supplier/settings' },
  ],
  delivery: [
    { id: 'tasks', label: 'مهامي', icon: Navigation, href: '/delivery/tasks' },
    { id: 'history', label: 'السجل', icon: History, href: '/delivery/history' },
    { id: 'earnings', label: 'أرباحي', icon: Wallet, href: '/delivery/earnings' },
    { id: 'profile', label: 'حسابي', icon: UserCircle, href: '/delivery/profile' },
  ],
  admin: [
    { id: 'dashboard', label: 'لوحة التحكم', icon: ShieldCheck, href: '/admin/dashboard' },
    { id: 'users', label: 'المستخدمون', icon: Users, href: '/admin/users' },
    { id: 'products', label: 'المنتجات', icon: Package, href: '/admin/products' },
    { id: 'orders', label: 'جميع الطلبات', icon: ShoppingCart, href: '/admin/orders' },
    { id: 'financials', label: 'المالية', icon: BarChart2, href: '/admin/financials' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/admin/settings' },
  ],
};

export default function Sidebar() {
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const currentRole = role || 'retailer';
  const items = navByRole[currentRole] || navByRole.retailer;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المستخدم';
  const initials = displayName.slice(0, 2);

  const roleLabels: Record<string, string> = {
    admin: 'مدير النظام',
    supplier: 'تاجر جملة',
    retailer: 'صاحب محل',
    delivery: 'مندوب توصيل',
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {}
    router.push('/login');
  };

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="h-full bg-primary flex flex-col w-60">
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base font-arabic">ج</span>
        </div>
        <div>
          <span className="font-arabic font-bold text-white text-lg leading-none block">
            جُمْلَتِي
          </span>
          <p className="text-white/50 text-xs mt-0.5">{roleLabels[currentRole]}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 mx-2 mb-0.5 rounded-lg px-3 py-2.5 transition-all ${
                active
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="font-arabic text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate font-arabic">{displayName}</p>
            <p className="text-white/50 text-xs truncate font-arabic">{roleLabels[currentRole]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
