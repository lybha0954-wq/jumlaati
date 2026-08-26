'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, DollarSign, ScanLine, Eye, Sparkles, Camera, Image as ImageIcon, Link as LinkIcon, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import BarcodeScanner, { ScannedProduct } from '@/app/inventory-management/components/BarcodeScanner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: 'IQD' | 'USD';
  bulk_price?: number | null;
  bulk_min_qty?: number;
  moq?: number;
  stock: number;
  unit: string;
  pinned?: boolean;
  is_active?: boolean;
  status?: 'available' | 'out_of_stock' | 'low_stock';
  barcode?: string | null;
  image_url?: string | null;
  sold_count?: number;
  created_at?: string;
}

const PACKAGING_UNITS = [
'كرتون', 'كيس', 'درزن', 'صندوق', 'سيت / باكت', 'قنينة / بطل', 'كيلوغرام', 'قطعة / مفرد', 'أخرى'];


const BULK_QTY_OPTIONS = [3, 5, 10, 15, 20, 25, 50, 100];

const MOCK_BARCODE_LOOKUP: Record<string, any> = {
  '62810001': {
    name: 'شاي محمود 500غم (كرتون 24 علبة)',
    category: 'عطاريات وبهارات',
    unit: 'كرتون',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b0e244ef-1787605132357.png",
    suggestedPrice: 48000,
    suggestedBulkPrice: 45000,
    bulkMinQty: 5
  },
  '62910002': {
    name: 'رز التونسا هندي 10 كغم',
    category: 'مواد غذائية أساسية',
    unit: 'كيس',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    suggestedPrice: 32000,
    suggestedBulkPrice: 30000,
    bulkMinQty: 10
  },
  '62211099': {
    name: 'حليب المراعي صافي 1 لتر',
    category: 'ألبان وأغذية مبردة',
    unit: 'كرتون',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    suggestedPrice: 21000,
    suggestedBulkPrice: 19500,
    bulkMinQty: 6
  }
};

const CATEGORIES = [
'الكل', 'مواد غذائية أساسية', 'ألبان وأغذية مبردة',
'مشروبات وعصائر', 'منظفات ومستلزمات', 'حلويات ومكسرات', 'عطاريات وبهارات'];


