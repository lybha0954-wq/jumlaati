'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Settings, Shield, Bell, Database, Save, CheckCircle2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('منصة جملتي')
  const [commissionRate, setCommissionRate] = useState('2.5')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    // Simulate saving settings configuration
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 800)
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent'>
            إعدادات النظام العامة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            التحكم بإعدادات المنصة، نسب العمولات، وتشغيل وضع الصيانة عند الحاجة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <Settings className='w-4 h-4' />
            إعدادات المسؤول الأول
          </div>
        </div>
      </div>

      {success && (
        <div className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-sm'>
          <CheckCircle2 className='w-5 h-5' />
          تم حفظ الإعدادات بنجاح!
        </div>
      )}

      {/* Settings Form */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl p-6'>
        <form onSubmit={handleSave} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Platform Name */}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                اسم المنصة
              </label>
              <input
                type='text'
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>

            {/* Commission Rate */}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                نسبة عمولة المنصة (%)
              </label>
              <input
                type='number'
                step='0.1'
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-800/80 flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-bold text-white'>وضع الصيانة</h3>
              <p className='text-xs text-slate-400 mt-0.5'>إيقاف مؤقت لعمليات التجار والموردين للصيانة الدورية</p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className='sr-only peer'
              />
              <div className='w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600'></div>
            </label>
          </div>

          <div className='pt-4 flex justify-end'>
            <button
              type='submit'
              disabled={saving}
              className='px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50'
            >
              <Save className='w-4 h-4' />
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
