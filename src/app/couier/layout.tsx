'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map, ListTodo, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { name: 'لوحة التحكم', href: '/courier/dashboard', icon: LayoutDashboard },
  { name: 'الخريطة', href: '/courier/map', icon: Map },
  { name: 'المهام', href: '/courier/tasks', icon: ListTodo },
];

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <aside className="w-64 h-screen fixed bg-slate-900 border-l border-slate-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-cyan-400">لوحة الموصل</h1>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            signOut();
            router.push('/login');
          }}
          className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <LogOut size={20} />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
