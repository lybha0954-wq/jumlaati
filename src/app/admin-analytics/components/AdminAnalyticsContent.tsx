// src/app/admin-analytics/components/AdminAnalyticsContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import QuickStatsCards from './QuickStatsCards';
import TransactionsTable from './TransactionsTable';
import TransactionFilters from './TransactionFilters';
import StatusPieChart from './StatusPieChart';

interface AnalyticsData {
  stats: {
    totalRevenue: number;
    totalCommission: number;
    totalOrders: number;
    completedOrders: number;
    completionRate: number;
  };
  transactions: any[];
  statusDistribution: Record<string, number>;
}

interface AdminAnalyticsContentProps {
  initialData: AnalyticsData;
}

export default function AdminAnalyticsContent({ initialData }: AdminAnalyticsContentProps) {
  const [data, setData] = useState(initialData);
  const [filteredTransactions, setFilteredTransactions] = useState(initialData.transactions);
  const [filters, setFilters] = useState({ status: 'all', dateRange: 'all' });

  // تحديث فوري عند إضافة معاملة جديدة
  useRealtimeSubscription({
    table: 'transactions',
    filter: null,
    onInsert: (payload) => {
      // تحديث الإحصائيات
      setData(prev => {
        const newStats = { ...prev.stats };
        newStats.totalRevenue += payload.new.total_amount;
        newStats.totalOrders += 1;
        if (payload.new.status === 'completed') {
          newStats.completedOrders += 1;
        }
        newStats.completionRate = (newStats.completedOrders / newStats.totalOrders) * 100;

        // تحديث توزيع الحالات
        const newDistribution = { ...prev.statusDistribution };
        newDistribution[payload.new.status] = (newDistribution[payload.new.status] || 0) + 1;

        return {
          stats: newStats,
          transactions: [payload.new, ...prev.transactions],
          statusDistribution: newDistribution,
        };
      });
    },
    onUpdate: (payload) => {
      // تحديث عند تغيير حالة معاملة
      setData(prev => {
        const updatedTransactions = prev.transactions.map(t =>
          t.id === payload.new.id ? { ...t, ...payload.new } : t
        );
        // إعادة حساب التوزيع
        const newDistribution = updatedTransactions.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          ...prev,
          transactions: updatedTransactions,
          statusDistribution: newDistribution,
        };
      });
    },
  });

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = [...initialData.transactions];

    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const ranges: Record<string, number> = {
        'today': 1,
        'week': 7,
        'month': 30,
        'quarter': 90,
        'year': 365,
      };
      const days = ranges[filters.dateRange];
      if (days) {
        const cutoff = new Date(now.setDate(now.getDate() - days));
        filtered = filtered.filter(t => new Date(t.created_at) >= cutoff);
      }
    }

    setFilteredTransactions(filtered);
  }, [filters, initialData.transactions]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📊 سجل المعاملات المالية
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          آخر تحديث: {new Date().toLocaleTimeString('ar-IQ')}
        </span>
      </div>

      {/* البطاقات الإحصائية */}
      <QuickStatsCards stats={data.stats} />

      {/* الرسم الدائري + الفلاتر */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StatusPieChart distribution={data.statusDistribution} />
        </div>
        <div className="lg:col-span-2">
          <TransactionFilters filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* جدول المعاملات */}
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
}
