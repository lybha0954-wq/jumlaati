'use client';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

const titles: Record<string, string> = {
  '/supplier/dashboard': 'لوحة التحكم',
  '/supplier/catalog': 'الكتالوج',
  '/supplier/inventory': 'المخزون',
  '/supplier/orders': 'الطلبات',
  '/supplier/finance': 'المالية',
  '/supplier/relationships': 'العلاقات',
  '/supplier/chat': 'المحادثات',
  '/supplier/settings': 'الإعدادات',
};
export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AppLayout title={titles[pathname] || 'لوحة التحكم'}>{children}</AppLayout>;
}
