'use client';
import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export default function SupplierSettingsPage() {
  const [storeName, setStoreName] = useState('مؤسسة الجملة المركزية')
  const [phone, setPhone] = useState('07700000000')
  const [city, setCity] = useState('بغداد')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_profiles')
        .update({
          store_name: storeName,
          phone: phone,
          city: city
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating supplier settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent'>
            إعدادات حساب المورد
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            تحديث معلومات المؤسسة، أرقام التواصل، والمقر الرئيسي للمورد في السوق.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2'>
            <Building2 className='w-4 h-4' />
            بيانات المورد
          </div>
        </div>
      </div>

      {success && (
        <div className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-sm shadow-lg'>
          <CheckCircle2 className='w-5 h-5 shrink-0' />
          <span>تم حفظ التعديلات بنجاح!</span>
        </div>
      )}

      {/* Settings Form */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl p-6'>
        <form onSubmit={handleSave} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Store/Company Name */}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                اسم شركة أو مؤسسة الجملة
              </label>
              <input
                type='text'
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors'
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                رقم الهاتف الرسمي
              </label>
              <input
                type='text'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors'
              />
            </div>

            {/* City */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                المحافظة أو المدينة الرئيسية
              </label>
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors'
              />
            </div>
          </div>

          <div className='pt-4 flex justify-end'>
            <button
              type='submit'
              disabled={saving}
              className='px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50'
            >
              <Save className='w-4 h-4' />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
