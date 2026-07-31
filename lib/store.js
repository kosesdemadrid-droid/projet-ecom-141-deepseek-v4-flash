import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

/**
 * Couche de données locale (remplaçable par Supabase/PostgreSQL).
 * Lecture disque à chaque accès → cohérent entre pages et API routes.
 */
export async function db() {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  } catch {
    const { seedDatabase } = await import('./seed.js');
    const seeded = await seedDatabase();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seeded, null, 2), 'utf8');
    return seeded;
  }
}

export async function save(next) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), 'utf8');
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const slugify = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

export const nowIso = () => new Date().toISOString();

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Génère un slug unique dans la liste donnée */
export function uniqueSlug(base, list) {
  let s = slugify(base) || 'boutique';
  let n = 2;
  const used = new Set(list.map((x) => x.slug));
  while (used.has(s)) s = `${slugify(base) || 'boutique'}-${n++}`;
  return s;
}

export async function findUserByEmail(email) {
  const data = await db();
  return data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

export async function findShopBySlug(slug) {
  const data = await db();
  return data.shops.find((s) => s.slug === slug);
}

export async function getTheme(key) {
  const data = await db();
  return data.themes.find((t) => t.key === key);
}

export function pageSlice(list, page, perPage = 12) {
  return list.slice((page - 1) * perPage, page * perPage);
}

export function totalPages(list, perPage = 12) {
  return Math.max(1, Math.ceil(list.length / perPage));
}