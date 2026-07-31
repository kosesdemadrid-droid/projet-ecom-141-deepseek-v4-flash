import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';

export async function POST(req, { params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (shop) {
    shop.stats = shop.stats || { visits: 0, orders: 0, revenue: 0 };
    shop.stats.visits = (shop.stats.visits || 0) + 1;
    await save(data);
  }
  return NextResponse.json({ ok: true });
}