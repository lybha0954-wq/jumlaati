import React from 'react';

type OrderStatus = 'جديد' | 'مقبول' | 'قيد التجهيز' | 'خرج للتوصيل' | 'مُسلَّم' | 'ملغي';
type StockStatus = 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
type PaymentStatus = 'مدفوع' | 'آجل' | 'جزئي' | 'متأخر';

type BadgeVariant = OrderStatus | StockStatus | PaymentStatus | string;

const variantMap: Record<string, string> = {
  'جديد': 'bg-blue-100 text-blue-700 border-blue-200',
  'مقبول': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'قيد التجهيز': 'bg-amber-100 text-amber-700 border-amber-200',
  'خرج للتوصيل': 'bg-purple-100 text-purple-700 border-purple-200',
  'مُسلَّم': 'bg-green-100 text-green-700 border-green-200',
  'ملغي': 'bg-red-100 text-red-700 border-red-200',
  'متوفر': 'bg-green-100 text-green-700 border-green-200',
  'منخفض': 'bg-amber-100 text-amber-700 border-amber-200',
  'نفد': 'bg-red-100 text-red-700 border-red-200',
  'موقوف': 'bg-slate-100 text-slate-600 border-slate-200',
  'مدفوع': 'bg-green-100 text-green-700 border-green-200',
  'آجل': 'bg-blue-100 text-blue-700 border-blue-200',
  'جزئي': 'bg-amber-100 text-amber-700 border-amber-200',
  'متأخر': 'bg-red-100 text-red-700 border-red-200',
};

interface StatusBadgeProps {
  status: BadgeVariant;
  size?: 'sm' | 'md';
}

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