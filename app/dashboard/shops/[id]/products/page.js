import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import ProductsManager from '@/components/dash/ProductsManager';
import { ToastProvider } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Produits' };

export default async function ProductsPage({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  return (
    <ToastProvider>
      <ProductsManager shop={{ id: shop.id, slug: shop.slug, name: shop.name, products: shop.products }} />
    </ToastProvider>
  );
}