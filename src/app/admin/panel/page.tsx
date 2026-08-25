'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  ShieldAlert, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  activeSuppliers: number
}

interface SystemActivity {
  id: string
  type: string
  description: string
  created_at: string
}

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSuppliers: 0
  })
  const [activities, setActivities] = useState<SystemActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAdminData() {
      try {
        // Fetch total users count
        const { count: usersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })

        // Fetch active suppliers count
        const { count: suppliersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'supplier')

        // Fetch total orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })

        // Calculate total platform revenue from transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')

        const revenue = transactions?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

        // Fetch recent system transactions or orders as activity feed
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount')
          .order('created_at', { ascending: false })
          .limit(5)

        const formattedActivities: SystemActivity[] = (recentOrders || []).map(order => ({
          id: order.id,
          type: 'order',
          description: `طلب جديد برقم #${order.id.slice(0, 8)} بقيمة ${Number(order.total_amount).toLocaleString()} د.ع`,
          created_at: order.created_at
        }))

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue: revenue,
          activeSuppliers: suppliersCount || 0
        })
        setActivities(formattedActivities)

      } catch (error) {
        console.error('Error fetching admin panel data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [supabase])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent'>
            لوحة تحكم الإدارة الرئيسية
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            مراقبة شاملة لمنصة جملتي وإدارة المستخدمين والعمليات المالية.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <ShieldAlert className='w-4 h-4' />
            صلاحيات إدارية كاملة
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Total Users */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المستخدمين</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalUsers}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400'>
              <Users className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-indigo-400'>
            <UserCheck className='w-4 h-4' />
            <span>تجار، مورديين، وموصلين</span>
          </div>
        </div>

        {/* Active Suppliers */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>الموردون النشطون</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.activeSuppliers}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400'>
              <CheckCircle2 className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-emerald-400'>
            <TrendingUp className='w-4 h-4' />
            <span>يسجلون منتجاتهم على المنصة</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي الطلبات</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalOrders}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400'>
              <ShoppingCart className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-blue-400'>
            <Clock className='w-4 h-4' />
            <span>عبر كافة المحافظات العراقية</span>
          </div>
        </div>

        {/* Total Platform Revenue */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي السيولة (د.ع)</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400'>
              <DollarSign className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-teal-400'>
            <Activity className='w-4 h-4' />
            <span>حجم التداولات الكلي</span>
          </div>
        </div>
      </div>

      {/* Recent System Activity Feed */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden p-6'>
        <div className='flex items-center justify-between pb-4 border-b border-slate-800/80'>
          <div>
            <h2 className='text-lg font-bold text-white'>النشاط العام للنظام</h2>
            <p className='text-slate-400 text-xs mt-0.5'>آخر العمليات المسجلة في قاعدة البيانات</p>
          </div>
        </div>

        <div className='mt-4 space-y-3'>
          {activities.length > 0 ? (
            activities.map((act) => (
              <div key={act.id} className='flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400'>
                    <Activity className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>{act.description}</p>
                    <span className='text-xs text-slate-500'>{new Date(act.created_at).toLocaleString('ar-IQ')}</span>
                  </div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'>
                  نشاط مسجل
                </span>
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-slate-500'>
              لا توجد نشاطات مسجلة حديثاً.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
