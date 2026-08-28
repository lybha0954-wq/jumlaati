'use client';
import React, { useState, useMemo } from 'react';
import { Search, Star, StarOff, Plus, Edit2, Package, Tag, AlertTriangle, X, Check, Percent, Filter, SortAsc, TrendingUp, ChevronDown, Zap, ScanLine } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import BarcodeScanner, { ScannedProduct } from '@/app/inventory-management/components/BarcodeScanner';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  discount: number;
  pinned: boolean;
  status: 'متوفر' | 'منخفض' | 'نفد';
  sold: number;
}

const CATEGORIES = ['الكل', 'زيوت', 'حبوب', 'ألبان', 'مشروبات', 'معلبات', 'منظفات'];
type SortKey = 'default' | 'price_asc' | 'price_desc' | 'stock_asc' | 'best_seller';

const initialProducts: Product[] = [
  { id: 'pr1', name: 'زيت نباتي 5 لتر', category: 'زيوت', price: 85000, stock: 240, unit: 'كرتون', discount: 10, pinned: true, status: 'متوفر', sold: 1240 },
  { id: 'pr2', name: 'سكر أبيض 50 كغ', category: 'حبوب', price: 62000, stock: 18, unit: 'كيس', discount: 0, pinned: false, status: 'منخفض', sold: 870 },
  { id: 'pr3', name: 'أرز بسمتي 25 كغ', category: 'حبوب', price: 74000, stock: 95, unit: 'كيس', discount: 15, pinned: true, status: 'متوفر', sold: 980 },
  { id: 'pr4', name: 'حليب كامل 1 لتر', category: 'ألبان', price: 3500, stock: 0, unit: 'علبة', discount: 0, pinned: false, status: 'نفد', sold: 2100 },
  { id: 'pr5', name: 'مياه معدنية 1.5 لتر', category: 'مشروبات', price: 1200, stock: 500, unit: 'زجاجة', discount: 5, pinned: false, status: 'متوفر', sold: 3400 },
  { id: 'pr6', name: 'معكرونة 500غ', category: 'معلبات', price: 28000, stock: 8, unit: 'كرتون', discount: 0, pinned: false, status: 'منخفض', sold: 560 },
  { id: 'pr7', name: 'صابون غسيل 1 كغ', category: 'منظفات', price: 15000, stock: 120, unit: 'كرتون', discount: 20, pinned: false, status: 'متوفر', sold: 430 },
  { id: 'pr8', name: 'دقيق قمح 25 كغ', category: 'حبوب', price: 38000, stock: 60, unit: 'كيس', discount: 0, pinned: false, status: 'متوفر', sold: 720 },
  { id: 'pr9', name: 'عصير برتقال 1 لتر', category: 'مشروبات', price: 5500, stock: 12, unit: 'علبة', discount: 8, pinned: false, status: 'منخفض', sold: 310 },
  { id: 'pr10', name: 'جبنة بيضاء 1 كغ', category: 'ألبان', price: 12000, stock: 45, unit: 'قطعة', discount: 0, pinned: false, status: 'متوفر', sold: 650 },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  'متوفر': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'منخفض': { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  'نفد':   { bg: 'bg-red-100',     text: 'text-red-700'     },
};

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'default',     label: 'افتراضي' },
  { key: 'best_seller', label: 'الأكثر مبيعاً' },
  { key: 'stock_asc',   label: 'أقل مخزوناً' },
  { key: 'price_desc',  label: 'أعلى سعراً' },
  { key: 'price_asc',   label: 'أقل سعراً' },
];

// Barcode scan mode: 'search' filters results, 'add' fills new product form
type BarcodeScanMode = 'search' | 'add';

