import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';

export async function POST(req, { params }) {
  const { productId, name, rating, comment } = await req.json().catch(() => ({}));
  if (!productId || !name || !comment) return NextResponse.json({ error: 'Champs requis.' }, { status: 400 });
  const r = Number(rating);
  if (r < 1 || r > 5) return NextResponse.json({ error: 'Note entre 1 et 5.' }, { status: 400 });
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  const p = shop.products.find((x) => x.id === productId);
  if (!p) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });
  p.reviews = p.reviews || [];
  p.reviews.push({ id: uid(), name, rating: r, comment, date: new Date().toISOString() });
  await save(data);
  return NextResponse.json({ ok: true });
}