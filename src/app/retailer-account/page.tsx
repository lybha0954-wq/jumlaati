'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import RetailerAccountContent from './components/RetailerAccountContent';
import { usePathname } from 'next/navigation';

export default function RetailerAccountPage() {
  const pathname = usePathname();
  return (
    <AppLayout activeRoute={pathname}>
      <RetailerAccountContent />
    </AppLayout>
  );
}
