'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'الجمعة', revenue: 1420000, orders: 28 },
  { day: 'السبت', revenue: 1850000, orders: 37 },
  { day: 'الأحد', revenue: 1320000, orders: 24 },
  { day: 'الاثنين', revenue: 2100000, orders: 42 },
  { day: 'الثلاثاء', revenue: 1680000, orders: 31 },
  { day: 'الأربعاء', revenue: 1950000, orders: 39 },
  { day: 'اليوم', revenue: 2247500, orders: 34 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-xl p-3 font-arabic">
        <p className="text-sm font-bold text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">
          الإيراد:{' '}
          <span className="text-primary font-semibold tabular-nums">
            {payload[0].value.toLocaleString('ar-IQ')} د.ع
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueAreaChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-arabic font-semibold text-base text-foreground">إيراد آخر 7 أيام</h3>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">بالدينار العراقي (د.ع)</p>
        </div>
        <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg px-2.5 py-1 font-arabic font-semibold">
          +18.4% ↑
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'Tajawal' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}م`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={{ fill: 'var(--primary)', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: 'var(--primary)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}