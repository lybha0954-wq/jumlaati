'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { ShoppingCart, Clock, CheckCircle2, Truck, XCircle, Search, Package } from 'lucide-react';

interface AdminOrder {
  id: string
  created_at: string
  status: string
  total_amount: number
  supplier_id: string | null
  retailer_id: string | null
  supplier: {
    full_name: string
    store_name: string
  } | null
  retailer: {
    full_name: string
    store_name: string
    phone: string
  } | null
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
        // Step 1: fetch orders without FK hints to avoid constraint-name mismatch
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount, supplier_id, retailer_id')
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        if (!ordersData || ordersData.length === 0) {
          setOrders([])
          setFilteredOrders([])
          return
        }

        // Step 2: collect unique user IDs and fetch profiles in one query
        const userIds = Array.from(new Set([
          ...ordersData.map((o) => o.supplier_id).filter(Boolean),
          ...ordersData.map((o) => o.retailer_id).filter(Boolean),
        ])) as string[]

        let profilesMap: Record<string, { full_name: string; store_name: string; phone: string }> = {}

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('id, full_name, store_name, phone')
            .in('id', userIds)

          if (profiles) {
            profiles.forEach((p) => {
              profilesMap[p.id] = {
                full_name: p.full_name || '',
                store_name: p.store_name || '',
                phone: p.phone || '',
              }
            })
          }
        }

        // Step 3: merge profiles into orders
        const enriched: AdminOrder[] = ordersData.map((o) => ({
          id: o.id,
          created_at: o.created_at,
          status: o.status,
          total_amount: o.total_amount,
          supplier_id: o.supplier_id,
          retailer_id: o.retailer_id,
          supplier: o.supplier_id && profilesMap[o.supplier_id]
            ? { full_name: profilesMap[o.supplier_id].full_name, store_name: profilesMap[o.supplier_id].store_name }
            : null,
          retailer: o.retailer_id && profilesMap[o.retailer_id]
            ? { full_name: profilesMap[o.retailer_id].full_name, store_name: profilesMap[o.retailer_id].store_name, phone: profilesMap[o.retailer_id].phone }
            : null,
        }))

        setOrders(enriched)
        setFilteredOrders(enriched)
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
      case 'reviewing':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20'><Clock className='w-3 h-3' /> قيد المراجعة</span>
      case 'processing': case'assigned':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20'><Package className='w-3 h-3' /> قيد التجهيز</span>
      case 'out_for_delivery': case'delivering':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20'><Truck className='w-3 h-3' /> مع الموصل</span>
      case 'delivered': case'completed':
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
          {['all', 'pending', 'reviewing', 'processing', 'delivered', 'cancelled'].map((status) => {
            const labels: Record<string, string> = {
              all: 'الكل',
              pending: 'قيد الانتظار',
              reviewing: 'قيد المراجعة',
              processing: 'قيد التجهيز',
              delivered: 'تم التوصيل',
              cancelled: 'ملغي',
            }
            const activeColors: Record<string, string> = {
              all: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20',
              pending: 'bg-amber-600 text-white shadow-lg shadow-amber-600/20',
              reviewing: 'bg-amber-600 text-white shadow-lg shadow-amber-600/20',
              processing: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20',
              delivered: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20',
              cancelled: 'bg-red-600 text-white shadow-lg shadow-red-600/20',
            }
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedStatus === status
                    ? activeColors[status]
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {labels[status]}
              </button>
            )
          })}
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
                filteredOrders.map((order) => (
                  <tr key={order.id} className='hover:bg-slate-800/25 transition-colors'>
                    <td className='p-4 font-mono text-indigo-400'>#{order.id.slice(0, 8)}</td>
                    <td className='p-4'>
                      <div className='font-medium text-white'>{order.retailer?.store_name || order.retailer?.full_name || 'تاجر'}</div>
                      <div className='text-xs text-slate-500 mt-0.5'>{order.retailer?.phone || ''}</div>
                    </td>
                    <td className='p-4'>
                      <div className='font-medium text-slate-300'>{order.supplier?.store_name || order.supplier?.full_name || 'مورد جملة'}</div>
                    </td>
                    <td className='p-4 font-bold text-emerald-400'>{Number(order.total_amount).toLocaleString()} د.ع</td>
                    <td className='p-4'>{getStatusBadge(order.status)}</td>
                    <td className='p-4 text-slate-400 text-xs'>
                      {new Date(order.created_at).toLocaleDateString('ar-IQ')}
                    </td>
                  </tr>
                ))
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
