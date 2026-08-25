'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Package, Truck, CheckCircle2, Phone, MapPin, CheckCircle } from 'lucide-react';

interface DeliveryTask {
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

export default function CourierTasksPage() {
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  async function fetchTasks() {
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
        .eq('courier_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setTasks(data as unknown as DeliveryTask[])
      }
    } catch (error) {
      console.error('Error fetching courier tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [supabase])

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setUpdatingId(taskId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      // Refresh tasks list
      await fetchTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20'><Truck className='w-3 h-3' /> مع الموصل (قيد التوصيل)</span>
      case 'delivered':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'><CheckCircle2 className='w-3 h-3' /> تم التوصيل بنجاح</span>
      default:
        return <span className='px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'>{status}</span>
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent'>
            مهام التوصيل المخصصة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            قائمة الطلبات المسندة إليك لتوصيلها إلى محال التجزئة. يمكنك تحديث حالة التوصيل مباشرة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-2'>
            <Package className='w-4 h-4' />
            المهام الكلية: {tasks.length}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className='space-y-4'>
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const retailerObj = Array.isArray(task.retailer) ? task.retailer[0] : task.retailer
            const isUpdating = updatingId === task.id

            return (
              <div 
                key={task.id} 
                className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:border-purple-500/30 transition-all'
              >
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <span className='font-mono text-purple-400 font-bold'>#{task.id.slice(0, 8)}</span>
                    {getStatusBadge(task.status)}
                  </div>

                  <div>
                    <h2 className='text-lg font-bold text-white'>
                      {retailerObj?.store_name || retailerObj?.full_name || 'متجر التجزئة'}
                    </h2>
                    <div className='flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5'>
                      <span className='flex items-center gap-1 text-slate-300'>
                        <Phone className='w-3.5 h-3.5 text-purple-400' />
                        {retailerObj?.phone || 'لا يوجد هاتف'}
                      </span>
                      <span className='flex items-center gap-1 text-slate-300'>
                        <MapPin className='w-3.5 h-3.5 text-purple-400' />
                        {retailerObj?.city || 'العراق'}
                      </span>
                      <span className='font-bold text-emerald-400'>
                        المبلغ المطلوب تحصيله: {Number(task.total_amount).toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80'>
                  {task.status !== 'delivered' ? (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'delivered')}
                      disabled={isUpdating}
                      className='px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50'
                    >
                      <CheckCircle className='w-4 h-4' />
                      {isUpdating ? 'جاري التحديث...' : 'تأكيد التوصيل والتحصيل'}
                    </button>
                  ) : (
                    <div className='px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5'>
                      <CheckCircle2 className='w-4 h-4' />
                      تم تسليم الطلب بنجاح
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500'>
            لا توجد مهام توصيل مسندة إليك حالياً.
          </div>
        )}
      </div>
    </div>
  )
}
