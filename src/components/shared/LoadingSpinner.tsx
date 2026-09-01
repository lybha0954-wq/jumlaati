export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className || "h-32"}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
