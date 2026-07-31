import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import ConfirmationPage from '@/components/shop/ConfirmationPage';

export const dynamic = 'force-dynamic';

export default async function ShopConfirmation({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  const order = shop.orders.find((o) => o.id === params.id);
  if (!order) notFound();
  return <ConfirmationPage order={order} shop={shop} />;
}