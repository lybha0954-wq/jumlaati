export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " سنة مضت";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " شهر مضى";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " يوم مضى";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " ساعة مضت";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " دقيقة مضت";
  return Math.floor(seconds) + " ثانية مضت";
}
