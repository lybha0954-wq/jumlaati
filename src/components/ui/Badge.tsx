interface BadgeProps { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger'; }
export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = { default: 'bg-muted text-muted-foreground', success: 'bg-emerald-100 text-emerald-700', warning: 'bg-amber-100 text-amber-700', danger: 'bg-red-100 text-red-700' };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-arabic font-semibold ${variants[variant]}`}>{children}</span>;
}
