export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100" />
          <div className="hidden h-5 w-20 animate-pulse rounded bg-gray-100 sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5 space-y-2">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-3 h-9 w-9 animate-pulse rounded-xl bg-gray-100" />
              <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          ))}
        </div>

        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
