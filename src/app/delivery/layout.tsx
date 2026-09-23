'use client';

import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

const titles: Record<string, string> = {
  '/delivery/tasks': 'مهامي',
  '/delivery/history': 'سجل التوصيلات',
  '/delivery/earnings': 'أرباحي',
  '/delivery/profile': 'حسابي',
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] || 'مهامي';
  return <AppLayout title={title}>{children}</AppLayout>;
}
