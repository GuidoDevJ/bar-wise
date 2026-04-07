import { claude, CLAUDE_MODEL, embedText } from '@/lib/api/bedrock';
import { createClient } from '@supabase/supabase-js';
import { ordersService } from '@/lib/supabase/ordersService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── RAG ─────────────────────────────────────────────────────────────────────

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

// ─── Order tools definition ───────────────────────────────────────────────────

const ORDER_TOOLS = [
  {
    name: 'create_order',
    description:
      'Crea un nuevo pedido para el cliente. Usar cuando el cliente quiere empezar a pedir y ya indicó su número de mesa.',
    input_schema: {
      type: 'object' as const,
      properties: {
        table_number: {
          type: 'string',
          description: 'Número o nombre de la mesa (ej: "4", "VIP 2", "Barra")',
        },
      },
      required: ['table_number'],
    },
  },
  {
    name: 'add_item',
    description: 'Agrega un item al pedido activo del cliente.',
    input_schema: {
      type: 'object' as const,
      properties: {
        food_title: { type: 'string', description: 'Nombre del item a agregar' },
        quantity: {
          type: 'number',
          description: 'Cantidad deseada (default: 1)',
        },
        notes: {
          type: 'string',
          description: 'Notas especiales (sin cebolla, bien cocido, etc.)',
        },
      },
      required: ['food_title'],
    },
  },
  {
    name: 'remove_item',
    description: 'Quita un item del pedido. Requiere el ID numérico del item (obtenible con get_my_order).',
    input_schema: {
      type: 'object' as const,
      properties: {
        item_id: { type: 'number', description: 'ID del item a quitar' },
      },
      required: ['item_id'],
    },
  },
  {
    name: 'get_my_order',
    description:
      'Obtiene el pedido actual del cliente con todos sus items. Usar para mostrar el resumen del pedido o para obtener IDs de items.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'confirm_order',
    description:
      'Confirma y envía el pedido a cocina/barra. Usar únicamente cuando el cliente confirma explícitamente que quiere enviar el pedido.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
] as const;

// ─── Tool execution ───────────────────────────────────────────────────────────

type ToolUseBlock = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

async function executeTools(
  toolBlocks: ToolUseBlock[],
  sessionId: string
): Promise<Array<{ type: 'tool_result'; tool_use_id: string; content: string }>> {
  return Promise.all(
    toolBlocks.map(async (tool) => {
      let content: string;
      try {
        switch (tool.name) {
          case 'create_order': {
            const order = await ordersService.createOrder(
              sessionId,
              tool.input.table_number as string
            );
            content = JSON.stringify({
              success: true,
              order_id: order.id,
              table: order.table_number,
              status: order.status,
            });
            break;
          }
          case 'add_item': {
            const item = await ordersService.addItem(
              sessionId,
              tool.input.food_title as string,
              (tool.input.quantity as number) ?? 1,
              tool.input.notes as string | undefined
            );
            content = JSON.stringify({
              success: true,
              item_id: item.id,
              food_title: item.food_title,
              quantity: item.quantity,
            });
            break;
          }
          case 'remove_item': {
            await ordersService.removeItem(sessionId, tool.input.item_id as number);
            content = JSON.stringify({ success: true });
            break;
          }
          case 'get_my_order': {
            const order = await ordersService.getOrderBySession(sessionId);
            content = order
              ? JSON.stringify(order)
              : JSON.stringify({ message: 'No hay pedido activo' });
            break;
          }
          case 'confirm_order': {
            const order = await ordersService.confirmOrder(sessionId);
            content = JSON.stringify({ success: true, status: order.status });
            break;
          }
          default:
            content = JSON.stringify({ error: 'Herramienta desconocida' });
        }
      } catch (err) {
        content = JSON.stringify({
          error: err instanceof Error ? err.message : 'Error al ejecutar la operación',
        });
      }
      return { type: 'tool_result' as const, tool_use_id: tool.id, content };
    })
  );
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { message, history = [], sessionId } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Bad request: message is required', { status: 400 });
    }

    const safeSessionId: string = typeof sessionId === 'string' && sessionId ? sessionId : 'anonymous';

    // 1. Embed la pregunta y buscar contexto RAG
    const queryEmbedding = await embedText(message);
    const context = await searchDocs(queryEmbedding);

    // 2. System prompt
    const systemPrompt = `Sos el asistente virtual de Bar Wise, un bar-restaurante en Buenos Aires, Argentina.
Tu rol es ayudar a los clientes con preguntas sobre el menú, precios, horarios, ubicación, y también registrar pedidos.

Hablas en español argentino, de manera amigable e informal (usando "vos" en lugar de "tú").
Sé conciso y útil. Evitá respuestas largas y genéricas.

PEDIDOS — flujo obligatorio de preguntas antes de crear nada:
1. Si el cliente quiere pedir, preguntá primero el número de mesa (si no lo mencionó).
2. Luego preguntá qué quiere pedir. Escuchá todos los items que quiera agregar.
3. Por cada item, si corresponde, preguntá la cantidad y si tiene alguna aclaración (ej: sin cebolla, bien cocido). Hacé estas preguntas de a una, no todas juntas.
4. Cuando el cliente diga que no quiere más nada, mostrá el resumen completo del pedido (mesa, items, cantidades, notas).
5. Pedí confirmación explícita antes de registrar cualquier cosa.
6. Solo cuando el cliente confirme, ejecutá en este orden: create_order → add_item por cada item → confirm_order.

REGLAS ESTRICTAS:
- NUNCA llamés a create_order, add_item ni confirm_order hasta tener la confirmación del cliente.
- Recopilá TODA la información necesaria conversacionalmente antes de tocar ninguna tool.
- Si el cliente ya tiene un pedido activo (detectado con get_my_order), informáselo y preguntá si quiere agregar más items.
- El cliente solo puede ver y modificar SU propio pedido.

${context ? `Información relevante del menú:\n\n${context}` : 'No encontré información específica en el menú para esta consulta.'}`;

    // 3. Agentic loop — sin streaming, respuesta completa al terminar
    let loopMessages = [...history, { role: 'user' as const, content: message }];
    let finalText = '';
    const MAX_ROUNDS = 6;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        tools: ORDER_TOOLS as never,
        messages: loopMessages,
      });

      const toolBlocks = response.content
        .filter((b) => b.type === 'tool_use')
        .map((b) => b as unknown as ToolUseBlock);

      // Acumular texto de esta vuelta
      for (const block of response.content) {
        if (block.type === 'text' && block.text) {
          finalText += block.text;
        }
      }

      // Sin tools → respuesta final lista
      if (toolBlocks.length === 0) break;

      // Ejecutar tools y continuar
      const toolResults = await executeTools(toolBlocks, safeSessionId);
      loopMessages = [
        ...loopMessages,
        { role: 'assistant' as const, content: response.content as never },
        { role: 'user' as const, content: toolResults as never },
      ];
    }

    return new Response(finalText, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('[/api/chat]', err);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
