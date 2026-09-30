"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function KPISkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4">
          <Skeleton className="mb-3 h-9 w-9 rounded-xl" />
          <Skeleton className="mb-2 h-3 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
