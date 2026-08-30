// src/app/admin-analytics/components/TransactionFilters.tsx
'use client';

interface TransactionFiltersProps {
  filters: { status: string; dateRange: string };
  setFilters: (filters: { status: string; dateRange: string }) => void;
}

export default function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'completed', label: 'مكتملة' },
    { value: 'failed', label: 'فاشلة' },
    { value: 'refunded', label: 'مسترجعة' },
    { value: 'cancelled', label: 'ملغية' },
  ];

  const dateOptions = [
    { value: 'all', label: 'كل الفترات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'آخر أسبوع' },
    { value: 'month', label: 'آخر شهر' },
    { value: 'quarter', label: 'آخر 3 أشهر' },
    { value: 'year', label: 'آخر سنة' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        🔍 تصفية المعاملات
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الحالة</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الفترة الزمنية</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
