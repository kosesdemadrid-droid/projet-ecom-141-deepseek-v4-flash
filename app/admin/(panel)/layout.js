import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') redirect('/admin/login');
  return <AdminShell user={user}>{children}</AdminShell>;
}