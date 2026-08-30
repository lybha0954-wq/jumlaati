// src/app/admin-commissions/components/CommissionSummaryCards.tsx
'use client';

import { cn } from '@/lib/utils';

interface CommissionSummaryCardsProps {
  stats: {
    totalRequests: number;
    pendingRequests: number;
    totalCommissions: number;
    completedRequests: number;
    completionRate: number;
  };
  typeDistribution: Record<string, number>;
}

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  wholesale: { label: 'طلبات الجملة', icon: '🏪', color: 'from-blue-500 to-blue-600' },
  retailer: { label: 'طلبات المحلات', icon: '🛍️', color: 'from-emerald-500 to-emerald-600' },
  delivery: { label: 'طلبات التوصيل', icon: '🚚', color: 'from-purple-500 to-purple-600' },
  offer: { label: 'طلبات العروض', icon: '🎯', color: 'from-amber-500 to-amber-600' },
  nearby: { label: 'طلبات الجملة القريبة', icon: '📍', color: 'from-rose-500 to-rose-600' },
};

export default function CommissionSummaryCards({ stats, typeDistribution }: CommissionSummaryCardsProps) {
  const mainCards = [
    {
      label: 'إجمالي الطلبات',
      value: stats.totalRequests.toString(),
      icon: '📋',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'طلبات معلقة',
      value: stats.pendingRequests.toString(),
      icon: '⏳',
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'إجمالي العمولات',
      value: `${stats.totalCommissions.toFixed(2)} د.ع`,
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'نسبة الإنجاز',
      value: `${stats.completionRate.toFixed(1)}%`,
      icon: '✅',
      color: 'from-teal-500 to-teal-600',
      sub: `${stats.completedRequests} مكتملة من ${stats.totalRequests}`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* البطاقات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                {card.sub && (
                  <p className="text-xs opacity-80 mt-1">{card.sub}</p>
                )}
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* توزيع الطلبات حسب النوع */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(typeDistribution).map(([type, count]) => {
          const config = TYPE_LABELS[type] || { label: type, icon: '📦', color: 'from-gray-500 to-gray-600' };
          return (
            <div
              key={type}
              className={`bg-gradient-to-br ${config.color} text-white p-4 rounded-xl shadow-md`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <p className="text-xs opacity-90">{config.label}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
