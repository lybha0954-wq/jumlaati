'use client';
import AppLayout from '@/components/AppLayout';
import RetailerCatalogContent from './components/RetailerCatalogContent';

export default function RetailerCatalogPage() {
  return (
    <AppLayout activeRoute="/retailer-catalog">
      <RetailerCatalogContent />
    </AppLayout>
  );
}
