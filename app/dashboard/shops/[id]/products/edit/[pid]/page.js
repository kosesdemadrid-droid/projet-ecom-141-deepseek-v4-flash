import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import ProductForm from '@/components/dash/ProductForm';
import { ToastProvider } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Modifier le produit' };

export default async function EditProduct({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  const product = shop.products.find((p) => p.id === params.pid);
  if (!product) notFound();
  return (
    <ToastProvider>
      <ProductForm shop={{ id: shop.id, products: shop.products }} product={product} />
    </ToastProvider>
  );
}