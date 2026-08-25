'use client';
import AppLayout from '@/components/AppLayout';
import RetailerOrdersContent from './components/RetailerOrdersContent';

export default function RetailerOrdersPage() {
  return (
    <AppLayout activeRoute="/retailer-orders">
      <RetailerOrdersContent />
    </AppLayout>
  );
}
