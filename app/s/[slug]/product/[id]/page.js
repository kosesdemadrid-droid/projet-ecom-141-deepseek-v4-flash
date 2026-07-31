import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import ProductPage from '@/components/shop/ProductPage';

export const dynamic = 'force-dynamic';

export default async function ShopProduct({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  const product = shop.products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = shop.products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const categories = [...new Set(shop.products.map((p) => p.category))];
  return (
    <ProductPage
      product={product}
      related={related.length ? related : shop.products.filter((p) => p.id !== product.id).slice(0, 4)}
      categories={categories}
    />
  );
}