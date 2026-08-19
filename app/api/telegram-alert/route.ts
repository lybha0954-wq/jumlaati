import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, message, ip } = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ success: false, error: 'Telegram config missing' }, { status: 500 });
    }

    // تنسيق الرسالة بشكل جمالي واحترافي
    const text = `🚨 *تنبيه أمني من منصة جُمْلَتِي*\n\n` +
                 `📌 *الحالة:* ${title}\n` +
                 `💬 *التفاصيل:* ${message}\n` +
                 `🌐 *عنوان الـ IP:* \`${ip || 'غير محدد'}\`\n` +
                 `⏰ *الوقت:* ${new Date().toLocaleString('ar-IQ', { timeZone: 'Asia/Baghdad' })}`

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (!data.ok) throw new Error('Failed to send telegram message');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
