'use client';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface UseLocalSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  minChars?: number;
}

/**
 * useLocalSearch — instant client-side filtering hook
 * Zero API calls, filters data locally as user types
 */
export function useLocalSearch<T>({ data, searchFields, minChars = 1 }: UseLocalSearchOptions<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < minChars) return data;
    return data.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        if (typeof val === 'string') return val.toLowerCase().includes(q);
        if (typeof val === 'number') return String(val).includes(q);
        return false;
      })
    );
  }, [data, query, searchFields, minChars]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, filtered, clearSearch, hasQuery: query.trim().length >= minChars };
}

interface LocalSearchInputProps {
  query: string;
  onQueryChange: (q: string) => void;
  onClear: () => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
  className?: string;
}

/**
 * LocalSearchInput — reusable instant search input component
 */
export function LocalSearchInput({
  query,
  onQueryChange,
  onClear,
  placeholder = 'بحث فوري...',
  resultCount,
  totalCount,
  className = '',
}: LocalSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-xl pr-9 pl-9 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
        dir="rtl"
      />
      {query && (
        <button
          onClick={() => { onClear(); inputRef.current?.focus(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="مسح البحث"
        >
          <X size={14} />
        </button>
      )}
      {query && resultCount !== undefined && totalCount !== undefined && (
        <div className="absolute left-full mr-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 mr-2 whitespace-nowrap">
          <span className="text-xs font-arabic text-muted-foreground">
            {resultCount} من {totalCount}
          </span>
        </div>
      )}
    </div>
  );
}
