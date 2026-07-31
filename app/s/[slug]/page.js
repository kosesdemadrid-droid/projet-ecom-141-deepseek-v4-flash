import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import HomePage from '@/components/shop/HomePage';

export const dynamic = 'force-dynamic';

export default async function ShopHome({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <HomePage products={shop.products} />;
}