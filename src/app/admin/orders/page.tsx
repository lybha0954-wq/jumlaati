'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Search, 
  DollarSign,
  Package,
  MapPin,
  Phone,
  Store
} from 'lucide-react'

interface AdminOrder {
  id: string
  created_at: string
  status: string
  total_amount: number
  supplier: {
    full_name: string
    store_name: string
  }
  retailer: {
    full_name: string
    store_name: string
    phone: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            supplier:user_profiles!orders_supplier_id_fkey(full_name, store_name),
            retailer:user_profiles!orders_retailer_id_fkey(full_name, store_name, phone)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          setOrders(data as unknown as AdminOrder[])
          setFilteredOrders(data as unknown as AdminOrder[])
        }
      } catch (error) {
        console.error('Error fetching admin orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [supabase])

  useEffect(() => {
    let result = orders

    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        (order.retailer?.store_name && order.retailer.store_name.toLowerCase().includes(term)) ||
        (order.supplier?.store_name && order.supplier.store_name.toLowerCase().includes(term)) ||
        (order.retailer?.phone && order.retailer.phone.includes(term))
      )
    }

    setFilteredOrders(result)
  }, [searchTerm, selectedStatus, orders])

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
      case 'cancelled':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20'><XCircle className='w-3 h-3' /> ملغي</span>
      default:
        return <span className='px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'>{status}</span>
    }
  }

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
            متابعة وإدارة الطلبات
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            استعراض كافة الطلبات الجارية والمكتملة بين الموردين والتجار في المنصة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <ShoppingCart className='w-4 h-4' />
            إجمالي الطلبات: {orders.length}
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4'>
        {/* Search Input */}
        <div className='relative w-full md:w-96'>
          <Search className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input
            type='text'
            placeholder='بحث برقم الطلب، اسم المتجر، المورد أو الهاتف...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
          />
        </div>

        {/* Status Filters */}
        <div className='flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0'>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            قيد الانتظار
          </button>
          <button
            onClick={() => setSelectedStatus('processing')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === 'processing'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            قيد التجهيز
          </button>
          <button
            onClick={() => setSelectedStatus('delivered')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === 'delivered'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            تم التوصيل
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>رقم الطلب</th>
                <th className='p-4'>التاجر (المشتري)</th>
                <th className='p-4'>المورد (البائع)</th>
                <th className='p-4'>المبلغ الإجمالي</th>
                <th className='p-4'>الحالة</th>
                <th className='p-4'>التاريخ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const retailerObj = Array.isArray(order.retailer) ? order.retailer[0] : order.retailer
                  const supplierObj = Array.isArray(order.supplier) ? order.supplier[0] : order.supplier

                  return (
                    <tr key={order.id} className='hover:bg-slate-800/25 transition-colors'>
                      <td className='p-4 font-mono text-indigo-400'>#{order.id.slice(0, 8)}</td>
                      <td className='p-4'>
                        <div className='font-medium text-white'>{retailerObj?.store_name || retailerObj?.full_name || 'تاجر'}</div>
                        <div className='text-xs text-slate-500 mt-0.5'>{retailerObj?.phone || ''}</div>
                      </td>
                      <td className='p-4'>
                        <div className='font-medium text-slate-300'>{supplierObj?.store_name || supplierObj?.full_name || 'مورد جملة'}</div>
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
                  <td colSpan={6} className='p-8 text-center text-slate-500'>
                    لا توجد طلبات مطابقة للبحث.
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
