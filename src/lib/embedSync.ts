/**
 * Helper client-side para sincronizar embeddings de forma granular.
 * Las páginas del admin lo usan después de cada operación CRUD.
 */
import SupabaseService from './supabase/service';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await SupabaseService.client.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Upsert: crea o actualiza el embedding de un food o suggestion.
 * Llamar después de INSERT o UPDATE en el admin.
 */
export async function syncUpsert(
  type: 'food' | 'suggestion',
  data: Record<string, unknown>
): Promise<void> {
  const token = await getToken();
  if (!token) return;

  const res = await fetch('/api/admin/sync-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, data }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.warn(`[embedSync] upsert ${type} ${data.id} falló:`, error);
  }
}

/**
 * Delete: elimina el embedding de un food o suggestion.
 * Llamar después de DELETE en el admin.
 */
export async function syncDelete(
  type: 'food' | 'suggestion',
  id: number
): Promise<void> {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`/api/admin/sync-item?type=${type}&id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.warn(`[embedSync] delete ${type} ${id} falló:`, error);
  }
}
