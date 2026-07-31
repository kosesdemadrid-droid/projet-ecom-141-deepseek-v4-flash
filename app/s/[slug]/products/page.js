import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import Catalog from '@/components/shop/Catalog';

export const dynamic = 'force-dynamic';

export default async function ShopProducts({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <Catalog products={shop.products} />;
}