'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, Settings, ChevronRight, ChevronLeft, LogOut, Bell, Truck, HelpCircle, Store, ShoppingBag, ShieldCheck, Wallet, UserCircle, BarChart2, ClipboardList, Search,  } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';



interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  group?: string;
  roles?: string[];
}

/* ═══════════════════════════════════════════════════════════════
   هيكل التنقل حسب الدور
   ───────────────────────────────────────────────────────────────
   صاحب المحل (retailer):
     التسوق → السلة → طلباتي → الديون → حسابي → الدعم

   المورد (supplier):
     الرئيسية → المخزون → الطلبات الواردة → المالية →
     المحلات والعملاء → مناطق التوصيل → الإشعارات → الإعدادات

   المدير (admin):
     لوحة التحكم → المستخدمون → الطلبات → التقارير المالية →
     الإشعارات → الدعم الفني → الإعدادات
═══════════════════════════════════════════════════════════════ */
const navItems: NavItem[] = [

  /* ── صاحب المحل ─────────────────────────────────────────── */
  { id: 'r-shop',     label: 'تسوق من الموردين',    icon: Store,         href: '/retailer-shop',     group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-browse',   label: 'تصفح المنتجات',       icon: Search,        href: '/product-browse',    group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-cart',     label: 'سلة التسوق',          icon: ShoppingBag,   href: '/retailer-cart',     group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-checkout', label: 'إتمام الطلب',         icon: ShoppingCart,  href: '/retailer-checkout', group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-orders',   label: 'طلباتي',              icon: ClipboardList, href: '/orders',            group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-ledger',   label: 'كشف الحساب والديون',  icon: Wallet,        href: '/retailer-ledger',   group: 'الحساب',    roles: ['retailer'] },
  { id: 'r-account',  label: 'حسابي',               icon: UserCircle,    href: '/retailer-account',  group: 'الحساب',    roles: ['retailer'] },
  { id: 'r-support',  label: 'الدعم والإعدادات',    icon: HelpCircle,    href: '/support-settings',  group: 'الحساب',    roles: ['retailer'] },

  /* ── المورد ──────────────────────────────────────────────── */
  { id: 's-dashboard', label: 'الرئيسية',          icon: LayoutDashboard, href: '/supplier-dashboard',   group: 'رئيسي',     roles: ['supplier'] },
  { id: 's-inventory', label: 'إدارة المخزون',     icon: Package,         href: '/inventory-management', group: 'رئيسي',    roles: ['supplier'], badge: 3 },
  { id: 's-orders',    label: 'الطلبات الواردة',   icon: ShoppingCart,    href: '/supplier-orders',      group: 'رئيسي',    roles: ['supplier'], badge: 12 },
  { id: 's-finance',   label: 'الحسابات المالية',  icon: TrendingUp,      href: '/financials',           group: 'المالية',   roles: ['supplier'] },
  { id: 's-customers', label: 'المحلات والعملاء',  icon: Users,           href: '/stores-customers',     group: 'العمليات',  roles: ['supplier'] },
  { id: 's-delivery',  label: 'مناطق التوصيل',     icon: Truck,           href: '/delivery-zones',       group: 'العمليات',  roles: ['supplier'] },
  { id: 's-notif',     label: 'الإشعارات',         icon: Bell,            href: '/notifications',        group: 'أخرى',      roles: ['supplier'], badge: 5 },
  { id: 's-settings',  label: 'الدعم والإعدادات',  icon: Settings,        href: '/support-settings',     group: 'أخرى',      roles: ['supplier'] },

  /* ── المدير ──────────────────────────────────────────────── */
  { id: 'a-dashboard', label: 'لوحة التحكم',       icon: ShieldCheck,   href: '/admin-dashboard',    group: 'الإدارة',   roles: ['admin'], badge: 9 },
  { id: 'a-users',     label: 'المستخدمون والمحلات', icon: Users,        href: '/stores-customers',   group: 'الإدارة',   roles: ['admin'] },
  { id: 'a-orders',    label: 'جميع الطلبات',      icon: ShoppingCart,  href: '/orders',             group: 'الإدارة',   roles: ['admin'] },
  { id: 'a-reports',   label: 'التقارير المالية',  icon: BarChart2,     href: '/financials',         group: 'التقارير',  roles: ['admin'] },
  { id: 'a-inventory', label: 'المخزون والمنتجات', icon: Package,       href: '/inventory-management', group: 'التقارير', roles: ['admin'] },
  { id: 'a-notif',     label: 'الإشعارات',         icon: Bell,          href: '/notifications',      group: 'النظام',    roles: ['admin'], badge: 5 },
  { id: 'a-support',   label: 'الدعم الفني',       icon: HelpCircle,    href: '/support-settings',   group: 'النظام',    roles: ['admin'] },
  { id: 'a-settings',  label: 'الإعدادات',         icon: Settings,      href: '/support-settings',   group: 'النظام',    roles: ['admin'] },
];

/* ترتيب المجموعات حسب الدور */
const groupsByRole: Record<string, string[]> = {
  retailer: ['التسوق', 'الحساب'],
  supplier: ['رئيسي', 'المالية', 'العمليات', 'أخرى'],
  admin:    ['الإدارة', 'التقارير', 'النظام'],
};

const roleLabels: Record<string, string> = {
  admin:    'مدير النظام',
  supplier: 'مورد موثق',
  retailer: 'تاجر تجزئة',
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeRoute?: string;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse, activeRoute, onMobileClose }: SidebarProps) {
  const { user, role, signOut } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => {
    if (!activeRoute) return false;
    if (href === '/supplier-dashboard') return activeRoute === '/supplier-dashboard' || activeRoute === '/';
    return activeRoute?.startsWith(href);
  };

  const handleLogout = async () => {
    try { await signOut(); } catch {}
    router.push('/sign-up-login');
  };

  const displayName     = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المستخدم';
  const displayInitials = displayName.slice(0, 2);
  const displayRole     = role ? roleLabels[role] : 'زائر';

  const currentRole  = role || 'supplier';
  const groups       = groupsByRole[currentRole] || groupsByRole['supplier'];

  const visibleItems = (group: string) =>
    navItems.filter((item) => {
      if (item.group !== group) return false;
      if (!item.roles) return true;
      return item.roles.includes(currentRole);
    });

  return (
    <div
      className={`
        h-full bg-primary flex flex-col
        sidebar-transition overflow-hidden
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/10 ${collapsed ? 'justify-center p-3' : 'px-4 py-4 gap-3'}`}>
        <AppLogo size={36} />
        {!collapsed && (
          <div>
            <span className="font-arabic font-bold text-white text-lg leading-none">جُمْلَتِي</span>
            <p className="text-white/50 text-xs mt-0.5">{displayRole}</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        {groups.map((group) => {
          const groupItems = visibleItems(group);
          if (groupItems.length === 0) return null;
          return (
            <div key={`group-${group}`} className="mb-2">
              {!collapsed && (
                <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-4 py-2 font-arabic">
                  {group}
                </p>
              )}
              {groupItems.map((item) => {
                const Icon   = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 mx-2 mb-0.5 rounded-lg
                      transition-all duration-150 group relative
                      ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                      ${active
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-arabic text-sm font-medium">{item.label}</span>
                    )}
                    {!collapsed && item.badge && item.badge > 0 && (
                      <span className="mr-auto bg-warning text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center tabular-nums">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && item.badge > 0 && (
                      <span className="absolute top-1 left-1 bg-warning text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && (
                      <div className="absolute left-full mr-2 ml-2 bg-foreground text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-arabic">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {displayInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate font-arabic">{displayName}</p>
              <p className="text-white/50 text-xs truncate font-arabic">{displayRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/50 hover:text-white transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-1/2 -translate-y-1/2 bg-primary border border-white/20 rounded-full w-6 h-6 flex items-center justify-center text-white hover:bg-accent transition-colors shadow-md hidden lg:flex"
        aria-label="تصغير القائمة"
      >
        {collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </div>
  );
}