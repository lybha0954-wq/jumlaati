'use client';
export function Tabs({ children }: { children: React.ReactNode }) { return <div className="flex gap-1 bg-muted rounded-xl p-1">{children}</div>; }
export function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold ${active ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>{children}</button>;
}
