import { ordersService } from '@/lib/supabase/ordersService';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string; itemId: string }> }
) {
  try {
    const { sessionId, itemId } = await params;
    await ordersService.removeItem(sessionId, Number(itemId));
    return new Response(null, { status: 204 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return Response.json({ error: msg }, { status: 500 });
  }
}
