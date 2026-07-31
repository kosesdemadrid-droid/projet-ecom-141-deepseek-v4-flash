import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import SettingsManager from '@/components/dash/SettingsManager';
import { ToastProvider } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Paramètres' };

export default async function SettingsPage({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  const theme = data.themes.find((t) => t.key === shop.themeKey);
  return (
    <ToastProvider>
      <SettingsManager shop={shop} theme={theme} />
    </ToastProvider>
  );
}