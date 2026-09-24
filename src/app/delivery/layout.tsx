'use client';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
const titles: Record<string, string> = {
  '/delivery/tasks': 'المهام الحالية',
  '/delivery/earnings': 'الأرباح',
  '/delivery/history': 'سجل التوصيلات',
  '/delivery/profile': 'حسابي',
};
export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AppLayout title={titles[pathname] || 'المهام'}>{children}</AppLayout>;
}
