export default function InvoiceLoading() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 dark:bg-gray-950">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-5 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-white dark:bg-gray-800" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-[#2e8b73]/40" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 animate-pulse bg-gradient-to-l from-[#2e8b73]/40 to-[#1e6b57]/40" />
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 flex-1 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