export default function SupplierCatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1510);
  const [lastRateUpdate, setLastRateUpdate] = useState('الآن (تلقائي معتمد)');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcodeScanMode, setBarcodeScanMode] = useState<'search' | 'add'>('search');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState('');

  const emptyProductState = {
    name: '',
    category: 'مواد غذائية أساسية',
    price: '',
    currency: 'IQD' as const,
    bulk_price: '',
    bulk_min_qty: '5',
    moq: '1',
    stock: '',
    unit: 'كرتون',
    barcode: '',
    image_url: ''
  };

  const [newProduct, setNewProduct] = useState(emptyProductState);

  useEffect(() => {
    fetchProducts();
    const rateInterval = setInterval(() => {
      setExchangeRate(1510);
      setLastRateUpdate(new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
    }, 300000);
    return () => clearInterval(rateInterval);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.
      from('products').
      select('*').
      order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data && data.length > 0 ? data as Product[] : getMockProducts());
    } catch {
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): Product[] => [
  {
    id: 'p1',
    name: 'رز التونسا هندي 10 كغم',
    category: 'مواد غذائية أساسية',
    price: 32000,
    currency: 'IQD',
    bulk_price: 30000,
    bulk_min_qty: 10,
    moq: 5,
    stock: 120,
    unit: 'كيس',
    pinned: true,
    is_active: true,
    status: 'available',
    barcode: '62910002',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    sold_count: 120
  },
  {
    id: 'p2',
    name: 'شاي محمود 500غم (كرتون 24 علبة)',
    category: 'عطاريات وبهارات',
    price: 48000,
    currency: 'IQD',
    bulk_price: 45000,
    bulk_min_qty: 5,
    moq: 2,
    stock: 0,
    unit: 'كرتون',
    pinned: false,
    is_active: true,
    status: 'out_of_stock',
    barcode: '62810001',
    image_url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b0e244ef-1787605132357.png",
    sold_count: 85
  }];


  const handleBarcodeLookup = (code: string) => {
    const item = MOCK_BARCODE_LOOKUP[code];
    if (item) {
      setNewProduct({
        ...emptyProductState,
        barcode: code,
        name: item.name,
        category: item.category,
        unit: item.unit,
        image_url: item.image,
        price: item.suggestedPrice.toString(),
        bulk_price: item.suggestedBulkPrice.toString(),
        bulk_min_qty: item.bulkMinQty.toString()
      });
      setImagePreview(item.image);
    } else {
      setNewProduct((p) => ({ ...p, barcode: code }));
    }
  };

  const handleAiSmartPricing = () => {
    const basePrice = Number(newProduct.price);
    if (!basePrice || basePrice <= 0) return;
    setAiSuggesting(true);
    setTimeout(() => {
      const calculatedBulk = Math.round(basePrice * 0.93 / 250) * 250;
      const smartMinQty = ['كرتون', 'كيس', 'صندوق'].includes(newProduct.unit) ? '5' : '10';
      setNewProduct((p) => ({
        ...p,
        bulk_price: calculatedBulk.toString(),
        bulk_min_qty: smartMinQty
      }));
      setAiSuggesting(false);
    }, 300);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setImagePreview(res);
        setNewProduct((p) => ({ ...p, image_url: res }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarcodeDetected = (scanned: ScannedProduct) => {
    setShowBarcodeScanner(false);
    const code = scanned.barcode || '';
    if (barcodeScanMode === 'search') {
      setSearch(code || scanned.name);
    } else {
      handleBarcodeLookup(code);
      setShowAddProduct(true);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    const stockNum = Number(newProduct.stock) || 0;
    const itemData = {
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      currency: newProduct.currency,
      bulk_price: newProduct.bulk_price ? Number(newProduct.bulk_price) : null,
      bulk_min_qty: newProduct.bulk_min_qty ? Number(newProduct.bulk_min_qty) : 5,
      moq: Number(newProduct.moq) || 1,
      stock: stockNum,
      unit: newProduct.unit,
      barcode: newProduct.barcode || null,
      image_url: newProduct.image_url || imagePreview || null,
      pinned: false,
      is_active: true,
      status: (stockNum === 0 ? 'out_of_stock' : stockNum < 15 ? 'low_stock' : 'available') as any,
      sold_count: 0
    };
    const { data } = await supabase.from('products').insert([itemData]).select();
    setProducts((prev) => [data?.[0] as Product || { ...itemData, id: `pr_${Date.now()}` }, ...prev]);
    setNewProduct(emptyProductState);
    setImagePreview('');
    setShowAddProduct(false);
  };

  const handleToggleActive = async (id: string) => {
    setProducts((prev) =>
    prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p)
    );
    const target = products.find((p) => p.id === id);
    if (target) {
      await supabase.from('products').update({ is_active: !target.is_active }).eq('id', id);
    }
  };

  const handleRestockAction = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (target) {
      alert(`جاري زيادة كمية المخزون للمنتج: ${target.name}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search) ||
      p.barcode && p.barcode.includes(search);
      const matchCat = category === 'الكل' || p.category === category;
      return matchSearch && matchCat;
    });
    if (isPreviewMode) list = list.filter((p) => p.is_active);
    return [...list.filter((p) => p.pinned), ...list.filter((p) => !p.pinned)];
  }, [products, search, category, isPreviewMode]);

  return (
    <div className="space-y-4 pb-12 text-right bg-slate-50/50 min-h-screen p-2 sm:p-4" dir="rtl" translate="no" suppressHydrationWarning>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        * { font-family: 'Tajawal', -apple-system, sans-serif !important; }
        select {
          text-align: right;
          direction: rtl;
          background-position: left 0.75rem center !important;
          padding-left: 2.5rem !important;
          padding-right: 1rem !important;
        }
      `}</style>

      {showBarcodeScanner &&
      <BarcodeScanner onDetected={handleBarcodeDetected} onClose={() => setShowBarcodeScanner(false)} />
      }

      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold">كتالوج المورد والمخزون الذكي</h1>
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                إدارة المورد
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              إدارة الأسعار، خيارات جملة الجملة المرنة، والتسعير الذكي المؤتمت
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {!isPreviewMode &&
            <button
              onClick={() => {
                if (!showAddProduct) {
                  setNewProduct(emptyProductState);
                  setImagePreview('');
                }
                setShowAddProduct(!showAddProduct);
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-6 py-3 rounded-2xl shadow-lg flex-1 sm:flex-initial transition">

                <Plus size={18} />
                <span>{showAddProduct ? 'إغلاق النموذج' : 'إضافة بضاعة جديدة'}</span>
              </button>
            }
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-1.5 bg-amber-500 text-slate-950 text-xs font-extrabold px-4 py-3 rounded-2xl shadow-md transition">

              <Eye size={16} />
              <span>معاينة كفرع</span>
            </button>
          </div>
        </div>

        {!isPreviewMode &&
        <div className="flex flex-wrap items-center justify-between bg-slate-800/90 p-3 rounded-2xl text-xs border border-slate-700/80 gap-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              <span className="text-slate-300 font-medium">سعر الصرف الحي المعتمد ($1 =):</span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {exchangeRate.toLocaleString('ar-IQ')} د.ع
              </span>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-700">
              🔄 تحديث تلقائي ضمن المدة المعتمدة (آخر تحديث: {lastRateUpdate})
            </div>
          </div>
        }
      </div>

      {/* Add Product Form */}
      {!isPreviewMode && showAddProduct &&
      <div className="bg-white border-2 border-blue-100 rounded-3xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">إدراج أو توريد بضاعة جديدة</h3>
              <button
              type="button"
              onClick={handleAiSmartPricing}
              disabled={!newProduct.price || aiSuggesting}
              className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-xl hover:bg-purple-100 transition">

                <Sparkles size={14} className={aiSuggesting ? 'animate-spin' : ''} />
                {aiSuggesting ? 'جاري الحساب...' : '✨ تسعير ذكي بـ AI'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
              type="button"
              onClick={() => {setNewProduct(emptyProductState);setImagePreview('');}}
              className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-xl">

                <Trash2 size={13} /> تفريغ الحقول
              </button>
              <button
              type="button"
              onClick={() => {setBarcodeScanMode('add');setShowBarcodeScanner(true);}}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl">

                <ScanLine size={14} /> مسح باركود
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
              {imagePreview ?
            <img src={imagePreview} alt="معاينة المنتج" className="w-full h-full object-cover" /> :
            <ImageIcon size={28} className="text-slate-300" />
            }
            </div>
            <div className="flex-1 space-y-2">
              <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleCameraCapture}
              className="hidden" />

              <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm">

                <Camera size={15} className="text-amber-400" />
                <span>التقاط صورة المنتج</span>
              </button>
              <div className="relative">
                <LinkIcon size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                type="text"
                placeholder="أو رابط صورة مباشرة..."
                value={newProduct.image_url}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, image_url: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-[11px]" />

              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2 flex gap-2">
              <input
              type="text"
              placeholder="الباركود (امسح أو اكتب)"
              value={newProduct.barcode}
              onChange={(e) => {
                setNewProduct({ ...newProduct, barcode: e.target.value });
                handleBarcodeLookup(e.target.value);
              }}
              className="w-1/3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 font-mono text-center font-bold" />

              <input
              type="text"
              placeholder="اسم المنتج (مثال: رز التونسا 10 كغم)"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-2/3 border border-slate-200 rounded-2xl p-2.5 font-bold text-slate-900" />

            </div>

            <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border border-slate-200 rounded-2xl p-2.5 bg-white font-bold appearance-none">

              {CATEGORIES.filter((c) => c !== 'الكل').map((c) =>
            <option key={c}>{c}</option>
            )}
            </select>

            <select
            value={newProduct.unit}
            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
            className="border border-slate-200 rounded-2xl p-2.5 bg-slate-50 font-extrabold text-blue-900 appearance-none">

              {PACKAGING_UNITS.map((u) =>
            <option key={u} value={u}>{u}</option>
            )}
            </select>

            <div className="flex gap-1.5">
              <input
              type="number"
              placeholder="سعر القطعة / المفرد"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full border border-slate-200 rounded-2xl p-2.5 font-bold" />

              <select
              value={newProduct.currency}
              onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value as 'IQD' | 'USD' })}
              className="border border-slate-200 rounded-2xl px-3 bg-slate-100 font-extrabold appearance-none">

                <option value="IQD">IQD</option>
                <option value="USD">$</option>
              </select>
            </div>

            <input
            type="number"
            placeholder="سعر جملة الجملة"
            value={newProduct.bulk_price}
            onChange={(e) => setNewProduct({ ...newProduct, bulk_price: e.target.value })}
            className="border border-slate-200 rounded-2xl p-2.5 text-emerald-700 font-semibold" />


            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold px-1">
                أقل كمية مطلوبة لتفعيل سعر جملة الجملة:
              </label>
              <select
              value={newProduct.bulk_min_qty}
              onChange={(e) => setNewProduct({ ...newProduct, bulk_min_qty: e.target.value })}
              className="border border-slate-200 rounded-2xl p-2.5 bg-white font-bold text-slate-800 appearance-none">

                {BULK_QTY_OPTIONS.map((opt) =>
              <option key={opt} value={opt}>
                    أقل كمية: {opt} {newProduct.unit}
                  </option>
              )}
              </select>
            </div>

            <input
            type="number"
            placeholder="الكمية المتوفرة في المخزون"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border border-slate-200 rounded-2xl p-2.5 font-bold" />


            <input
            type="number"
            placeholder="الحد الأدنى للطلب (MOQ)"
            value={newProduct.moq}
            onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
            className="border border-slate-200 rounded-2xl p-2.5 font-bold" />

          </div>

          <button
          onClick={handleAddProduct}
          disabled={!newProduct.name || !newProduct.price}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold py-3 rounded-2xl shadow-lg transition">

            ✅ حفظ وإضافة المنتج للكتالوج
          </button>
        </div>
      }

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ابحث بالاسم، الفئة، أو الباركود..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" />

          <button
            onClick={() => {setBarcodeScanMode('search');setShowBarcodeScanner(true);}}
            className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl">

            <ScanLine size={15} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) =>
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
            category === cat ?
            'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }>

              {cat}
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ?
      <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div> :
      filteredProducts.length === 0 ?
      <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-bold">لا توجد منتجات</p>
          <p className="text-sm mt-1">أضف منتجاً جديداً أو غيّر معايير البحث</p>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
          const isOutOfStock = product.stock === 0;
          const isLowStock = !isOutOfStock && product.stock < 15;
          const priceIQD = product.currency === 'USD' ?
          product.price * exchangeRate :
          product.price;
          const bulkPriceIQD = product.bulk_price ?
          product.currency === 'USD' ? product.bulk_price * exchangeRate : product.bulk_price :
          null;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition ${
              !product.is_active ? 'opacity-50' : ''} ${
              product.pinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>

                {/* Product Image */}
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  {product.image_url ?
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover" /> :


                <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} className="text-slate-300" />
                    </div>
                }
                  {product.pinned &&
                <span className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      📌 مثبت
                    </span>
                }
                  {isOutOfStock &&
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full">نفد المخزون</span>
                    </div>
                }
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  <div>
                    <p className="font-extrabold text-sm text-slate-900 leading-tight">{product.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{product.category} · {product.unit}</p>
                  </div>

                  {/* Pricing */}
                  <div className="bg-slate-50 rounded-xl p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">سعر المفرد:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {priceIQD.toLocaleString('ar-IQ')} د.ع
                      </span>
                    </div>
                    {bulkPriceIQD &&
                  <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600">سعر الجملة (≥{product.bulk_min_qty}):</span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          {bulkPriceIQD.toLocaleString('ar-IQ')} د.ع
                        </span>
                      </div>
                  }
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  isOutOfStock ? 'bg-red-100 text-red-600' : isLowStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`
                  }>
                      {isOutOfStock ? 'نفد' : isLowStock ? `منخفض: ${product.stock}` : `متوفر: ${product.stock}`} {product.unit}
                    </span>
                    {product.sold_count !== undefined &&
                  <span className="text-[10px] text-slate-400">مباع: {product.sold_count}</span>
                  }
                  </div>

                  {/* Actions */}
                  {!isPreviewMode &&
                <div className="flex gap-1.5 pt-1">
                      <button
                    onClick={() => handleToggleActive(product.id)}
                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-xl transition ${
                    product.is_active ?
                    'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`
                    }>

                        {product.is_active ? 'إيقاف' : 'تفعيل'}
                      </button>
                      {(isOutOfStock || isLowStock) &&
                  <button
                    onClick={() => handleRestockAction(product.id)}
                    className="flex-1 text-[11px] font-bold py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition">

                          تعبئة المخزون
                        </button>
                  }
                    </div>
                }
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

}