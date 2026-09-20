'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminHubContent from '@/app/admin-hub/components/AdminHubContent';

export default function AdminDashboardPage() {
  return (
    <AppLayout activeRoute="/admin-hub">
      <AdminHubContent />
    </AppLayout>
  );
}
