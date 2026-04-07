/**
 * POST /api/admin/re-embed
 * Endpoint protegido que regenera todos los embeddings del menu.
 * Se llama desde el panel admin cuando se quiere forzar una resincronizacion completa.
 *
 * Autenticacion: requiere header Authorization: Bearer <supabase_access_token>
 */
import { embedText } from '@/lib/api/bedrock';
import { BAR_INFO, buildFoodContent, buildSuggestionContent } from '@/lib/api/documents';
import { verifyAuth } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { user, supabase } = await verifyAuth(req);
  if (!user || !supabase) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // 1. Limpiar documentos existentes
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .neq('id', 0);
    if (deleteError) throw new Error(`Error limpiando: ${deleteError.message}`);

    let count = 0;
    const docs: Array<{ content: string; embedding: number[]; metadata: Record<string, unknown> }> = [];

    // 2. Info estatica del bar
    for (const item of BAR_INFO) {
      const embedding = await embedText(item.content);
      docs.push({ content: item.content, embedding, metadata: item.metadata });
      count++;
    }

    // 3. Comidas
    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('*');
    if (foodsError) throw new Error(`Error leyendo comidas: ${foodsError.message}`);

    for (const food of foods ?? []) {
      const content = buildFoodContent(food as Record<string, unknown>);
      const embedding = await embedText(content);
      docs.push({
        content,
        embedding,
        metadata: {
          type: 'food',
          id: food.id,
          title: food.title,
          price: food.price,
          foodType: food.type,
          subFoodType: food.subFoodType,
        },
      });
      count++;
    }

    // 4. Sugerencias
    const { data: suggestions, error: sugError } = await supabase
      .from('suggestions')
      .select('*');
    if (sugError) throw new Error(`Error leyendo sugerencias: ${sugError.message}`);

    for (const sug of suggestions ?? []) {
      const content = buildSuggestionContent(sug as Record<string, unknown>);
      const embedding = await embedText(content);
      docs.push({
        content,
        embedding,
        metadata: { type: 'suggestion', id: sug.id, title: sug.title, price: sug.price },
      });
      count++;
    }

    // 5. Insertar en batch
    const { error: insertError } = await supabase.from('documents').insert(docs);
    if (insertError) throw new Error(`Error insertando: ${insertError.message}`);

    return Response.json({
      ok: true,
      count,
      message: `${count} embeddings regenerados correctamente.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[/api/admin/re-embed]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
