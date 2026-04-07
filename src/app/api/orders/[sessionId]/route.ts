import { ordersService } from '@/lib/supabase/ordersService';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const order = await ordersService.getOrderBySession(sessionId);

    if (!order) {
      return Response.json({ order: null }, { status: 200 });
    }

    return Response.json(order);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
