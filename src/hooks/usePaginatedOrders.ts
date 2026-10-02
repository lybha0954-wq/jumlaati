"use client";

import { useCallback, useEffect, useState } from "react";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UsePaginatedOrdersOptions {
  limit?: number;
  autoFetch?: boolean;
}

export interface UsePaginatedOrdersResult<T> {
  items: T[];
  total: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePaginatedOrders<T = any>(
  options: UsePaginatedOrdersOptions = {}
): UsePaginatedOrdersResult<T> {
  const { limit = 20, autoFetch = true } = options;

  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(autoFetch);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const res = await fetch(`/api/orders?page=${pageNum}&limit=${limit}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data: PaginatedResponse<T> = await res.json();

        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setTotal(data.total);
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (e: any) {
        setError(e?.message || "فشل التحميل");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    await fetchPage(page + 1, true);
  }, [fetchPage, page, hasMore, loading, loadingMore]);

  const refresh = useCallback(async () => {
    await fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    if (autoFetch) fetchPage(1, false);
  }, [autoFetch, fetchPage]);

  return {
    items,
    total,
    page,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
