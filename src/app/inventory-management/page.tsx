import React from 'react';
import AppLayout from '@/components/AppLayout';
import InventoryContent from './components/InventoryContent';

export default function InventoryManagementPage() {
  return (
    <AppLayout activeRoute="/inventory-management">
      <InventoryContent />
    </AppLayout>
  );
}