'use client'

import React from 'react'
import { MapPin, Navigation, Compass, ShieldAlert } from 'lucide-react'

export default function CourierMapPage() {
  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent'>
            خريطة التوصيل الحي
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            تتبع مسارات خطوط السير والوصول إلى مواقع محال التجزئة في المحافظة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-2'>
            <Compass className='w-4 h-4' />
            نظام التوجيه الذكي
          </div>
        </div>
      </div>

      {/* Map View Placeholder Container */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[50vh] text-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0,transparent_70%)]'></div>
        
        <div className='w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-500/10'>
          <Navigation className='w-10 h-10 animate-pulse' />
        </div>

        <h2 className='text-xl font-bold text-white mb-2'>خريطة مسارات التوصيل مفعلة</h2>
        <p className='text-slate-400 text-sm max-w-md mx-auto mb-6'>
          يتم الاعتماد على نظام الملاحة الجغرافي لتحديد أقصر الطرق نحو محال التجزئة والزبائن في عموم المدن العراقية.
        </p>

        <div className='px-6 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2'>
          <MapPin className='w-4 h-4 text-purple-400' />
          <span>الموقع الحالي: متزامن مع مهام التوصيل النشطة</span>
        </div>
      </div>
    </div>
  )
}
