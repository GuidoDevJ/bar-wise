import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createAuthClient(token: string): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export async function verifyAuth(
  req: Request
): Promise<{ user: { id: string; email?: string } | null; supabase: SupabaseClient | null }> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return { user: null, supabase: null };

  const supabase = createAuthClient(token);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, supabase: null };

  return { user, supabase };
}
