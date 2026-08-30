'use client';
import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

const notifications = [
  { id: 'notif-001', text: 'طلب جديد #ORD-2847 من محل الأمانة', time: 'منذ 3 دقائق', unread: true },
  { id: 'notif-002', text: 'مخزون شيبس ليز منخفض — 12 كرتون فقط', time: 'منذ 18 دقيقة', unread: true },
  { id: 'notif-003', text: 'تم تأكيد دفع محل الفرات — 450,000 د.ع', time: 'منذ ساعة', unread: true },
  { id: 'notif-004', text: 'طلب #ORD-2839 تم تسليمه بنجاح', time: 'منذ 3 ساعات', unread: false },
  { id: 'notif-005', text: 'عميل جديد: محل النجوم — بغداد/الكرادة', time: 'منذ 5 ساعات', unread: false },
];

const routeTitles: Record<string, string> = {
  '/admin-dashboard':          'لوحة المدير',
  '/admin-users':              'إدارة الحسابات',
  '/admin-commissions':        'العمولات',
  '/admin-analytics':          'التحليلات',
  '/admin-support':            'الدعم الفني',
  '/admin-settings':           'الإعدادات',
  '/orders-routing':           'توجيه الطلبات',
  '/supplier-dashboard':       'لوحة المورد',
  '/supplier-inventory':       'إدارة المخزون',
  '/supplier-orders':          'الطلبات الواردة',
  '/supplier-analytics':       'التحليلات',
  '/supplier-settings':        'الإعدادات',
  '/supplier-support':         'الدعم الفني',
  '/retailer-dashboard':       'الرئيسية',
  '/retailer-cart':            'سلة التسوق',
  '/retailer-orders':          'طلباتي',
  '/retailer-profile':         'حسابي',
  '/retailer-settings':        'الإعدادات',
  '/retailer-support':         'الدعم الفني',
  '/delivery-dashboard':       'لوحة التوصيل',
  '/delivery-tasks':           'المهام الحالية',
  '/delivery-history':         'سجل التوصيل',
  '/delivery-earnings':        'أرباحي',
  '/delivery-profile':         'الملف الشخصي',
  '/delivery-settings':        'الإعدادات',
};

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(notifications);
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const unreadCount = unreadNotifs.filter((n) => n.unread).length;

  const handleLogout = async () => {
    setProfileOpen(false);
    try { await signOut(); } catch {}
    router.push('/sign-up-login');
  };

  const markAllRead = () => {
    setUnreadNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المستخدم';
  const initials = displayName
    .trim()
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('');

  // ⚠️ تم تحديث roleLabel ليدعم دور التوصيل
  const roleLabel = role === 'admin' ? 'مدير النظام' : role === 'supplier' ? 'مجهز / جملة' : role === 'delivery' ? 'سائق توصيل' : 'صاحب محل';
  const roleBadgeColor = role === 'admin' ?'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
    : role === 'supplier' ?'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
    : role === 'delivery'?'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';

  // Resolve screen title from pathname
  const screenTitle = Object.entries(routeTitles).find(([key]) => pathname?.startsWith(key))?.[1] ?? 'جُمْلَتِي';

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-topbar-dropdown]')) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center justify-between px-4 gap-3"
      style={{ boxShadow: 'var(--shadow-sm)' }}
      dir="rtl"
    >
      {/* RIGHT: Screen title / App name */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Mobile logo mark */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold font-arabic">ج</span>
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="font-arabic font-bold text-foreground text-sm sm:text-base truncate leading-tight">
            {screenTitle}
          </h1>
          {role && (
            <span className={`hidden sm:inline-block text-[10px] font-arabic font-semibold px-1.5 py-0.5 rounded-md ${roleBadgeColor}`}>
              {roleLabel}
            </span>
          )}
        </div>
      </div>

      {/* LEFT: Dark mode + Notifications + Avatar — no overlap */}
      <div className="flex items-center gap-1 flex-shrink-0">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <div className="relative" data-topbar-dropdown>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="الإشعارات"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-danger text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-card border border-border rounded-xl z-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="font-arabic font-bold text-sm text-foreground">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-arabic">{unreadCount} غير مقروءة</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-accent font-arabic hover:underline">
                      قراءة الكل
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {unreadNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer ${n.unread ? 'bg-accent/5' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={n.unread ? '' : 'pr-4'}>
                        <p className="text-sm font-arabic text-foreground leading-relaxed">{n.text}</p>
                        <p className="text-xs text-muted-foreground font-arabic mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center border-t border-border bg-muted/20">
                <Link
                  href="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-accent font-arabic font-semibold hover:underline"
                >
                  عرض جميع الإشعارات ←
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative" data-topbar-dropdown>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-1.5 p-1 pr-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="الملف الشخصي"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              {initials || 'م'}
            </div>
            <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-card border border-border rounded-xl z-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-sm font-bold text-foreground font-arabic truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground font-arabic truncate mt-0.5">{user?.email}</p>
                {role && (
                  <span className={`inline-block mt-1.5 text-[10px] font-arabic font-semibold px-1.5 py-0.5 rounded-md ${roleBadgeColor}`}>
                    {roleLabel}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-arabic text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={14} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
'use client';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

// داخل المكون
const { profile } = useAuth(); // افترض أن AuthContext يوفر بيانات الملف الشخصي

{profile?.avatar_url ? (
  <Image 
    src={profile.avatar_url} 
    alt="صورة المستخدم" 
    width={40} 
    height={40} 
    className="rounded-full border-2 border-white"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
    👤
  </div>
)}
