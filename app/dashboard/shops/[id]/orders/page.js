import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import OrdersManager from '@/components/dash/OrdersManager';
import { ToastProvider } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Commandes' };

export default async function OrdersPage({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  return (
    <ToastProvider>
      <OrdersManager shop={{ id: shop.id, slug: shop.slug, name: shop.name, orders: shop.orders }} />
    </ToastProvider>
  );
}