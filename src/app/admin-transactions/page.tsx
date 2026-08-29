'use client';
import AppLayout from '@/components/AppLayout';
import AdminTransactionsContent from './components/AdminTransactionsContent';

export default function AdminTransactionsPage() {
  return (
    <AppLayout activeRoute="/admin-transactions">
      <AdminTransactionsContent />
    </AppLayout>
  );
}
