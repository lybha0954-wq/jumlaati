import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, hint, icon, ...props }, ref) => {
    const inputEl = (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          icon && "pr-10",
          !label && className
        )}
        ref={ref}
        {...props}
      />
    );

    if (!label && !hint && !icon) {
      return <div className={cn("w-full", className)}>{inputEl}</div>;
    }

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-xs font-semibold font-arabic mb-1.5 text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {inputEl}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {hint && (
          <p className="text-[11px] text-muted-foreground mt-1 font-arabic">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export default Input;
