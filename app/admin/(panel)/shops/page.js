import { db } from '@/lib/store';
import AdminShops from '@/components/admin/AdminShops';

export const dynamic = 'force-dynamic';

export default async function AdminShopsPage() {
  const data = await db();
  const shops = data.shops.map((s) => ({
    id: s.id, name: s.name, slug: s.slug, demo: !!s.demo,
    ownerName: data.users.find((u) => u.id === s.ownerId)?.name || '—',
    ownerEmail: data.users.find((u) => u.id === s.ownerId)?.email || '—',
    products: s.products.length, orders: s.orders.length,
    revenue: s.stats?.revenue || 0, visits: s.stats?.visits || 0,
  }));
  return <AdminShops shops={shops} />;
}