'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShoppingCart, Clock, CheckCircle2, Truck, Package } from 'lucide-react'

interface RetailerOrder {
  id: string
  created_at: string
  status: string
  total_amount: number
  supplier: {
    store_name: string
    full_name: string
  }
}

export default function RetailerOrdersPage() {
  const [orders, setOrders] = useState<RetailerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRetailerOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            supplier:user_profiles!orders_supplier_id_fkey(store_name, full_name)
          `)
          .eq('retailer_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          setOrders(data as unknown as RetailerOrder[])
        }
      } catch (error) {
        console.error('Error fetching retailer orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRetailerOrders()
  }, [supabase])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20'><Clock className='w-3 h-3' /> قيد الانتظار</span>
      case 'processing':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20'><Package className='w-3 h-3' /> قيد التجهيز</span>
      case 'out_for_delivery':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20'><Truck className='w-3 h-3' /> مع الموصل</span>
      case 'delivered':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'><CheckCircle2 className='w-3 h-3' /> تم التوصيل</span>
      default:
        return <span className='px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'>{status}</span>
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
            طلباتي السابقة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            متابعة حالة طلبات البضائع التي قمت بإرسالها إلى الموردين ومراحل توصيلها.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2'>
            <ShoppingCart className='w-4 h-4' />
            إجمالي طلباتك: {orders.length}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>رقم الطلب</th>
                <th className='p-4'>المورد</th>
                <th className='p-4'>المبلغ الإجمالي</th>
                <th className='p-4'>حالة الطلب</th>
                <th className='p-4'>التاريخ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const supplierObj = Array.isArray(order.supplier) ? order.supplier[0] : order.supplier
                  return (
                    <tr key={order.id} className='hover:bg-slate-800/25 transition-colors'>
                      <td className='p-4 font-mono text-blue-400'>#{order.id.slice(0, 8)}</td>
                      <td className='p-4 font-medium text-white'>
                        {supplierObj?.store_name || supplierObj?.full_name || 'مورد جملة'}
                      </td>
                      <td className='p-4 font-bold text-emerald-400'>{Number(order.total_amount).toLocaleString()} د.ع</td>
                      <td className='p-4'>{getStatusBadge(order.status)}</td>
                      <td className='p-4 text-slate-400 text-xs'>
                        {new Date(order.created_at).toLocaleDateString('ar-IQ')}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className='p-8 text-center text-slate-500'>
                    لم تقم بإنشاء أي طلبات حتى الآن.
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
