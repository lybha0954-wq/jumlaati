'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShoppingCart, Trash2, CheckCircle2, ArrowRight, Store } from 'lucide-react'

export default function RetailerCartPage() {
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const supabase = createClient()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('يجب تسجيل الدخول أولاً')
        return
      }

      // Simulate placing an order process
      setTimeout(() => {
        setLoading(false)
        setOrderPlaced(true)
      }, 1000)
    } catch (error) {
      console.error('Error during checkout:', error)
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
            سلة المشتريات
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            مراجعة المنتجات المختارة وإرسال الطلب مباشرة إلى الموردين.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2'>
            <ShoppingCart className='w-4 h-4' />
            إتمام طلبية الجملة
          </div>
        </div>
      </div>

      {orderPlaced ? (
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl space-y-4'>
          <div className='w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto'>
            <CheckCircle2 className='w-8 h-8' />
          </div>
          <h2 className='text-xl font-bold text-white'>تم إرسال طلبك بنجاح!</h2>
          <p className='text-slate-400 text-sm max-w-md mx-auto'>
            تم تسجيل الطلب وإرساله إلى المورد المعني لتجهيزه وشحنه عبر خدمات التوصيل في أقرب وقت.
          </p>
          <button
            onClick={() => setOrderPlaced(false)}
            className='px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-600/20'
          >
            العودة للتسوق
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Cart Items List Container */}
          <div className='lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4'>
            <h2 className='text-lg font-bold text-white pb-3 border-b border-slate-800/80'>المنتجات المضافة</h2>
            
            <div className='p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between'>
              <div>
                <h3 className='text-sm font-bold text-white'>نموذج مادة جملة</h3>
                <p className='text-xs text-slate-400 mt-0.5'>المورد: متجر الجملة الرئيسي</p>
              </div>
              <div className='text-left'>
                <span className='text-sm font-bold text-emerald-400'>15,000 د.ع</span>
                <span className='text-xs text-slate-500 block'>الكمية: 1</span>
              </div>
            </div>
          </div>

          {/* Checkout Summary Box */}
          <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 h-fit'>
            <h2 className='text-lg font-bold text-white pb-3 border-b border-slate-800/80'>ملخص الطلب</h2>
            
            <div className='flex items-center justify-between text-sm text-slate-300'>
              <span>إجمالي البضائع:</span>
              <span className='font-bold text-white'>15,000 د.ع</span>
            </div>

            <div className='flex items-center justify-between text-sm text-slate-300'>
              <span>أجور التوصيل:</span>
              <span className='font-bold text-white'>تحديد حسب المنطقة</span>
            </div>

            <div className='pt-3 border-t border-slate-800/80 flex items-center justify-between text-base font-bold text-white'>
              <span>المبلغ الإجمالي:</span>
              <span className='text-emerald-400'>15,000 د.ع</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className='w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4'
            >
              <span>{loading ? 'جاري إرسال الطلب...' : 'تأكيد إرسال الطلب'}</span>
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
