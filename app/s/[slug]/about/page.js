import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import AboutPage from '@/components/shop/AboutPage';

export const dynamic = 'force-dynamic';

export default async function ShopAbout({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <AboutPage paragraphs={shop.pages?.about || []} shopName={shop.name} />;
}