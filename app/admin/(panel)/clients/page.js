import { db } from '@/lib/store';
import AdminClients from '@/components/admin/AdminClients';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const data = await db();
  const clients = data.users
    .filter((u) => u.role === 'client')
    .map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt,
      shops: data.shops.filter((s) => s.ownerId === u.id).length,
      orders: data.shops.filter((s) => s.ownerId === u.id).reduce((s, x) => s + x.orders.length, 0),
      revenue: data.shops.filter((s) => s.ownerId === u.id).reduce((s, x) => s + (x.stats?.revenue || 0), 0),
    }));
  return <AdminClients clients={clients} />;
}