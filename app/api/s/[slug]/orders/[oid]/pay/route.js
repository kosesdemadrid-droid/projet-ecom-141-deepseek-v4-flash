import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { sendMail, mailTemplates } from '@/lib/mail';

/** Simulation de callback de paiement Mobile Money (code démo : 1234) */
export async function POST(req, { params }) {
  const { code } = await req.json().catch(() => ({}));
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  const order = shop.orders.find((o) => o.id === params.oid);
  if (!order) return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
  if (order.status !== 'awaiting_payment') {
    return NextResponse.json({ error: 'Cette commande n\'attend pas de paiement.' }, { status: 400 });
  }
  if (code !== '1234') {
    return NextResponse.json({ error: 'Code incorrect. Le code de démonstration est 1234.' }, { status: 400 });
  }
  order.status = 'paid';
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({ status: 'paid', at: new Date().toISOString() });
  shop.stats.revenue = (shop.stats.revenue || 0) + order.total;
  await save(data);
  sendMail({ to: order.customer.email || shop.contacts?.email, ...mailTemplates.orderPaid(order.ref) });
  return NextResponse.json({ ok: true, order });
}