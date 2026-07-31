import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';
import { sendMail, mailTemplates } from '@/lib/mail';

export async function POST(req, { params }) {
  const body = await req.json().catch(() => ({}));
  const { items, customer, zone, deliveryMethod, paymentMethod } = body;
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
  }
  if (!customer?.name || !customer?.phone) {
    return NextResponse.json({ error: 'Nom et téléphone requis.' }, { status: 400 });
  }
  const zones = shop.delivery?.zones || [];
  const zoneInfo = zones.find((z) => z.name === zone);
  const isPickup = deliveryMethod === 'pickup';
  const freeOver = shop.delivery?.freeOver || 0;
  const shippingFee = isPickup ? 0 : zoneInfo ? (body.subtotal >= freeOver && freeOver > 0 ? 0 : zoneInfo.fee) : 0;

  const valid = [];
  for (const it of items) {
    const p = shop.products.find((x) => x.id === it.id);
    if (!p || p.stock < it.qty) {
      return NextResponse.json({ error: `« ${p?.name || it.name} » n'est plus disponible en cette quantité.` }, { status: 409 });
    }
    valid.push({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.images?.[0],
      quantity: it.qty,
      variant: it.variant || null,
    });
    p.stock -= it.qty;
    p.sold = (p.sold || 0) + it.qty;
  }

  const subtotal = valid.reduce((s, i) => s + i.price * i.quantity, 0);
  const order = {
    id: uid(),
    ref: `CMD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
    items: valid,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    customer: {
      name: customer.name,
      phone: customer.phone,
      city: customer.city || '',
      address: customer.address || '',
      email: customer.email || '',
    },
    zone: isPickup ? null : zone,
    deliveryMethod,
    paymentMethod,
    status: paymentMethod === 'cod' ? 'processing' : 'awaiting_payment',
    statusHistory: [{ status: paymentMethod === 'cod' ? 'processing' : 'awaiting_payment', at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };
  shop.orders.push(order);
  shop.stats = shop.stats || { visits: 0, orders: 0, revenue: 0 };
  shop.stats.orders += 1;
  await save(data);

  sendMail({ to: customer.email || shop.contacts?.email, ...mailTemplates.orderConfirmed(order.ref) });
  sendMail({ to: shop.contacts?.email || 'support@laboutique.ci', ...mailTemplates.newOrder(shop.name, order.ref) });

  return NextResponse.json({ order });
}