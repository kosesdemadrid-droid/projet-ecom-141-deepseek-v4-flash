import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
  const { token, password } = await req.json().catch(() => ({}));
  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: 'Lien invalide ou mot de passe trop court (6 caractères min.).' }, { status: 400 });
  }
  const data = await db();
  const user = data.users.find(
    (u) => u.resetToken === token && u.resetExpires > Date.now()
  );
  if (!user) {
    return NextResponse.json({ error: 'Ce lien est expiré ou invalide.' }, { status: 400 });
  }
  user.password = hashPassword(password);
  delete user.resetToken;
  delete user.resetExpires;
  await save(data);
  return NextResponse.json({ ok: true });
}