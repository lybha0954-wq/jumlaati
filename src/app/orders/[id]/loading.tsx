export default function OrderDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-2 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 space-y-2 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-2">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
