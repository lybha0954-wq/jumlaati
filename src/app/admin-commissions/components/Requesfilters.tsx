// src/app/admin-commissions/components/RequestsFilters.tsx
'use client';

interface RequestsFiltersProps {
  filters: { type: string; status: string; dateRange: string };
  setFilters: (filters: { type: string; status: string; dateRange: string }) => void;
}

export default function RequestsFilters({ filters, setFilters }: RequestsFiltersProps) {
  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'wholesale', label: 'جملة' },
    { value: 'retailer', label: 'محل/سوبرماركت' },
    { value: 'delivery', label: 'توصيل' },
    { value: 'offer', label: 'عرض منتجات' },
    { value: 'nearby', label: 'جملة قريبة' },
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'approved', label: 'مقبولة' },
    { value: 'completed', label: 'مكتملة' },
    { value: 'rejected', label: 'مرفوضة' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'كل الفترات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
  ];

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">تصفية:</span>

        {/* نوع الطلب */}
        <select
          value={filters.type}
          onChange={e => handleChange('type', e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* حالة الطلب */}
        <select
          value={filters.status}
          onChange={e => handleChange('status', e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* الفترة الزمنية */}
        <select
          value={filters.dateRange}
          onChange={e => handleChange('dateRange', e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {dateRangeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* زر إعادة التعيين */}
        {(filters.type !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all') && (
          <button
            onClick={() => setFilters({ type: 'all', status: 'all', dateRange: 'all' })}
            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            مسح الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}
