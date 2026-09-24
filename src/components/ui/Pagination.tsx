'use client';
export default function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded border disabled:opacity-40">السابق</button>
      <span className="text-sm font-arabic">{page} / {pages}</span>
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages} className="px-3 py-1 rounded border disabled:opacity-40">التالي</button>
    </div>
  );
}
