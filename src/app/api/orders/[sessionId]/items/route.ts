import { ordersService } from '@/lib/supabase/ordersService';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { foodTitle, quantity = 1, notes } = await req.json();

    if (!foodTitle) {
      return Response.json({ error: 'foodTitle es requerido' }, { status: 400 });
    }

    const item = await ordersService.addItem(sessionId, foodTitle, quantity, notes);
    return Response.json(item, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
