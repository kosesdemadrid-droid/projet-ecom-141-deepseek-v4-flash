import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
/** Sur Netlify (serverless), le disque est en lecture seule → on utilise Netlify Blobs */
const USE_BLOBS = !!process.env.NETLIFY;

let memoryCache = null;

async function blobStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore('laboutique');
}

async function readBlob() {
  const store = await blobStore();
  const raw = await store.get('db');
  return raw ? JSON.parse(raw) : null;
}

async function writeBlob(dbData) {
  const store = await blobStore();
  await store.set('db', JSON.stringify(dbData));
}

async function seed() {
  const { seedDatabase } = await import('./seed.js');
  return seedDatabase();
}

/**
 * Couche de données : fichier JSON local en dev, Netlify Blobs en production
 * (remplaçable par Supabase/PostgreSQL).
 */
export async function db() {
  if (USE_BLOBS) {
    try {
      const existing = await readBlob();
      if (existing) return existing;
      const seeded = await seed();
      await writeBlob(seeded);
      return seeded;
    } catch (e) {
      // Repli mémoire : le site reste fonctionnel même si les blobs échouent
      if (!memoryCache) {
        console.warn('[db] Blobs indisponibles, repli en mémoire :', e.message);
        memoryCache = await seed();
      }
      return memoryCache;
    }
  }
  try {
    return JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  } catch {
    const seeded = await seed();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seeded, null, 2), 'utf8');
    return seeded;
  }
}

export async function save(next) {
  if (USE_BLOBS) {
    memoryCache = next;
    try {
      await writeBlob(next);
    } catch (e) {
      console.warn('[db] Sauvegarde blobs impossible :', e.message);
    }
    return;
  }
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