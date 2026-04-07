import { verifyAuth } from '@/lib/supabase/server';
import { ordersService } from '@/lib/supabase/ordersService';
import { Database } from '@/lib/supabase/database';

type OrderStatus = Database['public']['Enums']['OrderStatus'];

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'done',
  'cancelled',
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await verifyAuth(req);
  if (!user) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const order = await ordersService.updateStatus(id, status);
    return Response.json(order);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
