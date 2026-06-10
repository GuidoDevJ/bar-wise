import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';

export async function GET(req: NextRequest) {
  const { user } = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { user } = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.user.id, email: data.user.email }, { status: 201 });
}
