import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
      ghost: "hover:bg-accent hover:text-accent-foreground transition-colors",
      destructive: "bg-destructive text-destructive-foreground shadow-md shadow-destructive/20 hover:bg-destructive/90 transition-colors",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 py-2 rounded-lg",
      lg: "h-12 px-8 rounded-xl text-lg",
      icon: "h-10 w-10 rounded-full",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
