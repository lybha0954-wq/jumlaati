'use client';
import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Product } from './InventoryContent';

interface InventoryFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  products: Product[];
}

const statusOptions = ['الكل', 'متوفر', 'منخفض', 'نفد', 'موقوف'];

export default function InventoryFilters({
  search, onSearch,
  categoryFilter, onCategoryFilter,
  statusFilter, onStatusFilter,
  products,
}: InventoryFiltersProps) {
  const categories = ['الكل', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="بحث بالاسم أو الباركود أو الفئة..."
          className="w-full bg-card border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
        />
      </div>

      {/* Category filter */}
      <div className="relative">
        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value)}
          className="bg-card border border-border rounded-xl pr-8 pl-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none cursor-pointer transition-all min-w-[140px]"
        >
          {categories.map((cat) => (
            <option key={`cat-opt-${cat}`} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statusOptions.map((s) => (
          <button
            key={`status-chip-${s}`}
            onClick={() => onStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all border ${
              statusFilter === s
                ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}