'use client';
import AppLayout from '@/components/AppLayout';
import SupplierIncomingOrdersContent from './components/SupplierIncomingOrdersContent';

export default function SupplierIncomingOrdersPage() {
  return (
    <AppLayout activeRoute="/supplier-incoming-orders">
      <SupplierIncomingOrdersContent />
    </AppLayout>
  );
}
