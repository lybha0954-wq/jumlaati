"use client";

import { CheckCircle2 } from "lucide-react";

export interface PaymentMethod {
  key: string;
  label: string;
  icon?: string | null;
  description?: string | null;
  enabled: boolean;
}

interface Props {
  methods: PaymentMethod[];
  selected: string;
  onSelect: (key: string) => void;
}

export default function PaymentMethodsSection({ methods, selected, onSelect }: Props) {
  if (methods.length === 0) return null;

  return (
    <div className="space-y-2">
      {methods.map((pm) => {
        const isSelected = selected === pm.key;
        return (
          <button
            key={pm.key}
            type="button"
            onClick={() => onSelect(pm.key)}
            className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 p-3 text-right transition-all ${
              isSelected
                ? "border-[#2e8b73] bg-[#e8f4f0] dark:bg-[#1e3a33]"
                : "border-gray-100 bg-white hover:border-[#2e8b73]/30 dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
                  isSelected
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                {pm.icon || "💳"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {pm.label}
                </p>
                {pm.description && (
                  <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                    {pm.description}
                  </p>
                )}
              </div>
            </div>
            {isSelected ? (
              <CheckCircle2 size={20} className="flex-shrink-0 text-[#2e8b73]" />
            ) : (
              <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
