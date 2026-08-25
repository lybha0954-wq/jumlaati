'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Package, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  unit: string
}

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [unit, setUnit] = useState('قطعة')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function fetchProducts() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setProducts(data as Product[])
      }
    } catch (error) {
      console.error('Error fetching supplier products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [supabase])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock) return

    setSubmitting(true)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('products')
        .insert({
          supplier_id: user.id,
          name,
          price: parseFloat(price),
          stock_quantity: parseInt(stock),
          unit
        })

      if (error) throw error

      setName('')
      setPrice('')
      setStock('')
      setUnit('قطعة')
      setSuccess(true)
      await fetchProducts()
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

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
            إدارة منتجات الجملة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            إضافة منتجات جديدة، تحديد أسعار الجملة، والكميات المتوفرة في المخزن.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2'>
            <Package className='w-4 h-4' />
            المنتجات المعروضة: {products.length}
          </div>
        </div>
      </div>

      {success && (
        <div className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-sm shadow-lg'>
          <CheckCircle2 className='w-5 h-5 shrink-0' />
          <span>تمت إضافة المنتج بنجاح إلى قائمة الجملة!</span>
        </div>
      )}

      {/* Add Product Form */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl'>
        <h2 className='text-lg font-bold text-white mb-4'>إضافة منتج جديد</h2>
        <form onSubmit={handleAddProduct} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>اسم المنتج</label>
            <input
              type='text'
              placeholder='مثال: صندوق مياه'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>سعر الجملة (د.ع)</label>
            <input
              type='number'
              placeholder='0'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>الكمية المتوفرة</label>
            <input
              type='number'
              placeholder='0'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>وحدة القياس</label>
            <input
              type='text'
              placeholder='قطعة / كرتون / كغ'
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500'
            />
          </div>

          <div className='flex items-end'>
            <button
              type='submit'
              disabled={submitting}
              className='w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50'
            >
              <Plus className='w-4 h-4' />
              <span>{submitting ? 'جاري الإضافة...' : 'إضافة المنتج'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right border-collapse'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400 text-xs font-medium bg-slate-950/40'>
                <th className='p-4'>اسم المنتج</th>
                <th className='p-4'>سعر الجملة</th>
                <th className='p-4'>الكمية المخزنية</th>
                <th className='p-4'>الوحدة</th>
                <th className='p-4 text-left'>الإجراءات</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-sm text-slate-300'>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className='hover:bg-slate-800/25 transition-colors'>
                    <td className='p-4 font-medium text-white'>{product.name}</td>
                    <td className='p-4 font-bold text-emerald-400'>{Number(product.price).toLocaleString()} د.ع</td>
                    <td className='p-4'>{product.stock_quantity}</td>
                    <td className='p-4'>{product.unit}</td>
                    <td className='p-4 text-left'>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className='p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors'
                        title='حذف المنتج'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='p-8 text-center text-slate-500'>
                    لا توجد منتجات مسجلة لديك حالياً.
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
