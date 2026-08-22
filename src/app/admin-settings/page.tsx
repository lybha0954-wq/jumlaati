'use client';
import AppLayout from '@/components/AppLayout';
import AdminSettingsContent from './components/AdminSettingsContent';

export default function AdminSettingsPage() {
  return (
    <AppLayout activeRoute="/admin-settings">
      <AdminSettingsContent />
    </AppLayout>
  );
}
