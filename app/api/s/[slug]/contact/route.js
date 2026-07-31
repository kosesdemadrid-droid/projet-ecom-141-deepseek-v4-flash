import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';

export async function POST(req, { params }) {
  const { name, email, subject, message } = await req.json().catch(() => ({}));
  if (!name || !message) return NextResponse.json({ error: 'Nom et message requis.' }, { status: 400 });
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  shop.messages = shop.messages || [];
  shop.messages.push({
    id: uid(),
    name,
    email: email || '',
    subject: subject || 'Message via le formulaire de contact',
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  await save(data);
  return NextResponse.json({ ok: true });
}