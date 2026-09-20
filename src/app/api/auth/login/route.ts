import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Authentication is handled directly via Firebase Auth on client' });
}
