interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; }
export default function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold font-arabic mb-1.5">{label}</label>}
      <select className={`w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-arabic ${className}`} {...props}>{children}</select>
    </div>
  );
}
