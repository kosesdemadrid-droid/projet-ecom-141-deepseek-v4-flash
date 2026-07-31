import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  return NextResponse.json({ messages: [...shop.messages].reverse() });
}

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  const { messageId, read } = await req.json().catch(() => ({}));
  const m = shop.messages.find((x) => x.id === messageId);
  if (m) m.read = read !== undefined ? !!read : true;
  await save(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  const { messageId } = await req.json().catch(() => ({}));
  shop.messages = shop.messages.filter((x) => x.id !== messageId);
  await save(data);
  return NextResponse.json({ ok: true });
}