export default function SupplierCatalogContent() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ price: string; stock: string; discount: string }>({ price: '', stock: '', discount: '' });
  const [showAddDiscount, setShowAddDiscount] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'زيوت', price: '', stock: '', unit: 'كرتون' });

  // Barcode scanner state
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcodeScanMode, setBarcodeScanMode] = useState<BarcodeScanMode>('search');

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.includes(search) || p.category.includes(search);
      const matchCat = category === 'الكل' || p.category === category;
      const matchDiscount = !showDiscountsOnly || p.discount > 0;
      const matchLowStock = !showLowStockOnly || p.status !== 'متوفر';
      return matchSearch && matchCat && matchDiscount && matchLowStock;
    });

    switch (sortKey) {
      case 'best_seller': list = [...list].sort((a, b) => b.sold - a.sold); break;
      case 'stock_asc':   list = [...list].sort((a, b) => a.stock - b.stock); break;
      case 'price_desc':  list = [...list].sort((a, b) => b.price - a.price); break;
      case 'price_asc':   list = [...list].sort((a, b) => a.price - b.price); break;
      default: {
        const pinned = list.filter((p) => p.pinned);
        const rest = list.filter((p) => !p.pinned);
        list = [...pinned, ...rest];
      }
    }
    return list;
  }, [products, search, category, showDiscountsOnly, showLowStockOnly, sortKey]);

  const togglePin = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditValues({ price: String(p.price), stock: String(p.stock), discount: String(p.discount) });
  };

  const saveEdit = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStock = Number(editValues.stock);
        const newStatus: Product['status'] = newStock === 0 ? 'نفد' : newStock < 20 ? 'منخفض' : 'متوفر';
        return {
          ...p,
          price: Number(editValues.price) || p.price,
          stock: newStock,
          discount: Math.min(99, Math.max(0, Number(editValues.discount) || 0)),
          status: newStatus,
        };
      })
    );
    setEditingId(null);
  };

  const applyDiscount = (id: string) => {
    const val = Number(discountInput);
    if (val >= 0 && val <= 99) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, discount: val } : p)));
    }
    setShowAddDiscount(null);
    setDiscountInput('');
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const stock = Number(newProduct.stock) || 0;
    setProducts((prev) => [
      {
        id: `pr${Date.now()}`,
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock,
        unit: newProduct.unit,
        discount: 0,
        pinned: false,
        status: stock === 0 ? 'نفد' : stock < 20 ? 'منخفض' : 'متوفر',
        sold: 0,
      },
      ...prev,
    ]);
    setNewProduct({ name: '', category: 'زيوت', price: '', stock: '', unit: 'كرتون' });
    setShowAddProduct(false);
  };

  // Handle barcode scan result
  const handleBarcodeDetected = (scanned: ScannedProduct) => {
    setShowBarcodeScanner(false);
    if (barcodeScanMode === 'search') {
      // Filter search results by scanned product name or barcode
      setSearch(scanned.name || scanned.barcode);
    } else {
      // Auto-fill add product form
      const mappedCategory = CATEGORIES.includes(scanned.category) ? scanned.category : 'زيوت';
      setNewProduct((prev) => ({
        ...prev,
        name: scanned.name || prev.name,
        category: mappedCategory,
      }));
      setShowAddProduct(true);
    }
  };

  const openBarcodeForSearch = () => {
    setBarcodeScanMode('search');
    setShowBarcodeScanner(true);
  };

  const openBarcodeForAdd = () => {
    setBarcodeScanMode('add');
    setShowBarcodeScanner(true);
  };

  const discountedProducts = products.filter((p) => p.discount > 0);

  return (
    <div className="space-y-4 pb-6" dir="rtl">

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">الكتالوج والمخزون</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{products.length} منتج — {products.filter((p) => p.status !== 'متوفر').length} يحتاج مراجعة</p>
        </div>
        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className="flex items-center gap-1.5 bg-primary text-white text-xs font-arabic px-3 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
        >
          <Plus size={14} />
          منتج جديد
        </button>
      </div>

      {/* ── Add Product Form ── */}
      {showAddProduct && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground font-arabic">إضافة منتج جديد</p>
            {/* Barcode scan button for add form */}
            <button
              onClick={openBarcodeForAdd}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-arabic px-3 py-1.5 rounded-xl active:scale-95 transition-all"
            >
              <ScanLine size={13} />
              مسح الباركود
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="اسم المنتج"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
              className="col-span-2 border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
              className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORIES.filter((c) => c !== 'الكل').map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              placeholder="الوحدة (كرتون...)"
              value={newProduct.unit}
              onChange={(e) => setNewProduct((p) => ({ ...p, unit: e.target.value }))}
              className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number"
              placeholder="السعر (د.ع)"
              value={newProduct.price}
              onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
              className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number"
              placeholder="الكمية"
              value={newProduct.stock}
              onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))}
              className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addProduct} className="flex-1 bg-primary text-white text-sm font-arabic font-semibold py-2.5 rounded-xl active:scale-95 transition-all">
              إضافة المنتج
            </button>
            <button onClick={() => setShowAddProduct(false)} className="px-4 bg-muted text-muted-foreground text-sm font-arabic rounded-xl active:scale-95 transition-all">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'مميزة', value: products.filter((p) => p.pinned).length, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'عروض', value: discountedProducts.length, icon: Percent, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'تنبيه', value: products.filter((p) => p.status !== 'متوفر').length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((s, i) => {
          const SIcon = s.icon;
          return (
            <div key={i} className={`${s.bg} rounded-2xl p-2.5 flex flex-col items-center text-center gap-1`}>
              <SIcon size={15} className={s.color} />
              <p className={`text-base font-bold tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-arabic leading-tight">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Search Bar with Barcode Button ── */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث حي بالاسم أو الفئة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-2xl pr-9 pl-4 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X size={14} />
            </button>
          )}
        </div>
        {/* Barcode scan button in search bar */}
        <button
          onClick={openBarcodeForSearch}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl active:scale-95 transition-all"
          title="مسح الباركود للبحث"
          aria-label="مسح الباركود"
        >
          <ScanLine size={18} />
        </button>
      </div>

      {/* ── Category Chips + Sort ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all active:scale-95 ${
              category === cat ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Filter Chips Row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowDiscountsOnly(!showDiscountsOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all active:scale-95 ${
            showDiscountsOnly ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          <Percent size={11} />
          العروض فقط
        </button>
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all active:scale-95 ${
            showLowStockOnly ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          <AlertTriangle size={11} />
          مخزون منخفض
        </button>
        <div className="relative mr-auto">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold bg-muted text-muted-foreground transition-all active:scale-95"
          >
            <SortAsc size={11} />
            {sortOptions.find((s) => s.key === sortKey)?.label}
            <ChevronDown size={10} />
          </button>
          {showSortMenu && (
            <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-lg z-20 overflow-hidden min-w-[140px]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setSortKey(opt.key); setShowSortMenu(false); }}
                  className={`w-full text-right px-4 py-2.5 text-xs font-arabic transition-colors ${
                    sortKey === opt.key ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Discounts Section ── */}
      {discountedProducts.length > 0 && !showDiscountsOnly && category === 'الكل' && !search && (
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-accent/20">
            <Zap size={15} className="text-accent" />
            <h2 className="text-sm font-bold text-foreground font-arabic">منتجات بعروض نشطة</h2>
            <span className="bg-accent text-white text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full mr-auto">{discountedProducts.length}</span>
          </div>
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
            {discountedProducts.map((p) => (
              <div key={p.id} className="flex-shrink-0 bg-white rounded-xl p-3 border border-accent/20 min-w-[130px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="bg-accent text-white text-[10px] font-arabic font-bold px-1.5 py-0.5 rounded-lg">-{p.discount}٪</span>
                  {p.pinned && <Star size={11} className="text-amber-500 fill-amber-500" />}
                </div>
                <p className="text-xs font-semibold text-foreground font-arabic leading-tight">{p.name}</p>
                <p className="text-[10px] text-muted-foreground font-arabic mt-0.5">{fmt(Math.round(p.price * (1 - p.discount / 100)))}</p>
                <p className="text-[10px] text-muted-foreground font-arabic line-through">{fmt(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Products List ── */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-arabic text-sm">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            لا توجد منتجات مطابقة
          </div>
        )}
        {filtered.map((p) => {
          const ss = statusStyle[p.status];
          const isEditing = editingId === p.id;
          const isAddingDiscount = showAddDiscount === p.id;
          return (
            <div key={p.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${p.pinned ? 'border-amber-300 shadow-sm' : p.status === 'نفد' ? 'border-red-200' : 'border-border'}`}>
              <div className="flex items-center gap-3 p-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.pinned ? 'bg-amber-100' : p.status === 'نفد' ? 'bg-red-50' : 'bg-muted'}`}>
                  <Package size={18} className={p.pinned ? 'text-amber-600' : p.status === 'نفد' ? 'text-red-400' : 'text-muted-foreground'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-foreground font-arabic truncate">{p.name}</p>
                    {p.pinned && <Star size={11} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
                    {p.discount > 0 && (
                      <span className="bg-accent/10 text-accent text-[10px] font-arabic font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">-{p.discount}٪</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-arabic">{p.category}</span>
                    <span className={`text-[10px] font-arabic font-semibold px-1.5 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>{p.status}</span>
                    <span className="text-[10px] text-muted-foreground font-arabic tabular-nums">مخزون: {p.stock} {p.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp size={10} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-arabic">{p.sold.toLocaleString('ar-IQ')} مبيع</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <p className="text-sm font-bold text-foreground tabular-nums font-arabic">{fmt(p.price)}</p>
                  {p.discount > 0 && (
                    <p className="text-[10px] text-emerald-600 font-arabic tabular-nums">{fmt(Math.round(p.price * (1 - p.discount / 100)))}</p>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(p.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${p.pinned ? 'bg-amber-100 text-amber-600' : 'bg-muted text-muted-foreground'}`}
                      title={p.pinned ? 'إلغاء التثبيت' : 'تثبيت كأفضل مبيعاً'}
                    >
                      {p.pinned ? <Star size={13} className="fill-amber-500" /> : <StarOff size={13} />}
                    </button>
                    <button
                      onClick={() => setShowAddDiscount(isAddingDiscount ? null : p.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${isAddingDiscount ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}
                      title="إضافة خصم"
                    >
                      <Tag size={13} />
                    </button>
                    <button
                      onClick={() => isEditing ? saveEdit(p.id) : startEdit(p)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${isEditing ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                      title={isEditing ? 'حفظ' : 'تعديل'}
                    >
                      {isEditing ? <Check size={13} /> : <Edit2 size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Row */}
              {isEditing && (
                <div className="px-3 pb-3 pt-0 flex gap-2 border-t border-border bg-muted/20">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-arabic">السعر {CURRENCY}</label>
                    <input
                      type="number"
                      value={editValues.price}
                      onChange={(e) => setEditValues((v) => ({ ...v, price: e.target.value }))}
                      className="w-full border border-border rounded-lg px-2 py-1.5 text-xs font-arabic bg-white focus:outline-none focus:ring-1 focus:ring-primary/30 mt-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-arabic">المخزون</label>
                    <input
                      type="number"
                      value={editValues.stock}
                      onChange={(e) => setEditValues((v) => ({ ...v, stock: e.target.value }))}
                      className="w-full border border-border rounded-lg px-2 py-1.5 text-xs font-arabic bg-white focus:outline-none focus:ring-1 focus:ring-primary/30 mt-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-arabic">خصم ٪</label>
                    <input
                      type="number"
                      value={editValues.discount}
                      onChange={(e) => setEditValues((v) => ({ ...v, discount: e.target.value }))}
                      className="w-full border border-border rounded-lg px-2 py-1.5 text-xs font-arabic bg-white focus:outline-none focus:ring-1 focus:ring-primary/30 mt-0.5"
                      min="0"
                      max="99"
                    />
                  </div>
                </div>
              )}

              {/* Discount Quick Add */}
              {isAddingDiscount && !isEditing && (
                <div className="px-3 pb-3 pt-0 flex items-center gap-2 border-t border-border bg-accent/5">
                  <Percent size={14} className="text-accent flex-shrink-0" />
                  <input
                    type="number"
                    placeholder="نسبة الخصم ٪ (0-99)"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="flex-1 border border-border rounded-lg px-2 py-1.5 text-xs font-arabic bg-white focus:outline-none focus:ring-1 focus:ring-accent/30"
                    min="0"
                    max="99"
                  />
                  <button
                    onClick={() => applyDiscount(p.id)}
                    className="bg-accent text-white text-xs font-arabic px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                  >
                    تطبيق
                  </button>
                  <button onClick={() => setShowAddDiscount(null)} className="text-muted-foreground">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground font-arabic">
          عرض {filtered.length} من {products.length} منتج
        </p>
      )}
    </div>
  );
}
