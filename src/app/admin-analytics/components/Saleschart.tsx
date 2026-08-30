'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface SalesChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  // تنسيق الأرقام باللغة العربية
  const formatCurrency = (value: number) => `${value.toFixed(0)} ريال`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tickFormatter={formatCurrency} />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip formatter={(value, name) => {
          if (name === 'الإيرادات') return `${value.toFixed(2)} ريال`;
          return value;
        }} />
        <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="الإيرادات" />
        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" name="عدد الطلبات" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
