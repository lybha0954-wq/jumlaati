/**
 * تطبيع رقم الهاتف العراقي
 * يقبل: 07701234567 | +9647701234567 | 9647701234567 | 7701234567
 * يُرجع: 07701234567 (11 رقماً تبدأ بـ 07)
 */
export function normalizeIraqiPhone(input: string): string {
  let digits = String(input).replace(/\D/g, '');
  // إزالة رمز الدولة إن وُجد
  if (digits.startsWith('964')) digits = digits.slice(3);
  if (digits.startsWith('00964')) digits = digits.slice(5);
  // إضافة صفر في البداية إن كان الرقم 10 خانات
  if (digits.length === 10 && digits.startsWith('7')) digits = '0' + digits;
  return digits;
}

/** هل الرقم صحيح؟ */
export function isValidIraqiPhone(input: string): boolean {
  return /^07[0-9]{9}$/.test(normalizeIraqiPhone(input));
}

/** بناء البريد الداخلي من رقم الهاتف */
export function phoneToAuthEmail(phone: string): string {
  return normalizeIraqiPhone(phone) + '@jumlaati.iq';
}

/** عرض الرقم بشكل جميل */
export function formatIraqiPhone(input: string): string {
  const n = normalizeIraqiPhone(input);
  if (n.length !== 11) return input;
  return n.slice(0, 4) + ' ' + n.slice(4, 7) + ' ' + n.slice(7);
}
