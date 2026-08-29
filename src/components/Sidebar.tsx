'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, Settings, ChevronRight, ChevronLeft, LogOut, Bell, Truck, HelpCircle, Store, ShoppingBag, ShieldCheck, Wallet, UserCircle, BarChart2, ClipboardList, Search, Home, History, DollarSign, Map } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
   هيكل التنقل الجديد حسب الواجهات المضافة في الصور
═══════════════════════════════════════════════════════════════ */
const navItems: NavItem[] = [

  /* ── صاحب المحل / سوبر ماركت (Retailer) ─────────────────── */
  { id: 'r-dashboard', label: 'الرئيسية',          icon: LayoutDashboard, href: '/retailer-dashboard',   group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-cart',      label: 'سلة التسوق',        icon: ShoppingBag,     href: '/retailer-cart',       group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-orders',    label: 'طلباتي',            icon: ClipboardList,   href: '/retailer-orders',     group: 'التسوق',    roles: ['retailer'] },
  { id: 'r-profile',   label: 'الملف الشخصي',      icon: UserCircle,      href: '/retailer-profile',   group: 'الحساب',    roles: ['retailer'] },
  { id: 'r-settings',  label: 'الإعدادات',         icon: Settings,        href: '/retailer-settings',  group: 'الحساب',    roles: ['retailer'] },
  { id: 'r-support',   label: 'الدعم الفني',       icon: HelpCircle,      href: '/retailer-support',   group: 'الحساب',    roles: ['retailer'] },

  /* ── المجهز / الجملة (Supplier) ─────────────────────────── */
  { id: 's-dashboard', label: 'لوحة التحكم',       icon: LayoutDashboard, href: '/supplier-dashboard',  group: 'رئيسي',     roles: ['supplier'] },
  { id: 's-orders',    label: 'الطلبات',           icon: ShoppingCart,    href: '/supplier-orders',     group: 'رئيسي',     roles: ['supplier'], badge: 12 },
  { id: 's-inventory', label: 'المخزون',           icon: Package,         href: '/supplier-inventory',  group: 'رئيسي',     roles: ['supplier'], badge: 3 },
  { id: 's-analytics', label: 'التحليلات',         icon: BarChart2,       href: '/supplier-analytics',  group: 'المالية',   roles: ['supplier'] },
  { id: 's-settings',  label: 'الإعدادات',         icon: Settings,        href: '/supplier-settings',   group: 'المالية',   roles: ['supplier'] },
  { id: 's-support',   label: 'الدعم الفني',       icon: HelpCircle,      href: '/supplier-support',    group: 'المالية',   roles: ['supplier'] },

  /* ── سائق التوصيل (Delivery) ─────────────────────────────── */
  { id: 'd-dashboard', label: 'الرئيسية',          icon: Home,            href: '/delivery-dashboard',  group: 'مهامي',     roles: ['delivery'] },
  { id: 'd-tasks',     label: 'المهام الحالية',    icon: ClipboardList,   href: '/delivery-tasks',      group: 'مهامي',     roles: ['delivery'], badge: 5 },
  { id: 'd-history',   label: 'سجل التوصيل',       icon: History,         href: '/delivery-history',    group: 'مهامي',     roles: ['delivery'] },
  { id: 'd-earnings',  label: 'أرباحي',            icon: DollarSign,      href: '/delivery-earnings',   group: 'الحساب',    roles: ['delivery'] },
  { id: 'd-profile',   label: 'الملف الشخصي',      icon: UserCircle,      href: '/delivery-profile',    group: 'الحساب',    roles: ['delivery'] },
  { id: 'd-settings',  label: 'الإعدادات',         icon: Settings,        href: '/delivery-settings',   group: 'الحساب',    roles: ['delivery'] },

  /* ── المدير (Admin) ──────────────────────────────────────── */
  { id: 'a-dashboard', label: 'لوحة التحكم',       icon: ShieldCheck,    href: '/admin-dashboard',     group: 'الإدارة',   roles: ['admin'], badge: 9 },
  { id: 'a-users',     label: 'المستخدمون',        icon: Users,           href: '/admin-users',         group: 'الإدارة',   roles: ['admin'] },
  { id: 'a-orders',    label: 'توجيه الطلبات',     icon: Map,             href: '/orders-routing',      group: 'الإدارة',   roles: ['admin'] },
  { id: 'a-commissions', label: 'العمولات',        icon: Wallet,          href: '/admin-commissions',   group: 'التقارير',  roles: ['admin'] },
  { id: 'a-analytics', label: 'التحليلات',         icon: TrendingUp,      href: '/admin-analytics',     group: 'التقارير',  roles: ['admin'] },
  { id: 'a-support',   label: 'الدعم الفني',       icon: HelpCircle,      href: '/admin-support',       group: 'النظام',    roles: ['admin'] },
  { id: 'a-settings',  label: 'الإعدادات',         icon: Settings,        href: '/admin-settings',      group: 'النظام',    roles: ['admin'] },
];

/* ترتيب المجموعات حسب الدور */
const groupsByRole: Record<string, string[]> = {
  retailer: ['التسوق', 'الحساب'],
  supplier: ['رئيسي', 'المالية'],
  delivery: ['مهامي', 'الحساب'],
  admin:    ['الإدارة', 'التقارير', 'النظام'],
};

const roleLabels: Record<string, string> = {
  admin:    'مدير النظام',
  supplier: 'مجهز / جملة',
  retailer: 'صاحب محل',
  delivery: 'سائق توصيل',
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
    if (href === '/supplier-dashboard' || href === '/retailer-dashboard' || href === '/delivery-dashboard' || href === '/admin-dashboard') return activeRoute === href;
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
