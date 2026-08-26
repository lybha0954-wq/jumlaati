'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Truck, Package, CheckCircle2, Clock, Navigation } from 'lucide-react';

interface CourierStats {
  assignedTasks: number
  completedTasks: number
  pendingTasks: number
}

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

export default function CourierDashboard() {
  const [stats, setStats] = useState<CourierStats>({
    assignedTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  })
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCourierData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch tasks assigned to this courier or out for delivery
        const { data: assignedOrders, error } = await supabase
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

        if (assignedOrders) {
          const list = assignedOrders as unknown as DeliveryTask[]
          setTasks(list)

          const completed = list.filter(t => t.status === 'delivered').length
          const pending = list.filter(t => t.status === 'out_for_delivery' || t.status === 'processing').length

          setStats({
            assignedTasks: list.length,
            completedTasks: completed,
            pendingTasks: pending
          })
        }
      } catch (error) {
        console.error('Error fetching courier dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourierData()
  }, [supabase])

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
            لوحة تحكم الموصل
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            مرحباً بك. تابع مهام التوصيل الخاصة بك وقم بتحديث حالات الطلبات للزبائن.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-2'>
            <Truck className='w-4 h-4' />
            فريق التوصيل السريع
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Total Assigned */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المهام المسندة</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.assignedTasks}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400'>
              <Package className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-purple-400'>
            <span>الطلبات الكلية المخصصة لك</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>المهام الجارية</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.pendingTasks}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400'>
              <Clock className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-amber-400'>
            <span>قيد التوصيل الآن</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>المهام المكتملة</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.completedTasks}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400'>
              <CheckCircle2 className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-emerald-400'>
            <span>تم تسليمها بنجاح</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Banner */}
      <div className='bg-gradient-to-r from-purple-900/40 to-slate-900/40 backdrop-blur-xl border border-purple-500/20 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0'>
            <Navigation className='w-6 h-6' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-white'>استعراض الخريطة ومهام التوصيل</h2>
            <p className='text-slate-300 text-xs mt-0.5'>انتقل إلى صفحة المهام والخريطة لتحديث مواقع التسليم والوصول للعملاء بسرعة.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
