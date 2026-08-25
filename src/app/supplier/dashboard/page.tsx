'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react'

interface SupplierStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function SupplierDashboard() {
  const [stats, setStats] = useState<SupplierStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSupplierStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch products count
        const { count: productsCount, error: prodError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('supplier_id', user.id)

        if (prodError) throw prodError

        // Fetch orders count & total revenue
        const { data: ordersData, error: ordError } = await supabase
          .from('orders')
          .select('total_amount, status')
          .eq('supplier_id', user.id)

        if (ordError) throw ordError

        let revenue = 0
        if (ordersData) {
          ordersData.forEach(ord => {
            if (ord.status === 'delivered') {
              revenue += Number(ord.total_amount || 0)
            }
          })
        }

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersData?.length || 0,
          totalRevenue: revenue
        })
      } catch (error) {
        console.error('Error fetching supplier dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplierStats()
  }, [supabase])

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
            لوحة تحكم المورد
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            مرحباً بك. تتبع منتجاتك المعروضة، مبيعاتك الكلية، وإدارة الطلبات الواردة من تجار التجزئة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2'>
            <Building2 className='w-4 h-4' />
            المورد المعتمد
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Total Products */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المنتجات</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalProducts}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400'>
              <Package className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-emerald-400'>
            <span>المواد المعروضة للجملة</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>الطلبات الواردة</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalOrders}</h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400'>
              <ShoppingBag className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-teal-400'>
            <span>طلبيات تجار التجزئة</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-400 text-sm font-medium'>إجمالي المبيعات المكتملة</p>
              <h3 className='text-2xl font-bold text-white mt-1'>{stats.totalRevenue.toLocaleString()} <span className='text-xs font-normal text-slate-400'>د.ع</span></h3>
            </div>
            <div className='w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400'>
              <DollarSign className='w-6 h-6' />
            </div>
          </div>
          <div className='mt-4 flex items-center gap-1 text-xs text-cyan-400'>
            <TrendingUp className='w-3.5 h-3.5' />
            <span>الأرباح من الطلبات المسلمة</span>
          </div>
        </div>
      </div>
    </div>
  )
}
