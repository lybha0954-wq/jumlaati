"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "emerald" | "amber" | "purple";
  trend?: { value: number; up: boolean };
  highlight?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-200" },
};

function StatCard({ icon, label, value, color, trend, highlight }: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${
        highlight ? `ring-2 ${colors.ring}` : ""
      }`}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl ${colors.bg} ${colors.text} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                trend.up
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {trend.up ? (
                <TrendingUp size={12} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={12} strokeWidth={2.5} />
              )}
              {trend.up ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1 font-medium">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

interface RetailerStatsProps {
  stats: {
    orders: number;
    pending: number;
    delivered: number;
    totalSpent: number;
  };
}

export function RetailerStats({ stats }: RetailerStatsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <StatCard
        icon={<ShoppingCart className="w-5 h-5" strokeWidth={2.5} />}
        label="إجمالي الطلبات"
        value={String(stats.orders)}
        color="blue"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" strokeWidth={2.5} />}
        label="قيد الانتظار"
        value={String(stats.pending)}
        color="amber"
        highlight={stats.pending > 0}
      />
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
        label="تم التوصيل"
        value={String(stats.delivered)}
        color="emerald"
      />
      <StatCard
        icon={<DollarSign className="w-5 h-5" strokeWidth={2.5} />}
        label="إجمالي المشتريات"
        value={formatCurrency(stats.totalSpent)}
        color="purple"
      />
    </div>
  );
}
