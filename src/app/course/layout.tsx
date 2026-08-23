'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, ListTodo } from 'lucide-react';

const menuItems = [
  { name: 'لوحة التحكم', href: '/course/dashboard', icon: LayoutDashboard },
  { name: 'الخريطة', href: '/course/map', icon: Map },
  { name: 'المهام', href: '/course/tasks', icon: ListTodo },
];

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <aside className="w-64 h-screen fixed bg-slate-900 border-l border-slate-800 p-4">
        <h1 className="text-xl font-bold mb-8 text-cyan-400">لوحة الموصل</h1>
        <nav className="space-y-2">
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
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
