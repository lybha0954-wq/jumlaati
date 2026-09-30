"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  color?: "emerald" | "amber" | "rose" | "blue" | "gray";
  children?: ReactNode;
}

const COLOR_MAP = {
  emerald: "bg-[#e8f4f0] text-[#2e8b73]",
  amber:   "bg-amber-50 text-amber-600",
  rose:    "bg-rose-50 text-rose-500",
  blue:    "bg-blue-50 text-blue-600",
  gray:    "bg-gray-50 text-gray-400",
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  color = "emerald",
  children,
}: EmptyStateProps) {
  const colors = COLOR_MAP[color];

  const ActionButton = () => {
    if (!actionLabel) return null;
    const cls = "mt-5 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1e6b57] active:scale-95";

    if (actionHref) {
      return <Link href={actionHref} className={cls}>{actionLabel}</Link>;
    }
    if (onAction) {
      return <button onClick={onAction} className={cls}>{actionLabel}</button>;
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 sm:p-12 text-center">
      <div className={`mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full ${colors}`}>
        <Icon size={28} />
      </div>
      <p className="text-sm sm:text-base font-bold text-gray-800">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
      {children}
      <ActionButton />
    </div>
  );
}
