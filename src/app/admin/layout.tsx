'use client';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
const titles: Record<string, string> = {
  '/admin/dashboard': 'لوحة التحكم العامة',
  '/admin/reports': 'التقارير',
  '/admin/users': 'المستخدمون',
  '/admin/settings': 'الإعدادات العامة',
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AppLayout title={titles[pathname] || 'الإدارة'}>{children}</AppLayout>;
}
