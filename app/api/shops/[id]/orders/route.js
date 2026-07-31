import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  return NextResponse.json({ orders: [...shop.orders].reverse() });
}

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { orderId, status } = await req.json().catch(() => ({}));
  const order = shop.orders.find((o) => o.id === orderId);
  if (!order) return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
  const allowed = ['awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  order.status = status;
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({ status, at: new Date().toISOString() });
  await save(data);
  return NextResponse.json({ order });
}