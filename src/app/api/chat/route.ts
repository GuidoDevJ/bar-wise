import { claude, CLAUDE_MODEL, embedText } from '@/lib/api/bedrock';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function searchDocs(embedding: number[], topK = 5): Promise<string> {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_count: topK,
    match_threshold: 0.3,
  });

  if (error) {
    console.error('[searchDocs] RPC error:', error);
    return '';
  }
  if (!data?.length) return '';
  return (data as { content: string }[]).map((d) => d.content).join('\n\n');
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Bad request: message is required', { status: 400 });
    }

    // 1. Embed la pregunta del usuario
    const queryEmbedding = await embedText(message);

    // 2. Buscar documentos relevantes en Supabase
    const context = await searchDocs(queryEmbedding);
    console.log(
      'Contexto recuperado para la consulta:',
      context ? 'Sí' : 'No',
      '\n',
      context || '---'
    );
    // 3. System prompt con contexto RAG
    const systemPrompt = `Sos el asistente virtual de Bar Wise, un bar-restaurante en Buenos Aires, Argentina.
Tu rol es ayudar a los clientes con preguntas sobre el menu, precios, horarios, ubicacion y cualquier consulta sobre el bar.
Hablas en español argentino, de manera amigable e informal (usando "vos" en lugar de "tú").
Si no tenés información específica sobre algo, lo decís honestamente y sugerís que el cliente consulte directamente al bar.
Sé conciso y útil. Evitá respuestas largas y genéricas.

${context ? `Información relevante del menu para esta consulta:\n\n${context}` : 'No encontré información específica en el menu para esta consulta.'}`;

    // 4. Llamar a Claude en Bedrock con streaming
    const stream = await claude.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [...history, { role: 'user' as const, content: message }],
    });

    // 5. Devolver streaming al cliente como texto plano
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        stream.on('text', (delta) => {
          controller.enqueue(encoder.encode(delta));
        });
        stream.on('error', (err) => {
          controller.error(err);
        });
        stream.on('end', () => {
          controller.close();
        });
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('[/api/chat]', err);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
