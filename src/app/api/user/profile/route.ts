import { NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });

    const profile = await userService.getUserProfile(uid);
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { uid, ...data } = body;
    if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });

    const ok = await userService.updateProfile(uid, data);
    if (!ok) return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
