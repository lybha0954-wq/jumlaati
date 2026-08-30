// src/app/admin-analytics/components/QuickStatsCards.tsx
'use client';

interface QuickStatsCardsProps {
  stats: {
    totalRevenue: number;
    totalCommission: number;
    totalOrders: number;
    completedOrders: number;
    completionRate: number;
  };
}

export default function QuickStatsCards({ stats }: QuickStatsCardsProps) {
  const cards = [
    {
      label: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue.toFixed(2)} د.ع`,
      icon: '💰',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'عمولة المنصة',
      value: `${stats.totalCommission.toFixed(2)} د.ع`,
      icon: '🏦',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'إجمالي المعاملات',
      value: stats.totalOrders.toString(),
      icon: '📦',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'نسبة الإنجاز',
      value: `${stats.completionRate.toFixed(1)}%`,
      icon: '✅',
      color: 'from-amber-500 to-amber-600',
      sub: `${stats.completedOrders} مكتملة من ${stats.totalOrders}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
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
  );
}
