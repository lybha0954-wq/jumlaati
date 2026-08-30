import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    revalidatePath(path);
    
    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
