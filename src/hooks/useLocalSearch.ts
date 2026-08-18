'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface UseLocalSearchOptions<T> {
  data: T[];
    searchFields: (keyof T)[];
      minChars?: number;
      }

      /**
       * دالة توحيد النصوص العربية لتجاهل الهمزات والتنوين أثناء البحث
        */
        function normalizeArabicText(text: string): string {
          return text
              .toLowerCase()
                  .replace(/[\u064B-\u0652]/g, '') // إزالة التنوين والحركات
                      .replace(/[أإآ]/g, 'ا') // توحيد الألف
                          .replace(/ة/g, 'ه') // توحيد التاء المربوطة
                              .replace(/ى/g, 'ي'); // توحيد الألف المقصورة
                              }

                              /**
                               * useLocalSearch — Instant client-side filtering hook with Arabic normalization support
                                */
                                export function useLocalSearch<T>({
                                  data,
                                    searchFields,
                                      minChars = 1,
                                      }: UseLocalSearchOptions<T>) {
                                        const [query, setQuery] = useState('');

                                          const filtered = useMemo(() => {
                                              const rawQuery = query.trim();
                                                  if (!rawQuery || rawQuery.length < minChars) return data;

                                                      const normalizedQuery = normalizeArabicText(rawQuery);

                                                          return data.filter((item) =>
                                                                searchFields.some((field) => {
                                                                        const val = item[field];
                                                                                if (val === null || val === undefined) return false;

                                                                                        if (typeof val === 'string') {
                                                                                                  return normalizeArabicText(val).includes(normalizedQuery);
                                                                                                          }
                                                                                                                  if (typeof val === 'number') {
                                                                                                                            return String(val).includes(normalizedQuery);
                                                                                                                                    }
                                                                                                                                            return false;
                                                                                                                                                  })
                                                                                                                                                      );
                                                                                                                                                        }, [data, query, searchFields, minChars]);

                                                                                                                                                          const clearSearch = useCallback(() => setQuery(''), []);

                                                                                                                                                            return {
                                                                                                                                                                query,
                                                                                                                                                                    setQuery,
                                                                                                                                                                        filtered,
                                                                                                                                                                            clearSearch,
                                                                                                                                                                                hasQuery: query.trim().length >= minChars,
                                                                                                                                                                                  };
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
                                                                                                                                                                                                 * LocalSearchInput — Reusable instant search input component
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
                                                                                                                                                                                                                        <div className={`relative flex items-center ${className}`}>
                                                                                                                                                                                                                              {/* أيقونة البحث العدسة */}
                                                                                                                                                                                                                                    <Search
                                                                                                                                                                                                                                            size={16}
                                                                                                                                                                                                                                                    className="absolute right-3 text-muted-foreground pointer-events-none"
                                                                                                                                                                                                                                                          />

                                                                                                                                                                                                                                                                <input
                                                                                                                                                                                                                                                                        ref={inputRef}
                                                                                                                                                                                                                                                                                type="text"
                                                                                                                                                                                                                                                                                        value={query}
                                                                                                                                                                                                                                                                                                onChange={(e) => onQueryChange(e.target.value)}
                                                                                                                                                                                                                                                                                                        placeholder={placeholder}
                                                                                                                                                                                                                                                                                                                className="w-full bg-background border border-border rounded-xl pr-9 pl-20 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                                                                                                                                                                                                                                                                                                                        dir="rtl"
                                                                                                                                                                                                                                                                                                                              />

                                                                                                                                                                                                                                                                                                                                    {/* العناصر اليسارية (عدد النتائج + زر مسح النص) */}
                                                                                                                                                                                                                                                                                                                                          <div className="absolute left-3 flex items-center gap-2">
                                                                                                                                                                                                                                                                                                                                                  {query && resultCount !== undefined && totalCount !== undefined && (
                                                                                                                                                                                                                                                                                                                                                            <span className="text-xs font-arabic text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md whitespace-nowrap hidden sm:inline-block">
                                                                                                                                                                                                                                                                                                                                                                        {resultCount} / {totalCount}
                                                                                                                                                                                                                                                                                                                                                                                  </span>
                                                                                                                                                                                                                                                                                                                                                                                          )}

                                                                                                                                                                                                                                                                                                                                                                                                  {query && (
                                                                                                                                                                                                                                                                                                                                                                                                            <button
                                                                                                                                                                                                                                                                                                                                                                                                                        type="button"
                                                                                                                                                                                                                                                                                                                                                                                                                                    onClick={() => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                  onClear();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                inputRef.current?.focus();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    aria-label="مسح البحث"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <X size={14} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        