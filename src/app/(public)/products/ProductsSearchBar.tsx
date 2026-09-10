"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function ProductsSearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form onSubmit={submit} className="relative mb-8">
      <Search
        className="absolute right-3 top-3 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="w-full h-12 rounded-xl border border-gray-200 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </form>
  );
}
