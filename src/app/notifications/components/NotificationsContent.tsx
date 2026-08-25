'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';

type NotifRoleType = 'admin' | 'supplier' | 'retailer';

export default function NotificationsContent() {
  const { role } = useAuth();
  const notifRole: NotifRoleType = (role === 'admin' || role === 'supplier' || role === 'retailer') ? role : 'retailer';
  return <UnifiedNotificationCenter role={notifRole} />;
}
