import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { requireAdmin, publicUser } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const data = await db();
  const clients = data.users
    .filter((u) => u.role === 'client')
    .map((u) => ({
      ...publicUser(u),
      shops: data.shops.filter((s) => s.ownerId === u.id).length,
      orders: data.shops.filter((s) => s.ownerId === u.id).reduce((s, x) => s + x.orders.length, 0),
      revenue: data.shops.filter((s) => s.ownerId === u.id).reduce((s, x) => s + (x.stats?.revenue || 0), 0),
    }));
  return NextResponse.json({ clients });
}

export async function DELETE(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  const data = await db();
  const u = data.users.find((x) => x.id === id && x.role === 'client');
  if (!u) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
  data.users = data.users.filter((x) => x.id !== id);
  data.shops = data.shops.filter((s) => s.ownerId !== id);
  data.sessions = data.sessions.filter((s) => s.userId !== id);
  await save(data);
  return NextResponse.json({ ok: true });
}