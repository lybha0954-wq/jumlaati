import React from 'react';

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon?: string;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard = ({ title, value, icon, trend, trendUp }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value ?? '—'}</div>
      {trend && (
        <div className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? '▲' : '▼'} {trend}
        </div>
      )}
    </div>
  );
};

export { StatsCard };
