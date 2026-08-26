'use client';
import AppLayout from '@/components/AppLayout';
import SupplierDashboardContent from './components/SupplierDashboardContent';

export default function SupplierDashboardPage() {
  return (
    <AppLayout activeRoute="/supplier-dashboard">
      <SupplierDashboardContent />
    </AppLayout>
  );
}
