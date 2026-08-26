'use client';
import React, { useState, useEffect } from 'react';
import KPIBentoGrid from './KPIBentoGrid';
import DashboardCharts from './DashboardCharts';
import RecentOrdersTable from './RecentOrdersTable';
import LowStockAlerts from './LowStockAlerts';
import TopProductsPanel from './TopProductsPanel';

export default function DashboardContent() {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateStr(now?.toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setTimeStr(now?.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            {dateStr} {timeStr && `— آخر تحديث: ${timeStr}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-accent font-arabic bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-semibold">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            مباشر
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <KPIBentoGrid />

      {/* Charts row */}
      <DashboardCharts />

      {/* Bottom row: orders table + panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentOrdersTable />
        </div>
        <div className="flex flex-col gap-6">
          <LowStockAlerts />
          <TopProductsPanel />
        </div>
      </div>
    </div>
  );
}