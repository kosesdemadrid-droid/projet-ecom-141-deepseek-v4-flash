import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import CheckoutPage from '@/components/shop/CheckoutPage';

export const dynamic = 'force-dynamic';

export default async function ShopCheckout({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <CheckoutPage />;
}