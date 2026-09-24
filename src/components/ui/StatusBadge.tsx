import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const variantMap: Record<string, string> = {
  'جديد': 'bg-blue-100 text-blue-700 border-blue-200',
  'قيد المراجعة': 'bg-amber-100 text-amber-700 border-amber-200',
  'قيد التجهيز': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'قيد التوصيل': 'bg-violet-100 text-violet-700 border-violet-200',
  'تم التوصيل': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'مكتمل': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ملغي': 'bg-red-100 text-red-700 border-red-200',
  'مرفوض': 'bg-red-100 text-red-700 border-red-200',
  'متوفر': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'منخفض': 'bg-amber-100 text-amber-700 border-amber-200',
  'نفد': 'bg-red-100 text-red-700 border-red-200',
  'موقوف': 'bg-slate-100 text-slate-600 border-slate-200',
  'مدفوع': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'غير مدفوع': 'bg-red-100 text-red-700 border-red-200',
  'جزئي': 'bg-amber-100 text-amber-700 border-amber-200',
  'متأخر': 'bg-red-100 text-red-700 border-red-200',
  'نشط': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'مجمّد': 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const classes = variantMap[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={`
        inline-flex items-center border rounded-full font-arabic font-semibold
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}
        ${classes}
      `}
    >
      {status}
    </span>
  );
}
