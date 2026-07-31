import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { ShopProvider } from '@/components/shop/ShopContext';
import ShopShell from '@/components/shop/ShopShell';

export const dynamic = 'force-dynamic';

export default async function ShopLayout({ params, children }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  const categories = [...new Set(shop.products.map((p) => p.category))];
  const plain = JSON.parse(JSON.stringify(shop));

  return (
    <ShopProvider shop={plain}>
      <ShopShell categories={categories}>{children}</ShopShell>
    </ShopProvider>
  );
}