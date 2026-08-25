'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { DollarSign, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';

interface LedgerEntry {
  id: string
  created_at: string
  amount: number
  type: string
  description: string
}

const supabase = createClient();

export default function AdminFinancePage() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [totalCredits, setTotalCredits] = useState(0)
  const [totalDebits, setTotalDebits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFinanceData() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('id, created_at, amount, type, description')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching admin finance data:', error)
          setFetchError(error.message || 'تعذّر تحميل البيانات المالية')
          return
        }

        if (data) {
          setLedger(data as LedgerEntry[])

          let credits = 0
          let debits = 0
          data.forEach(entry => {
            const amt = Number(entry.amount)
            if (entry.type === 'credit' || amt > 0) {
              credits += Math.abs(amt)
            } else {
              debits += Math.abs(amt)
            }
          })

          setTotalCredits(credits)
          setTotalDebits(debits)
        }
      } catch (err) {
        console.error('Error fetching admin finance data:', err)
        setFetchError('تعذّر الاتصال بقاعدة البيانات')
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceData()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
      </div>
    )
  }

  const netBalance = totalCredits - totalDebits

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent'>
            المالية والتقارير المحاسبية
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            متابعة حركة السيولة، الإيرادات العامة، والقيود المحاسبية في النظام.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <Building2 className='w-4 h-4' />
            حسابات المنصة المركزية
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
          ⚠️ {fetchError}
        </div>
      )}

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Total Credits */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المقبوضات (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{totalCredits.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400'>
              <ArrowUpRight className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-emerald-400'>
            <span>حركات الإيداع والدخل</span>
          </div>
        </div>

        {/* Total Debits */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-red-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المسحوبات (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{totalDebits.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400'>
              <ArrowDownRight className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-red-400'>
            <span>المدفوعات والتسويات الصادرة</span>
          </div>
        </div>

        {/* Net Balance */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>صافي السيولة (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{netBalance.toLocaleString()}</h3>
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

      {/* Ledger Entries Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-6 border-b border-slate-800/80 flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-bold text-white'>سجل الحركات المالية</h2>
            <p className='text-slate-400 text-xs mt-0.5'>تفاصيل الحركات المالية والقيود المسجلة تلقائياً</p>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>معرف القيد</th>
                <th className='p-4'>البيان / الوصف</th>
                <th className='p-4'>نوع الحركة</th>
                <th className='p-4'>المبلغ</th>
                <th className='p-4'>التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {ledger.length > 0 ? (
                ledger.map((entry) => (
                  <tr key={entry.id} className='hover:bg-slate-800/25 transition-colors'>
                    <td className='p-4 font-mono text-indigo-400'>#{entry.id.slice(0, 8)}</td>
                    <td className='p-4 font-medium text-white'>{entry.description || 'حركة مالية مسجلة'}</td>
                    <td className='p-4'>
                      {entry.type === 'credit' ? (
                        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'>
                          دائن (قبض)
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/25'>
                          مدين (صرف)
                        </span>
                      )}
                    </td>
                    <td className={`p-4 font-bold ${entry.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {Number(entry.amount).toLocaleString()} د.ع
                    </td>
                    <td className='p-4 text-slate-400 text-xs'>
                      {new Date(entry.created_at).toLocaleString('ar-IQ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='p-8 text-center text-slate-500'>
                    لا توجد حركات مالية مسجلة حتى الآن.
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
