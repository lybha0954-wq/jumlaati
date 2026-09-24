'use client';

import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface TopbarProps {
  title: string;
  role?: string;
}

export default function Topbar({ title, role }: TopbarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'المستخدم';
  const initials = displayName.trim().split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {}
    router.push('/login');
  };

  const roleLabels: Record<string, string> = {
    admin: 'مدير النظام',
    supplier: 'تاجر جملة',
    retailer: 'صاحب محل',
    delivery: 'مندوب توصيل',
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center justify-between px-4 gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="lg:hidden w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold font-arabic">ج</span>
        </div>
        <h1 className="font-arabic font-bold text-foreground text-sm sm:text-base truncate">
          {title}
        </h1>
        {role && (
          <span className="hidden sm:inline-block text-[10px] font-arabic font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
            {roleLabels[role] || role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          aria-label="تبديل الثيم"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <Bell size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm"
          >
            {initials || 'م'}
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-sm font-bold text-foreground font-arabic truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground font-arabic truncate mt-0.5">{user?.email}</p>
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
