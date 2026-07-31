import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const data = await db();
  const shops = data.shops.map((s) => ({
    id: s.id, name: s.name, slug: s.slug, ownerId: s.ownerId,
    ownerName: data.users.find((u) => u.id === s.ownerId)?.name || '—',
    ownerEmail: data.users.find((u) => u.id === s.ownerId)?.email || '—',
    themeKey: s.themeKey, demo: !!s.demo,
    products: s.products.length, orders: s.orders.length,
    revenue: s.stats?.revenue || 0, visits: s.stats?.visits || 0,
    createdAt: s.createdAt,
  }));
  return NextResponse.json({ shops });
}

export async function DELETE(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  const data = await db();
  data.shops = data.shops.filter((s) => s.id !== id);
  await save(data);
  return NextResponse.json({ ok: true });
}