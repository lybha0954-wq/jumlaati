"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command } from "lucide-react";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K أو Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Escape لإغلاق
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[95] flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <Search size={18} className="flex-shrink-0 text-gray-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المنتجات... (اضغط Enter)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={14} />
          </button>
        </form>

        <div className="p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
            اختصارات سريعة
          </p>
          <div className="space-y-1">
            <ShortcutRow icon={<Command size={12} />} keys="Ctrl+K" label="بحث سريع" />
            <ShortcutRow icon={<Command size={12} />} keys="Esc" label="إغلاق" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ icon, keys, label }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
      <span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        {icon}
        {label}
      </span>
      <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10px] font-bold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        {keys}
      </kbd>
    </div>
  );
}
