import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export function RetailerStats({ title, value, icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-extrabold mt-2">{value}</h4>
          {trend && (
             <p className={cn("text-xs mt-2 font-semibold", trendUp ? "text-emerald-500" : "text-red-500")}>
                {trendUp ? "↑" : "↓"} {trend}
             </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary/10 to-purple-500/10 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
