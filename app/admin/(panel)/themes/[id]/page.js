import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import ThemeEditor from '@/components/admin/ThemeEditor';

export const dynamic = 'force-dynamic';

export default async function ThemeEditPage({ params }) {
  const data = await db();
  const theme = data.themes.find((t) => t.id === params.id);
  if (!theme) notFound();
  const shopCount = data.shops.filter((s) => s.themeKey === theme.key).length;
  return <ThemeEditor theme={theme} shopCount={shopCount} />;
}