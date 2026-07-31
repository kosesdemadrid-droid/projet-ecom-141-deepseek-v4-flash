import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/store';
import PaymentPage from '@/components/shop/PaymentPage';

export const dynamic = 'force-dynamic';

export default async function ShopPayment({ params, searchParams }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  const order = shop.orders.find((o) => o.id === (searchParams?.order || ''));
  if (!order || order.paymentMethod === 'cod') redirect(`/s/${shop.slug}`);
  return <PaymentPage order={order} shop={shop} />;
}