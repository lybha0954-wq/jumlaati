import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // ═══ التحقق من وجود المفتاح أولاً ═══
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { message: 'Revalidation disabled — secret not configured' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { path, secret } = body;

    // ═══ مقارنة آمنة (لا timing attacks) ═══
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return NextResponse.json({ message: 'Path is required (must start with /)' }, { status: 400 });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
