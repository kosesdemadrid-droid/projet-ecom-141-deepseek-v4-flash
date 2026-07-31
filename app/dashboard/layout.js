import { redirect } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import DashShell from '@/components/dash/DashShell';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent('/dashboard')}`);

  const data = await db();
  const shops = data.shops
    .filter((s) => s.ownerId === user.id)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      unreadMessages: s.messages.filter((m) => !m.read).length,
    }));

  return <DashShell user={user} shops={shops}>{children}</DashShell>;
}