// src/app/admin-analytics/components/StatusPieChart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusPieChartProps {
  distribution: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', // برتقالي
  completed: '#10B981', // زمردي
  failed: '#EF4444', // أحمر
  refunded: '#8B5CF6', // بنفسجي
  cancelled: '#6B7280', // رمادي
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  completed: 'مكتملة',
  failed: 'فاشلة',
  refunded: 'مسترجعة',
  cancelled: 'ملغية',
};

export default function StatusPieChart({ distribution }: StatusPieChartProps) {
  const data = Object.entries(distribution)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      status,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-[320px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">لا توجد معاملات لعرضها</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        توزيع المعاملات حسب الحالة
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] || '#9CA3AF'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} معاملة`, 'العدد']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              direction: 'rtl',
            }}
          />
          <Legend
            layout="vertical"
            align="left"
            verticalAlign="middle"
            formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
