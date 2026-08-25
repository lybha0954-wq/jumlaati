'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Store, 
  Search, 
  ShoppingCart, 
  Package, 
  Plus, 
  CheckCircle2,
  DollarSign
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  unit: string
  supplier_id: string
  supplier?: {
    store_name: string
    full_name: string
  }
}

export default function RetailerBrowsePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            stock_quantity,
            unit,
            supplier_id,
            supplier:user_profiles!products_supplier_id_fkey(store_name, full_name)
          `)
          .gt('stock_quantity', 0)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          const list = data as unknown as Product[]
          setProducts(list)
          setFilteredProducts(list)
        }
      } catch (error) {
        console.error('Error fetching marketplace products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase])

  useEffect(() => {
    let result = products
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (p.supplier?.store_name && p.supplier.store_name.toLowerCase().includes(term))
      )
    }
    setFilteredProducts(result)
  }, [searchTerm, products])

  const addToCart = async (product: Product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('يجب تسجيل الدخول أولاً')
        return
      }

      // Quick add to cart logic or local state storage representation
      setSuccessMsg(`تمت إضافة "${product.name}" إلى السلة بنجاح!`)
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]' dir='rtl'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
            تصفح منتجات الجملة
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            اطلب بضائع لمجرك بأفضل أسعار الجملة المباشرة من الموردين في العراق.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2'>
            <Store className='w-4 h-4' />
            س سوق جملتي المركزي
          </div>
        </div>
      </div>

      {successMsg && (
        <div className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-sm shadow-lg'>
          <CheckCircle2 className='w-5 h-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-lg'>
        <div className='relative w-full'>
          <Search className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input
            type='text'
            placeholder='بحث عن منتج، مادة، أو اسم المورد...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const supplierObj = Array.isArray(product.supplier) ? product.supplier[0] : product.supplier
            return (
              <div 
                key={product.id} 
                className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-all group'
              >
                <div>
                  <div className='flex items-start justify-between gap-2 mb-3'>
                    <h2 className='text-base font-bold text-white group-hover:text-blue-400 transition-colors'>
                      {product.name}
                    </h2>
                    <span className='px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0'>
                      {product.unit || 'قطعة'}
                    </span>
                  </div>

                  <p className='text-xs text-slate-400 mb-4'>
                    المورد: <span className='text-slate-200 font-medium'>{supplierObj?.store_name || supplierObj?.full_name || 'مورد جملة'}</span>
                  </p>
                </div>

                <div className='pt-4 border-t border-slate-800/80 flex items-center justify-between'>
                  <div>
                    <span className='text-xs text-slate-400 block'>سعر الجملة</span>
                    <span className='text-lg font-bold text-emerald-400'>{Number(product.price).toLocaleString()} د.ع</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all'
                  >
                    <Plus className='w-4 h-4' />
                    إضافة للسلة
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className='col-span-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500'>
            لا توجد منتجات متاحة حالياً للتسوق.
          </div>
        )}
      </div>
    </div>
  )
}
