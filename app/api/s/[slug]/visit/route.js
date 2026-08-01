import { NextResponse } from 'next/server';
import { db, save, isRemote } from '@/lib/store';

/** Compteur de visites : en mémoire uniquement en mode distant pour éviter
 *  les courses d'écriture sur le stockage partagé (gist/blobs). */
export async function POST(req, { params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (shop) {
    shop.stats = shop.stats || { visits: 0, orders: 0, revenue: 0 };
    shop.stats.visits = (shop.stats.visits || 0) + 1;
    if (!(await isRemote())) {
      await save(data);
    }
  }
  return NextResponse.json({ ok: true });
}