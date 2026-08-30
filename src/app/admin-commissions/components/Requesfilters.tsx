// src/app/admin-commissions/components/RequestsFilters.tsx
'use client';

interface RequestsFiltersProps {
  filters: { type: string; status: string; dateRange: string };
  setFilters: (filters: { type: string; status: string; dateRange: string }) => void;
}

export default function RequestsFilters({ filters, setFilters }: RequestsFiltersProps) {
  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'wholesale', label: '🏪 جملة' },
    { value: 'retailer', label: '🛍️ محل/سوبرماركت' },
    { value: 'delivery', label: '🚚 توصيل' },
    { value: 'offer', label: '🎯 عرض منتجات' },
    { value: 'nearby', label: '📍 جملة قريبة' },
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: '⏳ قيد الانتظار' },
    { value: 'approved', label: '✅ مقبولة' },
    { value: 'completed', label: '✔️ مكتملة' },
    { value: 'rejected', label: '
