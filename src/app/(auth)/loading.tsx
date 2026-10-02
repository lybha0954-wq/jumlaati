export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-7 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="mx-auto h-4 w-56 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="space-y-4">
          <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
        </div>

        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
