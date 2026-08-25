'use client';
import React, { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';
import { Edit2, Trash2, ChevronUp, ChevronDown, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from './InventoryContent';

interface InventoryTableProps {
  products: Product[];
  selectedIds: string[];
  deletingIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'name' | 'stock' | 'finalPrice' | 'minOrderQty';

export default function InventoryTable({
  products, selectedIds, deletingIds,
  onToggleSelect, onToggleSelectAll, onEdit, onDelete,
}: InventoryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...products].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal, 'ar') : bVal.localeCompare(aVal, 'ar');
    }
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col mr-1">
      <ChevronUp size={10} className={sortKey === k && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40'} />
      <ChevronDown size={10} className={sortKey === k && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40'} />
    </span>
  );

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl">
        <EmptyState
          icon={<Package size={28} />}
          title="لا توجد منتجات"
          description="لم يتم العثور على منتجات تطابق الفلاتر المحددة. جرب تغيير معايير البحث."
          action={null}
        />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-right">
                <input
                  type="checkbox"
                  checked={selectedIds.length === products.length && products.length > 0}
                  onChange={onToggleSelectAll}
                  className="rounded border-border cursor-pointer"
                  aria-label="تحديد الكل"
                />
              </th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">الباركود</th>
              <th
                className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('name')}
              >
                اسم المنتج <SortIcon k="name" />
              </th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">الفئة</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">سعر التكلفة</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">السعر الأصلي</th>
              <th
                className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('finalPrice')}
              >
                السعر النهائي <SortIcon k="finalPrice" />
              </th>
              <th
                className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('stock')}
              >
                المخزون <SortIcon k="stock" />
              </th>
              <th
                className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('minOrderQty')}
              >
                الحد الأدنى <SortIcon k="minOrderQty" />
              </th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">الحالة</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground font-arabic">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product, idx) => {
              const isDeleting = deletingIds.includes(product.id);
              const isSelected = selectedIds.includes(product.id);
              const isLowStock = product.status === 'منخفض' || product.status === 'نفد';
              return (
                <tr
                  key={`inv-row-${product.id}`}
                  className={`
                    border-b border-border/60 transition-all duration-300
                    ${isDeleting ? 'row-delete-exit' : ''}
                    ${isSelected ? 'bg-primary/5' : idx % 2 === 0 ? '' : 'bg-muted/20'}
                    ${isLowStock ? 'bg-red-50/40' : ''}
                    hover:bg-muted/40
                  `}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(product.id)}
                      className="rounded border-border cursor-pointer"
                      aria-label={`تحديد ${product.name}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">{product.barcode}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-arabic text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="font-arabic text-xs text-muted-foreground">{product.unit}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs bg-secondary text-secondary-foreground rounded-lg px-2 py-1 font-arabic font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-arabic text-xs text-muted-foreground tabular-nums">
                      {(product.costPrice ?? 0).toLocaleString('ar-IQ')} د.ع
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-arabic text-xs text-muted-foreground tabular-nums line-through">
                      {(product.originalPrice ?? 0).toLocaleString('ar-IQ')} د.ع
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-arabic text-sm font-bold text-primary tabular-nums">
                      {(product.finalPrice ?? 0).toLocaleString('ar-IQ')} د.ع
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`font-arabic text-sm font-semibold tabular-nums ${
                      product.stock === 0 ? 'text-danger' : product.stock < 20 ? 'text-warning' : 'text-foreground'
                    }`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-arabic text-xs text-muted-foreground tabular-nums">
                      {product.minOrderQty} {product.unit}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={product.status ?? ''} size="sm" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="تعديل المنتج"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-red-50 transition-colors"
                        title="حذف المنتج — لا يمكن التراجع"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground font-arabic tabular-nums">
          عرض {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} من {sorted.length} منتج
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={`inv-page-${i + 1}`}
              onClick={() => setPage(i + 1)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                page === i + 1 ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}