import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (id === user.id) {
    return NextResponse.json(
      { error: 'No podés eliminar tu propio usuario' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
