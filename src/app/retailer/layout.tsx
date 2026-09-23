'use client';

import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

const titles: Record<string, string> = {
  '/retailer/home': 'الرئيسية',
  '/retailer/catalog': 'الكتالوج',
  '/retailer/cart': 'السلة',
  '/retailer/checkout': 'إتمام الطلب',
  '/retailer/orders': 'طلباتي',
  '/retailer/ledger': 'كشف الحساب',
  '/retailer/profile': 'حسابي',
};

export default function RetailerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] || 'الرئيسية';
  return <AppLayout title={title}>{children}</AppLayout>;
}
