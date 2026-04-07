-- ============================================================
-- RAG Setup para Bar Wise - pgvector en Supabase
-- Usa Amazon Bedrock Titan Embeddings V2 (1024 dimensiones)
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Habilitar la extension pgvector
create extension if not exists vector;

-- 2. Crear tabla de documentos para embeddings
create table if not exists documents (
  id         bigserial primary key,
  content    text not null,
  embedding  vector(1024),          -- Titan Text Embeddings V2: 1024 dims
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 3. Indice IVFFLAT para busqueda por similitud coseno
create index if not exists documents_embedding_ivfflat_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. Funcion de busqueda semantica
create or replace function match_documents(
  query_embedding vector(1024),
  match_count     int   default 5,
  match_threshold float default 0.5
)
returns table (
  id         bigint,
  content    text,
  metadata   jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. RLS policies
alter table documents enable row level security;

drop policy if exists "public_select_documents" on documents;
create policy "public_select_documents" on documents
  for select to anon, authenticated using (true);

drop policy if exists "public_insert_documents" on documents;
create policy "public_insert_documents" on documents
  for insert to anon, authenticated with check (true);

drop policy if exists "auth_delete_documents" on documents;
create policy "auth_delete_documents" on documents
  for delete to authenticated using (true);
