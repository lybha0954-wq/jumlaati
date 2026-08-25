'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShoppingBag, Clock, Package, CheckCircle2, Truck } from 'lucide-react'

interface SupplierOrder {
  id: string
  created_at: string
  status: string
  total_amount: number
  retailer: {
    full_name: string
    store_name: string
    phone: string
    city: string
  }
}

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  async function fetchOrders() {
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
          retailer:user_profiles!orders_retailer_id_fkey(full_name, store_name, phone, city)
        `)
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setOrders(data as unknown as SupplierOrder[])
      }
    } catch (error) {
      console.error('Error fetching supplier orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [supabase])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

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
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent'>
            الطلبات الواردة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            استعراض طلبات تجار التجزئة وإدارة حالات التجهيز والشحن عبر فريق التوصيل.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2'>
            <ShoppingBag className='w-4 h-4' />
            الطلبات الكلية: {orders.length}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className='space-y-4'>
        {orders.length > 0 ? (
          orders.map((order) => {
            const retailerObj = Array.isArray(order.retailer) ? order.retailer[0] : order.retailer
            const isUpdating = updatingId === order.id

            return (
              <div 
                key={order.id} 
                className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:border-emerald-500/30 transition-all'
              >
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <span className='font-mono text-emerald-400 font-bold'>#{order.id.slice(0, 8)}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div>
                    <h2 className='text-lg font-bold text-white'>
                      {retailerObj?.store_name || retailerObj?.full_name || 'متجر التجزئة'}
                    </h2>
                    <div className='flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5'>
                      <span>الهاتف: <span className='text-slate-200'>{retailerObj?.phone || 'غير متوفر'}</span></span>
                      <span>المدينة: <span className='text-slate-200'>{retailerObj?.city || 'العراق'}</span></span>
                      <span className='font-bold text-emerald-400'>
                        المبلغ: {Number(order.total_amount).toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80'>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      disabled={isUpdating}
                      className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50'
                    >
                      {isUpdating ? 'جاري التحديث...' : 'بدء التجهيز'}
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      disabled={isUpdating}
                      className='px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50'
                    >
                      {isUpdating ? 'جاري التحديث...' : 'إرسال مع التوصيل'}
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <span className='text-xs text-purple-400 font-medium'>الطلب في طريق التوصيل حالياً</span>
                  )}
                  {order.status === 'delivered' && (
                    <span className='text-xs text-emerald-400 font-medium'>تم تسليم الطلب وتحصيل المبلغ</span>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500'>
            لا توجد طلبات واردة حالياً.
          </div>
        )}
      </div>
    </div>
  )
}
