export async function sendEmail(to: string, subject: string, html: string) {
  // يمكنك ربط هذه الدالة مع Resend أو SendGrid أو Supabase Edge Functions لاحقاً
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  return { success: true };
}
