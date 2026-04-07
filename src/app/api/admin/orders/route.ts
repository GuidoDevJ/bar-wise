import { verifyAuth } from '@/lib/supabase/server';
import { ordersService } from '@/lib/supabase/ordersService';

export async function GET(req: Request) {
  const { user } = await verifyAuth(req);
  if (!user) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const orders = await ordersService.getAllOrders();
    return Response.json(orders);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
