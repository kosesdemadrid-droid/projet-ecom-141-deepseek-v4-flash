import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db, save, uid } from './store.js';

const SESSION_COOKIE = 'lb_session';
const SESSION_DAYS = 7;

export const hashPassword = (pw) => bcrypt.hashSync(pw, 10);
export const verifyPassword = (pw, hash) => bcrypt.compareSync(pw, hash || '');

export async function createSession(userId, data) {
  // data optionnel : base déjà mutée (évite une relecture qui perdrait des changements en cas d'écriture concurrente)
  const dbData = data || (await db());
  dbData.sessions = dbData.sessions.filter((s) => s.userId !== userId);
  dbData.sessions.push({
    token: uid() + uid(),
    userId,
    createdAt: new Date().toISOString(),
    expires: Date.now() + SESSION_DAYS * 24 * 3600 * 1000,
  });
  await save(dbData);
  const token = dbData.sessions[dbData.sessions.length - 1].token;
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 3600,
    path: '/',
  });
  return token;
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const data = await db();
    data.sessions = data.sessions.filter((s) => s.token !== token);
    await save(data);
  }
  cookies().delete(SESSION_COOKIE);
}

/** Retourne l'utilisateur courant (null si non connecté) */
export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const data = await db();
  const session = data.sessions.find(
    (s) => s.token === token && s.expires > Date.now()
  );
  if (!session) return null;
  const user = data.users.find((u) => u.id === session.userId);
  return user ? { ...user } : null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  createdAt: u.createdAt,
});