import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const { subject, message } = await req.json().catch(() => ({}));
  if (!subject || !message) return NextResponse.json({ error: 'Sujet et message requis.' }, { status: 400 });
  const data = await db();
  data.tickets.push({
    id: uid(),
    userId: user.id,
    name: user.name,
    email: user.email,
    subject,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
  });
  await save(data);
  return NextResponse.json({ ok: true });
}