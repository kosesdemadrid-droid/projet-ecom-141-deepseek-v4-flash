import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import TermsPage from '@/components/shop/TermsPage';

export const dynamic = 'force-dynamic';

export default async function ShopTerms({ params }) {
  const data = await db();
  const shop = data.shops.find((s) => s.slug === params.slug);
  if (!shop) notFound();
  return <TermsPage paragraphs={shop.pages?.terms || []} />;
}