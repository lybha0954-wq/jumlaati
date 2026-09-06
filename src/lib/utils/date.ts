export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-IQ", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}
export function formatTimeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " يوم";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " ساعة";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " دقيقة";
  return "الآن";
}
