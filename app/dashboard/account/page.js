import { getSessionUser } from '@/lib/auth';
import AccountPage from './AccountClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Compte & paramètres' };

export default async function Account() {
  const user = await getSessionUser();
  if (!user) return null;
  return <AccountPage user={user} />;
}