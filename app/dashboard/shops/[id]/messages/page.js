import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import MessagesManager from '@/components/dash/MessagesManager';
import { ToastProvider } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Messages' };

export default async function MessagesPage({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  return (
    <ToastProvider>
      <MessagesManager shop={{ id: shop.id, name: shop.name, messages: shop.messages }} />
    </ToastProvider>
  );
}