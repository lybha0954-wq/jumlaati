// src/app/admin-commissions/components/RequestsList.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Request {
  id: string;
  type: 'wholesale' | 'retailer' | 'delivery' | 'offer' | 'nearby';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requester: { full_name: string; role: string };
  target: { full_name: string; role: string };
  commission_percentage: number;
  commission_amount: number;
  description: string;
  created_at: string;
}

interface RequestsListProps {
  requests: Request[];
  onViewRequest: (request: Request) => void;
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  wholesale: { label: 'جملة', icon: '🏪' },
  retailer: { label: 'محل/سوبرماركت', icon: '🛍️' },
  delivery: { label: 'توصيل', icon: '🚚' },
  offer: { label: 'عرض منتجات', icon: '🎯' },
  nearby: { label: 'جملة قريبة', icon: '📍' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  approved: { label: 'مقبولة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  completed: { label: 'مكتملة', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  rejected: { label: 'مرفوضة', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
};

export default function RequestsList({ requests, onViewRequest }: RequestsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(requests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = requests.slice(startIndex, startIndex + pageSize);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy hh:mm a', { locale: ar });
    } catch {
      return date;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">📭 لا توجد طلبات لعرضها</p>
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
                النوع
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                مقدم الطلب
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                الهدف
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                العمولة
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                الإجراء
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedRequests.map((r) => {
              const typeConfig = TYPE_LABELS[r.type] || { label: r.type, icon: '📦' };
              const statusConfig = STATUS_LABELS[r.status] || { label: r.status, color: 'bg-gray-100 text-gray-800' };

              return (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span>{typeConfig.icon}</span>
                      <span className="text-xs">{typeConfig.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    <div>
                      <p className="font-medium">{r.requester?.full_name || 'غير محدد'}</p>
                      <p className="text-xs text-gray-400">{r.requester?.role || ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    <div>
                      <p className="font-medium">{r.target?.full_name || 'غير محدد'}</p>
                      <p className="text-xs text-gray-400">{r.target?.role || ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {r.commission_amount?.toFixed(2) || 0} د.ع
                      </p>
                      <p className="text-xs text-gray-400">{r.commission_percentage || 0}%</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewRequest(r)}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* الترقيم */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            عرض {startIndex + 1} - {Math.min(startIndex + pageSize, requests.length)} من {requests.length}
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
