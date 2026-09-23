'use client';

import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

const titles: Record<string, string> = {
  '/admin/dashboard': 'لوحة التحكم',
  '/admin/users': 'إدارة المستخدمين',
  '/admin/products': 'المنتجات',
  '/admin/orders': 'جميع الطلبات',
  '/admin/financials': 'التقارير المالية',
  '/admin/reports': 'التقارير',
  '/admin/support': 'الدعم الفني',
  '/admin/settings': 'الإعدادات',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] || 'لوحة التحكم';
  return <AppLayout title={title}>{children}</AppLayout>;
}
