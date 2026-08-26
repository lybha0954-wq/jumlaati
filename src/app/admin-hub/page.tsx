'use client';
import AppLayout from '../../components/AppLayout';
import AdminHubContent from './components/AdminHubContent';

export default function AdminHubPage() {
  return (
    <AppLayout activeRoute="/admin-hub">
      <AdminHubContent />
    </AppLayout>
  );
}
