'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import RetailerShopContent from './components/RetailerShopContent';

export default function RetailerShopPage() {
  return (
    <AppLayout activeRoute="/retailer-shop">
      <RetailerShopContent />
    </AppLayout>
  );
}
