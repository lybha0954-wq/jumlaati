'use client';
import AppLayout from '@/components/AppLayout';
import RetailerHomeContent from './components/RetailerHomeContent';

export default function RetailerHomePage() {
  return (
    <AppLayout activeRoute="/retailer-home">
      <RetailerHomeContent />
    </AppLayout>
  );
}
