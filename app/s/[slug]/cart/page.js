import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import CartPage from '@/components/shop/CartPage';

export const dynamic = 'force-dynamic';

export default async function ShopCart({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <CartPage />;
}