import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading = false, fullWidth = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg",
      primary: "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      accent: "bg-[#f59e0b] text-gray-900 hover:bg-[#d97706] shadow-md",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg",
      md: "h-11 px-5 py-2 rounded-xl text-sm font-medium",
      lg: "h-13 px-8 rounded-2xl text-base font-bold",
      icon: "h-10 w-10 rounded-full",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
