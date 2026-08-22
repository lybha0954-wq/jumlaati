'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProductBrowseContent from './components/ProductBrowseContent';

export default function ProductBrowsePage() {
  return (
    <AppLayout activeRoute="/product-browse">
      <ProductBrowseContent />
    </AppLayout>
  );
}
