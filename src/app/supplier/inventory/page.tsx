'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { productService, Product } from '@/lib/services/productService';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'أغذية عامة',
  'ألبان وأجبان',
  'زيوت وبقوليات',
  'مشروبات وعصائر',
  'منظفات وعناية',
  'حلويات وسكاكر',
  'معلبات',
];

const UNITS = ['كرتونة', 'كيس', 'صندوق', 'طرد', 'قطعة', 'درزن'];

export default function SupplierInventoryPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('أغذية عامة');
  const [barcode, setBarcode] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [minOrderQty, setMinOrderQty] = useState('5');
  const [unit, setUnit] = useState('كرتونة');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = async () => {
    try {
      const all = await productService.getAll();
      setProducts(all);
    } catch (e) {
      console.error('Failed to load inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !finalPrice) {
      toast.error('يرجى ملء اسم المنتج والسعر');
      return;
    }

    setIsSubmitting(true);
    try {
      const pFinal = Number(finalPrice) || 0;
      const pOrig = Number(originalPrice) || pFinal;
      const stockNum = Number(stock) || 0;
      const minQty = Number(minOrderQty) || 1;

      const created = await productService.create({
        name: name.trim(),
        category,
        barcode: barcode.trim() || `${Date.now()}`,
        costPrice: Math.round(pFinal * 0.85),
        originalPrice: pOrig,
        finalPrice: pFinal,
        stock: stockNum,
        minOrderQty: minQty,
        unit,
        status: stockNum <= 0 ? 'نفد' : stockNum <= minQty * 2 ? 'منخفض' : 'متوفر',
        supplierId: user?.uid || 'general-supplier',
        supplierName: profile?.businessName || profile?.fullName || 'مورد جُمْلَتِي',
        supplierRating: 4.9,
        deliveryDays: 1,
      });

      if (created) {
        toast.success('تمت إضافة المنتج إلى المخزون بنجاح!');
        setShowAddModal(false);
        // Reset form
        setName('');
        setBarcode('');
        setOriginalPrice('');
        setFinalPrice('');
        setStock('50');
        setMinOrderQty('5');
        loadProducts();
      } else {
        toast.error('تعذر حفظ المنتج في قاعدة البيانات');
      }
    } catch (err) {
      console.error('Add product error:', err);
      toast.error('حدث خطأ أثناء حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    let status: Product['status'] = 'متوفر';
    if (newStock <= 0) status = 'نفد';
    else if (newStock <= product.minOrderQty * 2) status = 'منخفض';

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock, status } : p))
    );

    await productService.update(product.id, { stock: newStock, status });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المخزون؟')) return;
    const ok = await productService.delete(id);
    if (ok) {
      toast.success('تم حذف المنتج');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error('تعذر حذف المنتج');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout activeRoute="/inventory-management">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">إدارة المخزون والمنتجات</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              متابعة الكميات، تحديث الأسعار، وإضافة بضائع الجملة للمنصة
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 font-arabic self-start sm:self-auto"
          >
            <Plus size={16} />
            إضافة منتج جديد
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المنتج أو الباركود..."
            className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* Inventory List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-card border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Package size={42} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد منتجات في المخزون</h3>
            <p className="text-xs text-muted-foreground font-arabic mt-1 mb-4">
              أضف أول منتج لك في منصة جُمْلَتِي لتبدأ محلات التجزئة بالطلب
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold font-arabic hover:bg-primary/90"
            >
              <Plus size={14} />
              إضافة منتج الآن
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-arabic">
                      {p.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      باركود: {p.barcode || '—'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground font-arabic">{p.name}</h3>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    السعر: <span className="font-bold text-foreground">{p.finalPrice.toLocaleString()} د.ع</span> • أدنى طلب: {p.minOrderQty} {p.unit}
                  </p>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-arabic">الكمية:</span>
                    <button
                      type="button"
                      onClick={() => handleStockAdjust(p, -5)}
                      className="w-7 h-7 rounded-lg border border-border text-foreground hover:bg-muted font-bold text-xs"
                    >
                      -5
                    </button>
                    <span className="w-16 text-center font-bold text-sm font-arabic text-foreground">
                      {p.stock} <span className="text-xs text-muted-foreground">{p.unit}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStockAdjust(p, 5)}
                      className="w-7 h-7 rounded-lg border border-border text-foreground hover:bg-muted font-bold text-xs"
                    >
                      +5
                    </button>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold font-arabic ${
                      p.stock <= 0
                        ? 'bg-rose-500/10 text-rose-600'
                        : p.stock <= p.minOrderQty * 2
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {p.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="حذف المنتج"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-lg font-bold text-foreground font-arabic">إضافة منتج جديد للمخزون</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                    اسم المنتج الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: زيت نباتي لتر كرتونة 12 علبة"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      التصنيف
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      الباركود
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="628100000000"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      سعر البيع بالجملة (د.ع) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      placeholder="25000"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      السعر الأصلي / قبل الخصم
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="28000"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      الكمية المتوفرة
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="50"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      أدنى طلب
                    </label>
                    <input
                      type="number"
                      value={minOrderQty}
                      onChange={(e) => setMinOrderQty(e.target.value)}
                      placeholder="5"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      الوحدة
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold font-arabic text-muted-foreground hover:bg-muted"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold font-arabic hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ المنتج في المخزون'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
