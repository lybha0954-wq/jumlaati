'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';
import type { NotifRole } from '@/components/UnifiedNotificationCenter';

export default function NotificationsContent() {
  const { role } = useAuth();
  const notifRole: NotifRole = (role === 'admin' || role === 'supplier' || role === 'retailer') ? role : 'retailer';
  return <UnifiedNotificationCenter role={notifRole} />;
}
