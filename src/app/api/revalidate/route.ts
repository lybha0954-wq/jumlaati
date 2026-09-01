import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const body = await req.json();
  if (body.path) {
    revalidatePath(body.path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
  return NextResponse.json({ revalidated: false, now: Date.now() });
}
