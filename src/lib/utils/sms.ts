export async function sendSMS(phone: string, message: string) {
  // ربط مع مزود SMS عراقي أو Twilio لاحقاً
  console.log(`[SMS] To: ${phone}, Message: ${message}`);
  return { success: true };
}
