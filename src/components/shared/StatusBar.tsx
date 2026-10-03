"use client";

interface Props {
  label: string;
  value: number;
  total: number;
  /**
   * إما:
   * - مفتاح: "emerald" | "amber" | "blue" | "purple" | "indigo" | "red"
   * - أو class مباشر: "bg-amber-500"
   */
  color?: string;
  className?: string;
}

const COLOR_KEYS: Record<string, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  emerald: "bg-[#2e8b73]",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

function resolveColor(color?: string): string {
  if (!color) return COLOR_KEYS.gray;
  // إذا بدأ بـ "bg-" فهو class مباشر
  if (color.startsWith("bg-")) return color;
  // وإلا فهو مفتاح معروف
  return COLOR_KEYS[color] || COLOR_KEYS.gray;
}

export function StatusBar({ label, value, total, color, className = "" }: Props) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const barColor = resolveColor(color);

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {value} ({percent}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
