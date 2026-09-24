import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  endIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-background border rounded-xl py-2.5 text-sm font-arabic
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all
            ${icon ? 'pr-10' : 'pr-4'}
            ${endIcon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-danger' : 'border-border'}
            ${className}
          `}
          {...props}
        />
        {endIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {endIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger font-arabic mt-1">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-muted-foreground font-arabic mt-1">{hint}</p>
      )}
    </div>
  );
}
