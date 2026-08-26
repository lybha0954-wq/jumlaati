'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { DollarSign, ArrowUpRight, ArrowDownRight, Building2, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string
  created_at: string
  amount: number
  payment_method: string
  payment_status: string
  transaction_number: string
}

export default function AdminFinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>('')

  const fetchFinanceData = async () => {
    setLoading(true)
    setFetchError(null)

    // ── 1. Try transactions table ──────────────────────────────────────────
    try {
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('id, created_at, amount, payment_method, payment_status, transaction_number')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!txError && txData && txData.length > 0) {
        const mapped: Transaction[] = txData.map((row: Record<string, unknown>) => ({
          id: String(row.id ?? ''),
          created_at: String(row.created_at ?? ''),
          amount: Number(row.amount ?? 0),
          payment_method: String(row.payment_method ?? 'cash'),
          payment_status: String(row.payment_status ?? 'pending'),
          transaction_number: String(row.transaction_number ?? ''),
        }))
        applyTransactions(mapped)
        setDataSource('transactions')
        setLoading(false)
        return
      }
    } catch (_) {
      // fall through to next source
    }

    // ── 2. Try orders table ────────────────────────────────────────────────
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, total, payment_status, payment_method, created_at')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!ordersError && ordersData) {
        const mapped: Transaction[] = ordersData.map((row: Record<string, unknown>) => ({
          id: String(row.id ?? ''),
          created_at: String(row.created_at ?? ''),
          amount: Number(row.total ?? 0),
          payment_method: String(row.payment_method ?? 'cash'),
          payment_status: String(row.payment_status ?? 'pending'),
          transaction_number: String(row.order_number ?? ''),
        }))
        applyTransactions(mapped)
        setDataSource('orders')
        setLoading(false)
        return
      }

      if (ordersError) {
        console.warn('Orders table blocked (RLS):', (ordersError as any).message)
      }
    } catch (_) {
      // fall through to next source
    }

    // ── 3. Try ledger_entries table ────────────────────────────────────────
    try {
      const { data: ledgerData, error: ledgerError } = await supabase
        .from('ledger_entries')
        .select('id, created_at, amount, entry_type')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!ledgerError && ledgerData) {
        const mapped: Transaction[] = ledgerData.map((row: Record<string, unknown>) => ({
          id: String(row.id ?? ''),
          created_at: String(row.created_at ?? ''),
          amount: Number(row.amount ?? 0),
          payment_method: 'cash',
          payment_status: row.entry_type === 'payment' ? 'completed' : 'pending',
          transaction_number: String(row.id ?? '').slice(0, 8),
        }))
        applyTransactions(mapped)
        setDataSource('ledger')
        setLoading(false)
        return
      }
    } catch (_) {
      // all sources failed
    }

    // ── All sources failed ─────────────────────────────────────────────────
    setFetchError('تعذّر تحميل البيانات المالية. يرجى التحقق من صلاحيات المدير في قاعدة البيانات أو تطبيق ملف الهجرة الجديد.')
    setLoading(false)
  }

  function applyTransactions(mapped: Transaction[]) {
    setTransactions(mapped)
    let completed = 0
    let pending = 0
    mapped.forEach(entry => {
      const amt = entry.amount
      if (entry.payment_status === 'paid' || entry.payment_status === 'completed') {
        completed += amt
      } else {
        pending += amt
      }
    })
    setTotalCompleted(completed)
    setTotalPending(pending)
  }

  useEffect(() => {
    fetchFinanceData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
      </div>
    )
  }

  const totalAmount = totalCompleted + totalPending

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent'>
            المالية والتقارير المحاسبية
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            متابعة حركة السيولة، الإيرادات العامة، والمعاملات المالية في النظام.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={fetchFinanceData}
            className='px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all flex items-center gap-2 text-sm'
          >
            <RefreshCw className='w-4 h-4' />
            تحديث
          </button>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <Building2 className='w-4 h-4' />
            حسابات المنصة المركزية
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-red-400 text-sm space-y-2'>
          <p className='font-semibold'>⚠️ {fetchError}</p>
          <p className='text-red-400/70 text-xs leading-relaxed'>
            السبب المحتمل: سياسات RLS في Supabase تمنع المدير من قراءة جداول الطلبات والمعاملات.
            يرجى تطبيق ملف الهجرة <span className='font-mono bg-red-500/10 px-1 rounded'>supabase/migrations/20260826_admin_rls_policies.sql</span> على قاعدة البيانات.
          </p>
          <button
            onClick={fetchFinanceData}
            className='mt-2 px-4 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all text-xs flex items-center gap-2'
          >
            <RefreshCw className='w-3 h-3' />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Total Completed */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>المدفوعات المكتملة (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{totalCompleted.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400'>
              <ArrowUpRight className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-emerald-400'>
            <span>المعاملات المكتملة</span>
          </div>
        </div>

        {/* Total Pending */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>المدفوعات المعلقة (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{totalPending.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400'>
              <ArrowDownRight className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-amber-400'>
            <span>المعاملات قيد الانتظار</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المعاملات (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{totalAmount.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400'>
              <DollarSign className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-indigo-400'>
            <span>الرصيد المالي الإجمالي</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-6 border-b border-slate-800/80 flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-bold text-white'>سجل المعاملات المالية</h2>
            <p className='text-slate-400 text-xs mt-0.5'>
              تفاصيل المعاملات المالية المسجلة في النظام
              {dataSource && (
                <span className='mr-2 text-indigo-400/60'>
                  ({dataSource === 'transactions' ? 'جدول المعاملات' : dataSource === 'orders' ? 'جدول الطلبات' : 'دفتر الأستاذ'})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>رقم المعاملة</th>
                <th className='p-4'>طريقة الدفع</th>
                <th className='p-4'>حالة الدفع</th>
                <th className='p-4'>المبلغ</th>
                <th className='p-4'>التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {transactions.length > 0 ? (
                transactions.map((entry) => {
                  const isPaid = entry.payment_status === 'paid' || entry.payment_status === 'completed'
                  const isFailed = entry.payment_status === 'failed' || entry.payment_status === 'cancelled'
                  return (
                    <tr key={entry.id} className='hover:bg-slate-800/25 transition-colors'>
                      <td className='p-4 font-mono text-indigo-400'>#{entry.transaction_number || entry.id.slice(0, 8)}</td>
                      <td className='p-4 font-medium text-white'>
                        {entry.payment_method === 'cash' ? 'نقداً' :
                         entry.payment_method === 'cod' ? 'الدفع عند الاستلام' :
                         entry.payment_method === 'bank_transfer' ? 'تحويل بنكي' :
                         entry.payment_method === 'wallet' ? 'محفظة' :
                         entry.payment_method === 'credit' ? 'ائتمان' : entry.payment_method || 'نقداً'}
                      </td>
                      <td className='p-4'>
                        {isPaid ? (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'>
                            مكتملة
                          </span>
                        ) : isFailed ? (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/25'>
                            {entry.payment_status === 'cancelled' ? 'ملغاة' : 'فاشلة'}
                          </span>
                        ) : entry.payment_status === 'partial' ? (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/25'>
                            جزئية
                          </span>
                        ) : entry.payment_status === 'overdue' ? (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/25'>
                            متأخرة
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25'>
                            معلقة
                          </span>
                        )}
                      </td>
                      <td className='p-4 font-bold text-white'>{entry.amount.toLocaleString()} د.ع</td>
                      <td className='p-4 text-slate-400 text-xs'>
                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString('ar-IQ', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        }) : '—'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className='p-12 text-center text-slate-500'>
                    <DollarSign className='w-10 h-10 mx-auto mb-3 opacity-30' />
                    <p className='text-sm'>لا توجد معاملات مالية مسجلة بعد</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
