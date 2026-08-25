'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Users, Shield, Store, Truck, UserCheck, Phone, MapPin, Search } from 'lucide-react';

interface UserProfile {
  id: string
  full_name: string
  store_name: string | null
  phone: string | null
  role: 'admin' | 'supplier' | 'retailer' | 'courier'
  city: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, store_name, phone, role, city, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          setUsers(data as UserProfile[])
          setFilteredUsers(data as UserProfile[])
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  useEffect(() => {
    let result = users

    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(user => 
        (user.full_name && user.full_name.toLowerCase().includes(term)) ||
        (user.store_name && user.store_name.toLowerCase().includes(term)) ||
        (user.phone && user.phone.includes(term)) ||
        (user.city && user.city.toLowerCase().includes(term))
      )
    }

    setFilteredUsers(result)
  }, [searchTerm, selectedRole, users])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20'><Shield className='w-3 h-3' /> إبدارة</span>
      case 'supplier':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'><Store className='w-3 h-3' /> مورد جملة</span>
      case 'retailer':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20'><UserCheck className='w-3 h-3' /> تاجر تجزئة</span>
      case 'courier':
        return <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20'><Truck className='w-3 h-3' /> موصل توصيل</span>
      default:
        return <span className='px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20'>{role}</span>
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
            إدارة المستخدمين
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            استعراض ومتابعة حسابات التجار والموردين والموصلين المسجلين في المنصة.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2'>
            <Users className='w-4 h-4' />
            العدد الكلي: {users.length}
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
            placeholder='بحث بالاسم، اسم المتجر، الهاتف، أو المدينة...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
          />
        </div>

        {/* Role Filters */}
        <div className='flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0'>
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedRole === 'all' ?'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' :'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedRole('supplier')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedRole === 'supplier' ?'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' :'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            الموردين
          </button>
          <button
            onClick={() => setSelectedRole('retailer')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedRole === 'retailer' ?'bg-blue-600 text-white shadow-lg shadow-blue-600/20' :'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            التجار
          </button>
          <button
            onClick={() => setSelectedRole('courier')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedRole === 'courier' ?'bg-purple-600 text-white shadow-lg shadow-purple-600/20' :'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            الموصلين
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>الاسم الكامل</th>
                <th className='p-4'>اسم المتجر</th>
                <th className='p-4'>الدور / الصلاحية</th>
                <th className='p-4'>رقم الهاتف</th>
                <th className='p-4'>المدينة</th>
                <th className='p-4'>تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className='hover:bg-slate-800/25 transition-colors'>
                    <td className='p-4 font-medium text-white'>
                      {user.full_name || 'بدون اسم'}
                    </td>
                    <td className='p-4 text-slate-300'>
                      {user.store_name || '-'}
                    </td>
                    <td className='p-4'>{getRoleBadge(user.role)}</td>
                    <td className='p-4 font-mono text-slate-400 flex items-center gap-1.5 pt-5'>
                      <Phone className='w-3.5 h-3.5 text-indigo-400' />
                      {user.phone || 'غير مسجل'}
                    </td>
                    <td className='p-4 text-slate-400'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-3.5 h-3.5 text-indigo-400' />
                        {user.city || 'العراق'}
                      </div>
                    </td>
                    <td className='p-4 text-slate-400 text-xs'>
                      {new Date(user.created_at).toLocaleDateString('ar-IQ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-slate-500'>
                    لا توجد نتائج مطابقة للبحث.
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
