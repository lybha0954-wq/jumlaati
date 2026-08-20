'use client';
import AppLayout from '@/components/AppLayout';
import AdminUsersContent from './components/AdminUsersContent';

export default function AdminUsersPage() {
  return (
    <AppLayout activeRoute="/admin-users">
      <AdminUsersContent />
    </AppLayout>
  );
}
