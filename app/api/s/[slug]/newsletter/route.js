import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';

export async function POST(req, { params }) {
  const { email } = await req.json().catch(() => ({}));
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  shop.subscribers = shop.subscribers || [];
  if (!shop.subscribers.includes(email)) shop.subscribers.push(email);
  await save(data);
  return NextResponse.json({ ok: true });
}