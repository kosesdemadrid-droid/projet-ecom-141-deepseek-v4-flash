import { NextResponse } from 'next/server';
import { db, save, uid, slugify } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const data = await db();
  const revenue = data.shops.reduce((s, x) => s + (x.stats?.revenue || 0), 0);
  const orders = data.shops.reduce((s, x) => s + x.orders.length, 0);
  const products = data.shops.reduce((s, x) => s + x.products.length, 0);
  const visits = data.shops.reduce((s, x) => s + (x.stats?.visits || 0), 0);
  const openTickets = data.tickets.filter((t) => t.status === 'open').length;
  return NextResponse.json({
    stats: {
      users: data.users.filter((u) => u.role === 'client').length,
      admins: data.users.filter((u) => u.role === 'admin').length,
      shops: data.shops.length,
      demoShops: data.shops.filter((s) => s.demo).length,
      products,
      orders,
      revenue,
      visits,
      openTickets,
      subscribers: data.shops.reduce((s, x) => s + (x.subscribers?.length || 0), 0),
    },
    recentOrders: data.shops
      .flatMap((s) => s.orders.map((o) => ({ ...o, shopName: s.name, shopId: s.id })))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8),
    topShops: [...data.shops]
      .sort((a, b) => (b.stats?.revenue || 0) - (a.stats?.revenue || 0))
      .slice(0, 5)
      .map((s) => ({ name: s.name, slug: s.slug, revenue: s.stats?.revenue || 0, orders: s.orders.length, visits: s.stats?.visits || 0 })),
    latestUsers: [...data.users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
  });
}