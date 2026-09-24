import { CURRENCY } from './constants';
export function formatCurrency(n: number): string { return `${n.toLocaleString('ar-IQ')} ${CURRENCY}`; }
export function formatShortCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}م ${CURRENCY}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}ك ${CURRENCY}`;
  return formatCurrency(n);
}
export function formatDate(date: string | Date): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
}
export function formatDateTime(date: string | Date): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
export function formatRelativeTime(date: string | Date): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} س`;
  const days = Math.floor(h / 24);
  if (days < 7) return `منذ ${days} يوم`;
  return formatDate(d);
}
export function getTodayLabel(): string {
  return new Date().toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
