'use client';
import AppLayout from '@/components/AppLayout';
import RetailerProfileContent from './components/RetailerProfileContent';

export default function RetailerProfilePage() {
  return (
    <AppLayout activeRoute="/retailer-profile">
      <RetailerProfileContent />
    </AppLayout>
  );
}
