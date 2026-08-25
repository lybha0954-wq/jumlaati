'use client';
import AppLayout from '@/components/AppLayout';
import SupplierFinanceContent from './components/SupplierFinanceContent';

export default function SupplierFinancePage() {
  return (
    <AppLayout activeRoute="/supplier-finance">
      <SupplierFinanceContent />
    </AppLayout>
  );
}
