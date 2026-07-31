import { NextResponse } from 'next/server';
import { db, save, uid, findUserByEmail } from '@/lib/store';
import { sendMail, mailTemplates } from '@/lib/mail';

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));
  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ ok: true }); // ne pas révéler l'existence du compte
  }
  const data = await db();
  const token = uid() + uid();
  data.users = data.users.map((u) =>
    u.id === user.id ? { ...u, resetToken: token, resetExpires: Date.now() + 3600 * 1000 } : u
  );
  await save(data);
  const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  sendMail({ to: user.email, ...mailTemplates.reset(link) });
  return NextResponse.json({ ok: true });
}