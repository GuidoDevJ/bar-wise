/**
 * POST /api/admin/sync-item
 * Upsert del embedding de un item especifico (food o suggestion).
 *
 * DELETE /api/admin/sync-item?type=food&id=1
 * Elimina el embedding de un item especifico.
 *
 * Ambas operaciones requieren Authorization: Bearer <token>
 */
import { embedText } from '@/lib/api/bedrock';
import { buildFoodContent, buildSuggestionContent } from '@/lib/api/documents';
import { verifyAuth } from '@/lib/supabase/server';

// ─── POST: upsert embedding de un item ───────────────────────────────────────

export async function POST(req: Request) {
  const { user, supabase } = await verifyAuth(req);
  if (!user || !supabase) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { type, data } = await req.json() as {
    type: 'food' | 'suggestion';
    data: Record<string, unknown>;
  };

  if (!type || !data?.id) {
    return Response.json({ error: 'Faltan parametros: type, data.id' }, { status: 400 });
  }

  try {
    // 1. Fetchear el item real desde Supabase para garantizar consistencia
    const table = type === 'food' ? 'foods' : 'suggestions';
    const { data: freshItem, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', data.id as number)
      .single();

    if (fetchError || !freshItem) {
      throw new Error(`Item ${type} id=${data.id} no encontrado: ${fetchError?.message}`);
    }

    const item = freshItem as Record<string, unknown>;

    // 2. Eliminar documento existente para este item (si existe)
    await supabase
      .from('documents')
      .delete()
      .filter('metadata->>type', 'eq', type)
      .filter('metadata->>id', 'eq', String(data.id));

    // 3. Construir texto desde el item real y generar embedding
    const content =
      type === 'food'
        ? buildFoodContent(item)
        : buildSuggestionContent(item);

    const embedding = await embedText(content);

    const metadata =
      type === 'food'
        ? {
            type: 'food',
            id: item.id,
            title: item.title,
            price: item.price,
            foodType: item.type,
            subFoodType: item.subFoodType,
          }
        : {
            type: 'suggestion',
            id: item.id,
            title: item.title,
            price: item.price,
          };

    // 4. Insertar nuevo documento
    const { error } = await supabase
      .from('documents')
      .insert({ content, embedding, metadata });

    if (error) throw new Error(error.message);

    return Response.json({ ok: true, content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[sync-item POST]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE: eliminar embedding de un item ────────────────────────────────────

export async function DELETE(req: Request) {
  const { user, supabase } = await verifyAuth(req);
  if (!user || !supabase) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as 'food' | 'suggestion' | null;
  const id = searchParams.get('id');

  if (!type || !id) {
    return Response.json({ error: 'Faltan parametros: type, id' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .filter('metadata->>type', 'eq', type)
      .filter('metadata->>id', 'eq', id);

    if (error) throw new Error(error.message);

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[sync-item DELETE]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
