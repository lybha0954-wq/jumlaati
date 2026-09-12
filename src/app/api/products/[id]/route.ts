import { NextResponse } from 'next/server';
import { wholesaleService } from '@/lib/services/wholesaleService';
import { requireRole } from '@/lib/api/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireRole(['wholesaler', 'admin']);
  if (error || !user) return error!;

  try {
    const { id } = await params;
    const body = await req.json();
    const product = await wholesaleService.updateProduct(id, body);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireRole(['wholesaler', 'admin']);
  if (error || !user) return error!;

  try {
    const { id } = await params;
    await wholesaleService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
