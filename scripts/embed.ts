/**
 * Script de embedding para Bar Wise RAG
 * Usa Amazon Bedrock Titan Text Embeddings V2 (1024 dims)
 *
 * Uso: npm run embed
 *
 * Variables de entorno requeridas (en .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   AWS_ACCESS_KEY_ID
 *   AWS_SECRET_ACCESS_KEY
 *   AWS_REGION   (ej: us-east-1)
 */
import { createClient } from '@supabase/supabase-js';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { BAR_INFO, buildFoodContent, buildSuggestionContent } from '../src/lib/api/documents';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function embed(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: text,
      dimensions: 1024,
      normalize: true,
    }),
  });

  const response = await bedrock.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.embedding as number[];
}

async function insertDocument(
  content: string,
  metadata: Record<string, unknown>
) {
  const embedding = await embed(content);
  const { error } = await supabase
    .from('documents')
    .insert({ content, embedding, metadata });
  if (error) throw new Error(`Error insertando: ${error.message}`);
}

async function main() {
  console.log('🔄 Iniciando embedding del menu de Bar Wise (Bedrock Titan)...\n');
  
  // 1. Limpiar embeddings anteriores
  console.log('🗑️  Limpiando embeddings anteriores...');
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .neq('id', 0);
  if (deleteError) {
    console.error('Error limpiando:', deleteError.message);
    process.exit(1);
  }
  console.log('✓ Listo\n');

  // 2. Info estatica del bar
  console.log('📋 Embebiendo info del bar...');
  for (const item of BAR_INFO) {
    await insertDocument(item.content, item.metadata);
    console.log(`  ✓ ${item.metadata.section}`);
  }
  console.log();

  // 3. Comidas
  console.log('🍽️  Embebiendo comidas...');
  const { data: foods, error: foodsError } = await supabase
    .from('foods')
    .select('*');
  if (foodsError) throw foodsError;

  for (const food of foods ?? []) {
    const content = buildFoodContent(food as Record<string, unknown>);
    await insertDocument(content, {
      type: 'food',
      id: food.id,
      title: food.title,
      price: food.price,
      foodType: food.type,
      subFoodType: food.subFoodType,
    });
    console.log(`  ✓ ${food.title} (${food.type})`);
  }
  console.log();

  // 4. Sugerencias
  console.log('⭐ Embebiendo sugerencias...');
  const { data: suggestions, error: sugError } = await supabase
    .from('suggestions')
    .select('*');
  if (sugError) throw sugError;

  for (const sug of suggestions ?? []) {
    const content = buildSuggestionContent(sug as Record<string, unknown>);
    await insertDocument(content, {
      type: 'suggestion',
      id: sug.id,
      title: sug.title,
      price: sug.price,
    });
    console.log(`  ✓ ${sug.title}`);
  }
  console.log();

  const total =
    BAR_INFO.length + (foods?.length ?? 0) + (suggestions?.length ?? 0);
  console.log(`✅ ${total} embeddings generados en Supabase.\n`);
  console.log('El agente de Bar Wise ya puede responder preguntas.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
