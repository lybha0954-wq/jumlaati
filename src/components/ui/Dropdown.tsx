'use client';
export default function Dropdown({ trigger, items }: { trigger: React.ReactNode; items: Array<{ label: string; onClick: () => void }> }) {
  return <div className="relative">{trigger}</div>;
}
