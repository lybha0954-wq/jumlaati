'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { status: 'جديد', count: 12, color: '#3B82F6' },
  { status: 'مقبول', count: 8, color: '#6366F1' },
  { status: 'قيد التجهيز', count: 7, color: '#F59E0B' },
  { status: 'خرج للتوصيل', count: 5, color: '#8B5CF6' },
  { status: 'مُسلَّم', count: 18, color: '#10B981' },
  { status: 'ملغي', count: 2, color: '#EF4444' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-xl p-3 font-arabic">
        <p className="text-sm font-bold text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">
          عدد الطلبات: <span className="text-foreground font-semibold tabular-nums">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrderStatusBarChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 card-hover h-full">
      <div className="mb-4">
        <h3 className="font-arabic font-semibold text-base text-foreground">توزيع الطلبات حسب الحالة</h3>
        <p className="text-xs text-muted-foreground font-arabic mt-0.5">إجمالي اليوم: 52 طلب</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'Tajawal' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-status-${index + 1}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}