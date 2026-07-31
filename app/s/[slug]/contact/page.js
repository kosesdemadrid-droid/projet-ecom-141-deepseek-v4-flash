import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import ContactPage from '@/components/shop/ContactPage';

export const dynamic = 'force-dynamic';

export default async function ShopContact({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <ContactPage />;
}