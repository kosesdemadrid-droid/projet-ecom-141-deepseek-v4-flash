import { db } from '@/lib/store';
import ContentEditor from '@/components/admin/ContentEditor';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const data = await db();
  return <ContentEditor landing={data.settings?.landing || {}} />;
}