'use client';
import React, { useState, useEffect, useCallback } from 'react';
import InventoryFilters from './InventoryFilters';
import InventoryTable from './InventoryTable';
import ProductModal from './ProductModal';
import BarcodeScanner, { type ScannedProduct } from './BarcodeScanner';
import { Plus, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { productService, type Product } from '../../../lib/services/productService';

export type { Product };

export default function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<ScannedProduct | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (e: any) {
      toast.error('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.includes(search) ||
      p.barcode.includes(search) ||
      p.category.includes(search);
    const matchCat = categoryFilter === 'الكل' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'الكل' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = async (product: Product) => {
    try {
      if (editingProduct) {
        const updated = await productService.update(product.id, product);
        if (updated) {
          setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
          toast.success('تم تحديث المنتج بنجاح');
        }
      } else {
        const { id: _id, ...rest } = product;
        const created = await productService.create(rest);
        if (created) {
          setProducts((prev) => [created, ...prev]);
          toast.success('تم إضافة المنتج بنجاح');
        }
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    }
    setModalOpen(false);
    setEditingProduct(null);
    setPrefillData(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setPrefillData(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      await productService.delete(id);
      setTimeout(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeletingIds((prev) => prev.filter((d) => d !== id));
        toast.error('تم حذف المنتج');
      }, 300);
    } catch {
      setDeletingIds((prev) => prev.filter((d) => d !== id));
      toast.error('فشل حذف المنتج');
    }
  };

  const handleBulkDelete = async () => {
    selectedIds.forEach((id) => setDeletingIds((prev) => [...prev, id]));
    try {
      await Promise.all(selectedIds.map((id) => productService.delete(id)));
      setTimeout(() => {
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        setDeletingIds([]);
        toast.error(`تم حذف ${selectedIds.length} منتجات`);
        setSelectedIds([]);
      }, 300);
    } catch {
      setDeletingIds([]);
      toast.error('فشل حذف المنتجات');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setPrefillData(null);
    setScannerOpen(true);
  };

  const handleScanDetected = (scanned: ScannedProduct) => {
    setScannerOpen(false);
    setPrefillData(scanned);
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleScannerClose = () => {
    setScannerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">إدارة المخزون</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            {loading ? 'جاري التحميل...' : `${products.length} منتج — ${products.filter((p) => p.status === 'منخفض' || p.status === 'نفد').length} يحتاج مراجعة`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNewProduct}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
          >
            <ScanLine size={16} />
            إضافة منتج جديد
          </button>
          <button
            onClick={() => { setEditingProduct(null); setPrefillData(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-muted text-foreground border border-border px-4 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-muted/80 active:scale-95 transition-all"
            title="إضافة يدوية"
          >
            <Plus size={16} />
            يدوي
          </button>
        </div>
      </div>

      {/* Filters */}
      <InventoryFilters
        search={search}
        onSearch={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        products={products}
      />

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="slide-up flex items-center justify-between bg-primary text-white rounded-xl px-4 py-3 shadow-lg">
          <span className="font-arabic text-sm font-medium tabular-nums">
            تم تحديد {selectedIds.length} منتج
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="text-white/70 hover:text-white font-arabic text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              إلغاء التحديد
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-danger text-white font-arabic text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
            >
              حذف المحدد
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <InventoryTable
          products={filtered}
          selectedIds={selectedIds}
          deletingIds={deletingIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Barcode Scanner */}
      {scannerOpen && (
        <BarcodeScanner
          onDetected={handleScanDetected}
          onClose={handleScannerClose}
        />
      )}

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); setPrefillData(null); }}
        onSave={handleSave}
        editingProduct={editingProduct}
        prefillData={prefillData}
      />
    </div>
  );
}