'use client';
import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-08-15', description: 'دفعة من متجر النور', type: 'credit', amount: 4500, status: 'completed' },
  { id: 'TXN-002', date: '2026-08-14', description: 'دفعة من متجر الأمل', type: 'credit', amount: 2800, status: 'completed' },
  { id: 'TXN-003', date: '2026-08-13', description: 'سحب رصيد', type: 'debit', amount: 3000, status: 'completed' },
  { id: 'TXN-004', date: '2026-08-12', description: 'دفعة من متجر الفجر', type: 'credit', amount: 1750, status: 'pending' },
  { id: 'TXN-005', date: '2026-08-11', description: 'دفعة من متجر الربيع', type: 'credit', amount: 5200, status: 'completed' },
  { id: 'TXN-006', date: '2026-08-10', description: 'رسوم منصة', type: 'debit', amount: 250, status: 'completed' },
];

const statusLabels: Record<string, string> = {
  completed: 'مكتمل',
  pending: 'قيد الانتظار',
  failed: 'فشل',
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export default function SupplierFinanceContent() {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const totalCredit = mockTransactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalDebit = mockTransactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const balance = totalCredit - totalDebit;

  const filtered = mockTransactions.filter(t => filter === 'all' || t.type === filter);

  return (
    <div className="p-4 md:p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المالية</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة الإيرادات والمدفوعات</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">الرصيد الحالي</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{balance.toLocaleString()} ر.س</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalCredit.toLocaleString()} ر.س</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي المدفوعات</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{totalDebit.toLocaleString()} ر.س</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">سجل المعاملات</h2>
          <div className="flex gap-2">
            {(['all', 'credit', 'debit'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f === 'all' ? 'الكل' : f === 'credit' ? 'وارد' : 'صادر'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">رقم المعاملة</th>
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">التاريخ</th>
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">الوصف</th>
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">النوع</th>
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">المبلغ</th>
                <th className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono">{txn.id}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{txn.date}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-white">{txn.description}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.type === 'credit' ? 'وارد' : 'صادر'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">
                    {txn.type === 'debit' ? '-' : '+'}{txn.amount.toLocaleString()} ر.س
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[txn.status]}`}>
                      {statusLabels[txn.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
