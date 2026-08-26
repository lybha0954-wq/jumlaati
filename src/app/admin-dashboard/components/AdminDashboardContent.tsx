'use client';
import React, { useState } from 'react';
import AdminKPIRow from './AdminKPIRow';
import PendingApprovals from './PendingApprovals';
import AdminAnnouncements from './AdminAnnouncements';
import SupportTickets from './SupportTickets';

export default function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'retailers'>('suppliers');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">لوحة مدير النظام</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            الإثنين، 4 أغسطس 2026 — إدارة المنصة والمستخدمين
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-accent font-arabic bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-semibold">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          مدير النظام
        </span>
      </div>

      {/* KPI Row */}
      <AdminKPIRow />

      {/* Pending Approvals */}
      <PendingApprovals activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Bottom Row: Announcements + Support Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminAnnouncements />
        <SupportTickets />
      </div>
    </div>
  );
}
