import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary text-white",
  secondary: "bg-gray-100 text-gray-700",
  destructive: "bg-red-100 text-red-700",
  success: "bg-emerald-100 text-emerald-700",
  outline: "border border-gray-300 text-gray-600",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
