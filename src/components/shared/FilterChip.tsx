"use client";

import type { ReactNode } from "react";

type ChipColor = "default" | "emerald" | "red";

interface Props {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  icon?: ReactNode;
  color?: ChipColor;
}

const ACTIVE_COLORS: Record<ChipColor, string> = {
  default: "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20",
  emerald: "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20",
  red: "bg-red-500 text-white shadow-md shadow-red-500/20",
};

export function FilterChip({
  active,
  onClick,
  label,
  count = 0,
  icon,
  color = "default",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? ACTIVE_COLORS[color]
          : "border border-gray-100 bg-white text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#1e6b57] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-[#2e8b73]/40"
      }`}
    >
      {icon}
      {label}
      {count > 0 && (
        <span
          className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
            active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
