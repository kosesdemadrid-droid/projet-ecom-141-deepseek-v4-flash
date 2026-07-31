import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { getSessionUser, verifyPassword, hashPassword, publicUser } from '@/lib/auth';

export async function PATCH(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data = await db();
  const u = data.users.find((x) => x.id === user.id);
  if (!u) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });

  if (body.name) u.name = body.name;
  if (body.phone !== undefined) u.phone = body.phone;
  if (body.password || body.currentPassword) {
    if (!verifyPassword(body.currentPassword || '', u.password)) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: 'Nouveau mot de passe trop court (6 caractères min.).' }, { status: 400 });
    }
    u.password = hashPassword(body.password);
  }
  await save(data);
  return NextResponse.json({ user: publicUser(u) });
}