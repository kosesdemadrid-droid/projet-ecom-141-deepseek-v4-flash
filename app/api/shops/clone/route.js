import { NextResponse } from 'next/server';
import { db, save, uniqueSlug, uid } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

/** Clone une boutique (template ou boutiques démo) dans l'espace du client */
export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Connectez-vous pour utiliser une boutique.' }, { status: 401 });
  const { shopId } = await req.json().catch(() => ({}));
  const data = await db();
  const source = data.shops.find((s) => s.id === shopId);
  if (!source) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });

  const clone = JSON.parse(JSON.stringify(source));
  const oldId = clone.id;
  clone.id = uid();
  clone.ownerId = user.id;
  clone.slug = uniqueSlug(source.name, data.shops);
  clone.name = `${source.name} (copie)`;
  clone.demo = false;
  clone.createdAt = new Date().toISOString();
  clone.updatedAt = new Date().toISOString();
  clone.stats = { visits: 0, orders: 0, revenue: 0 };
  clone.orders = [];
  clone.messages = [];
  clone.subscribers = [];
  clone.customDomain = '';
  clone.products = clone.products.map((p) => ({
    ...p,
    id: uid(),
    reviews: (p.reviews || []).map((r) => ({ ...r, id: uid() })),
    createdAt: new Date().toISOString(),
  }));

  data.shops.push(clone);
  await save(data);
  return NextResponse.json({ shop: { id: clone.id, slug: clone.slug, name: clone.name, productCount: clone.products.length } });
}