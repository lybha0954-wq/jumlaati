'use client';
import AppLayout from '@/components/AppLayout';
import SupplierCatalogContent from './components/SupplierCatalogContent';

export default function SupplierCatalogPage() {
  return (
    <AppLayout activeRoute="/supplier-catalog">
      <SupplierCatalogContent />
    </AppLayout>
  );
}
