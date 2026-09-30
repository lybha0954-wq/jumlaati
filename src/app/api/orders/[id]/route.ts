import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPushToUser } from '@/lib/push/sender';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    if (!orderId) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 });
    }

    // جلب الأصناف
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    // جلب أسماء الأطراف
    const ids = [order.retailer_id, order.supplier_id, order.delivery_id].filter(Boolean);
    let nameMap: Record<string, { name: string; phone: string }> = {};
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', ids);
      (profiles || []).forEach((p: any) => {
        nameMap[p.id] = { name: p.full_name || '', phone: p.phone || '' };
      });
    }

    const enriched = {
      ...order,
      retailer_name:  nameMap[order.retailer_id]?.name  || null,
      retailer_phone: nameMap[order.retailer_id]?.phone || null,
      supplier_name:  nameMap[order.supplier_id]?.name  || null,
      supplier_phone: nameMap[order.supplier_id]?.phone || null,
      delivery_name:  order.delivery_id ? nameMap[order.delivery_id]?.name  || null : null,
      delivery_phone: order.delivery_id ? nameMap[order.delivery_id]?.phone || null : null,
    };

    return NextResponse.json({ ok: true, order: enriched, items: items || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    if (!orderId) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role;
    if (!role) return NextResponse.json({ error: 'no profile' }, { status: 403 });

    const body = await req.json();
    const newStatus = body.status;
    if (!newStatus) return NextResponse.json({ error: 'status required' }, { status: 400 });

    const validStatuses = ['pending','accepted','shipped','picked_up','delivered','cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }

    const { data: order, error: getErr } = await supabase
      .from('orders')
      .select('id, retailer_id, supplier_id, delivery_id, status')
      .eq('id', orderId)
      .maybeSingle();

    if (getErr || !order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 });
    }

    const updates: Record<string, any> = { status: newStatus };
    const now = new Date().toISOString();

    // Status-specific timestamps
    if (newStatus === 'accepted') updates.accepted_at = now;
    if (newStatus === 'shipped') updates.shipped_at = now;
    if (newStatus === 'picked_up') updates.picked_up_at = now;
    if (newStatus === 'delivered') updates.delivered_at = now;
    if (newStatus === 'cancelled') updates.cancelled_at = now;

    // Permission checks
    if (role === 'supplier') {
      if (order.supplier_id !== user.id) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
      // Supplier: pending → accepted | accepted → shipped | any → cancelled
      if (newStatus === 'accepted' && order.status !== 'pending') {
        return NextResponse.json({ error: 'invalid transition' }, { status: 400 });
      }
      if (newStatus === 'shipped' && order.status !== 'accepted') {
        return NextResponse.json({ error: 'invalid transition' }, { status: 400 });
      }
    } else if (role === 'delivery') {
      // Delivery: shipped → picked_up (auto-claim), picked_up → delivered
      if (newStatus === 'picked_up') {
        if (order.status !== 'shipped') {
          return NextResponse.json({ error: 'order not ready' }, { status: 400 });
        }
        // If already assigned to another delivery, block
        if (order.delivery_id && order.delivery_id !== user.id) {
          return NextResponse.json({ error: 'assigned to another delivery' }, { status: 403 });
        }
        // Auto-assign to current delivery
        updates.delivery_id = user.id;
      } else if (newStatus === 'delivered') {
        if (order.delivery_id !== user.id) {
          return NextResponse.json({ error: 'not your order' }, { status: 403 });
        }
        if (order.status !== 'picked_up') {
          return NextResponse.json({ error: 'invalid transition' }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: 'delivery cannot set this status' }, { status: 403 });
      }
    } else if (role === 'retailer') {
      // Retailer: only cancel pending
      if (newStatus !== 'cancelled' || order.status !== 'pending') {
        return NextResponse.json({ error: 'retailer can only cancel pending' }, { status: 403 });
      }
      if (order.retailer_id !== user.id) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    } else if (role === 'admin') {
      // Admin can do anything
    } else {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { error: updErr } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    // ═══ إنشاء العمولات والمستحقات عند التسليم ═══
    if (newStatus === 'delivered') {
      try {
        const { data: fullOrder } = await supabase
          .from('orders')
          .select('id, subtotal, commission, delivery_fee, supplier_id, retailer_id, delivery_id, total_amount')
          .eq('id', orderId)
          .maybeSingle();

        if (fullOrder) {
          const subtotal = Number(fullOrder.subtotal || 0);
          const commissionAmt = Number(fullOrder.commission || 0);
          const deliveryFee = Number(fullOrder.delivery_fee || 0);
          const DELIVERY_SHARE = 2000;

          // (1) سجل العمولة في جدول commissions
          if (commissionAmt > 0) {
            await supabase.from('commissions').insert({
              order_id: orderId,
              retailer_id: fullOrder.retailer_id,
              supplier_id: fullOrder.supplier_id,
              amount: commissionAmt,
              rate: 1,
              status: 'pending',
            });
          }

          // (2) مستحقات المندوب
          if (fullOrder.delivery_id && DELIVERY_SHARE > 0) {
            await supabase.from('payouts').insert({
              user_id: fullOrder.delivery_id,
              amount: DELIVERY_SHARE,
              method: 'cash',
              status: 'pending',
              note: 'عمولة توصيل طلب #' + orderId,
            });
          }
        }
      } catch (e) {
        console.error('[api/orders/PATCH] auto commission failed:', e);
      }
    }

    // Notify relevant parties
    try {
      const statusAr: Record<string, string> = {
        pending: 'قيد الانتظار', accepted: 'مقبول',
        shipped: 'قيد التوصيل', picked_up: 'مع المندوب',
        delivered: 'تم التسليم', cancelled: 'ملغي'
      };

      const notifyIds = new Set<string>();
      if (order.retailer_id !== user.id) notifyIds.add(order.retailer_id);
      if (order.supplier_id !== user.id) notifyIds.add(order.supplier_id);
      if (order.delivery_id && order.delivery_id !== user.id) notifyIds.add(order.delivery_id);

      const title = 'تحديث الطلب #' + orderId;
      const bodyTxt = 'الحالة الجديدة: ' + (statusAr[newStatus] || newStatus);

      for (const uid of notifyIds) {
        await supabase.from('notifications').insert({
          user_id: uid,
          type: 'status',
          title,
          body: bodyTxt,
          order_id: orderId,
        });

        // Web Push لكل مستخدم معني
        await sendPushToUser(uid, {
          title,
          body: bodyTxt,
          url: '/orders/' + orderId,
          tag: 'order-' + orderId,
        });
      }
    } catch (e) {
      console.error('[api/orders/PATCH] notify failed:', e);
    }

    return NextResponse.json({ ok: true, status: newStatus, delivery_id: updates.delivery_id || order.delivery_id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
