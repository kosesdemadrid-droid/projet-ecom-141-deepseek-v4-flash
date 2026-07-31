import { db } from '@/lib/store';
import AdminThemes from '@/components/admin/AdminThemes';

export const dynamic = 'force-dynamic';

export default async function AdminThemesPage() {
  const data = await db();
  const usage = data.shops.reduce((acc, s) => {
    acc[s.themeKey] = (acc[s.themeKey] || 0) + 1;
    return acc;
  }, {});
  return <AdminThemes themes={data.themes} usage={usage} />;
}