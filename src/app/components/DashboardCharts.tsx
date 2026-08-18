'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const RevenueAreaChart = dynamic(() => import('./RevenueAreaChart'), { ssr: false });
const OrderStatusBarChart = dynamic(() => import('./OrderStatusBarChart'), { ssr: false });

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2">
        <RevenueAreaChart />
      </div>
      <div className="xl:col-span-1">
        <OrderStatusBarChart />
      </div>
    </div>
  );
}