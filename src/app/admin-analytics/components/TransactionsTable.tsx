// src/app/admin-analytics/components/TransactionsTable.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Transaction {
  id: string;
  total_amount: number;
  platform_commission: number;
  supplier_net: number;
  delivery_fee: number;
  status: string;
  created_at: string;
  retailer: { full_name: string };
  supplier: { full_name: string };
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const STATUS_BADGES: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', label: 'قيد الانتظار' },
  completed: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', label: 'مكتملة' },
  failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'فاشلة' },
  refunded: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', label: 'مسترجعة' },
  cancelled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400', label: 'ملغية' },
};

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(transactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + pageSize);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy hh:mm a', { locale: ar });
    } catch {
      return date;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">📭 لا توجد معاملات لعرضها</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                المعرف
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                العميل
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                المورد
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                عمولة المنصة
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                التاريخ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedTransactions.map((t) => {
              const badge = STATUS_BADGES[t.status] || STATUS_BADGES.pending;
              return (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono text-xs">
                    #{t.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    {t.retailer?.full_name || 'غير محدد'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    {t.supplier?.full_name || 'غير محدد'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {t.total_amount.toFixed(2)} د.ع
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {t.platform_commission.toFixed(2)} د.ع
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(t.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* الترقيم (Pagination) */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            عرض {startIndex + 1} - {Math.min(startIndex + pageSize, transactions.length)} من {transactions.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              السابق
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
