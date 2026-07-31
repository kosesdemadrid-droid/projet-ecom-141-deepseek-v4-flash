import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import TrackingPage from '@/components/shop/TrackingPage';

export const dynamic = 'force-dynamic';

export default async function ShopTracking({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <TrackingPage orders={shop.orders} />;
}