export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-5 h-12 w-full animate-pulse rounded-xl bg-gray-100" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <div className="aspect-square w-full animate-pulse bg-gray-100" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
