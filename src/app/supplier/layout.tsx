'use client';

import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

const titles: Record<string, string> = {
  '/supplier/dashboard': 'لوحة المورد',
  '/supplier/products': 'المنتجات',
  '/supplier/inventory': 'المخزون',
  '/supplier/orders': 'الطلبات',
  '/supplier/relationships': 'المحلات والعملاء',
  '/supplier/finance': 'المالية',
  '/supplier/settings': 'الإعدادات',
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] || 'لوحة المورد';
  return <AppLayout title={title}>{children}</AppLayout>;
}
