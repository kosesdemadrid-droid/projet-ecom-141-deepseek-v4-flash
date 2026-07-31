import { NextResponse } from 'next/server';
import { db, save, uid } from '@/lib/store';
import { hashPassword, createSession, publicUser } from '@/lib/auth';
import { sendMail, mailTemplates } from '@/lib/mail';

export async function POST(req) {
  const { name, email, password, phone } = await req.json().catch(() => ({}));
  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Nom, email et mot de passe (6 caractères min.) sont requis.' }, { status: 400 });
  }
  const data = await db();
  if (data.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
  }
  const user = {
    id: uid(),
    name,
    email: String(email).toLowerCase(),
    phone: phone || '',
    password: hashPassword(password),
    role: 'client',
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  await save(data);
  await createSession(user.id);
  sendMail({ to: user.email, ...mailTemplates.welcome(user.name) });
  return NextResponse.json({ user: publicUser(user) });
}