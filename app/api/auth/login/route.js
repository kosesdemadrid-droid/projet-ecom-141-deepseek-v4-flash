import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/store';
import { verifyPassword, createSession, publicUser } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) });
}