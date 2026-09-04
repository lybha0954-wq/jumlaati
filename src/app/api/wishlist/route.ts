import { NextResponse } from 'next/server';
import { wishlistService } from '@/lib/services/wishlistService';

export async function GET() {
  try {
    const data = await wishlistService.getMyWishlist();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    const data = await wishlistService.addToWishlist(productId);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
