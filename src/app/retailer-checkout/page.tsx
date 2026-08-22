'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import RetailerCheckoutContent from './components/RetailerCheckoutContent';

export default function RetailerCheckoutPage() {
  return (
    <AppLayout activeRoute="/retailer-checkout">
      <RetailerCheckoutContent />
    </AppLayout>
  );
}
