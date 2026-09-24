export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`overflow-x-auto ${className}`}><table className="w-full text-sm">{children}</table></div>;
}
export function TableHead({ children }: { children: React.ReactNode }) { return <thead className="bg-muted/40">{children}</thead>; }
export function TableBody({ children }: { children: React.ReactNode }) { return <tbody className="divide-y divide-border">{children}</tbody>; }
export function TableRow({ children }: { children: React.ReactNode }) { return <tr className="hover:bg-muted/20">{children}</tr>; }
export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <td className={`px-4 py-3 font-arabic ${className}`}>{children}</td>; }
