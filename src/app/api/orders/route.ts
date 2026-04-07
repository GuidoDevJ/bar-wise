import { ordersService } from '@/lib/supabase/ordersService';

export async function POST(req: Request) {
  try {
    const { sessionId, tableNumber } = await req.json();

    if (!sessionId || !tableNumber) {
      return Response.json(
        { error: 'sessionId y tableNumber son requeridos' },
        { status: 400 }
      );
    }

    const order = await ordersService.createOrder(sessionId, tableNumber);
    return Response.json(order, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
