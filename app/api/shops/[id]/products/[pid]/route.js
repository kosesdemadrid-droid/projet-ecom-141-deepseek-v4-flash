import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const p = shop.products.find((x) => x.id === params.pid);
  if (!p) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });

  ['name', 'description', 'category', 'stock'].forEach((k) => {
    if (body[k] !== undefined) p[k] = body[k];
  });
  if (body.price !== undefined) p.price = Number(body.price) || 0;
  if (body.oldPrice !== undefined) p.oldPrice = body.oldPrice ? Number(body.oldPrice) : null;
  if (body.images !== undefined) p.images = body.images.filter(Boolean).slice(0, 5);
  if (body.variants !== undefined) p.variants = body.variants;
  await save(data);
  return NextResponse.json({ product: p });
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  shop.products = shop.products.filter((x) => x.id !== params.pid);
  await save(data);
  return NextResponse.json({ ok: true });
}