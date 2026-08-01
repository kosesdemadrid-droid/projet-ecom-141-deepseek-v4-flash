import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

let memoryCache = null;
let storageMode = null; // 'gist' | 'blob' | 'disk' (détecté une fois par instance)

/** Stockage distant via Gist GitHub (fonctionne sur toute plateforme serverless) */
const GIST_ID = process.env.DB_GIST_ID;
const GIST_TOKEN = process.env.DB_GIST_TOKEN;

async function readGist() {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: { Authorization: `token ${GIST_TOKEN}`, 'User-Agent': 'laboutique-ci' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`gist GET ${res.status}`);
  const j = await res.json();
  const content = j.files?.['db.json']?.content;
  return content ? JSON.parse(content) : null;
}

async function writeGist(dbData) {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: { Authorization: `token ${GIST_TOKEN}`, 'User-Agent': 'laboutique-ci', 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { 'db.json': { content: JSON.stringify(dbData) } } }),
  });
  if (!res.ok) throw new Error(`gist PATCH ${res.status}`);
}

/** Détection robuste du stockage : gist si configuré, sinon disque si inscriptible, sinon Netlify Blobs */
async function detectStorage() {
  if (GIST_ID && GIST_TOKEN) return 'gist';
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(DATA_DIR, '.wtest');
    await fs.writeFile(probe, 'ok');
    await fs.unlink(probe);
    return 'disk';
  } catch {
    return 'blob';
  }
}

async function getMode() {
  if (!storageMode) storageMode = await detectStorage();
  return storageMode;
}

async function blobStore() {
  const { getStore } = await import('@netlify/blobs');
  // Configuration explicite (fiable partout) : le contexte auto n'est pas toujours injecté
  const siteID = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: 'laboutique', siteID, token, apiURL: 'https://api.netlify.com/api/v1' });
  }
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
 * Couche de données : fichier JSON local quand le disque est inscriptible,
 * Netlify Blobs en serverless (remplaçable par Supabase/PostgreSQL).
 */
export async function db() {
  const mode = await getMode();
  if (mode === 'gist') {
    try {
      const existing = await readGist();
      if (existing) return existing;
      const seeded = await seed();
      await writeGist(seeded);
      return seeded;
    } catch (e) {
      if (!memoryCache) {
        console.warn('[db] Gist indisponible, repli en mémoire :', e.message);
        memoryCache = await seed();
      }
      return memoryCache;
    }
  }
  if (mode === 'blob') {
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
  const mode = await getMode();
  if (mode === 'gist') {
    memoryCache = next;
    try {
      await writeGist(next);
    } catch (e) {
      console.warn('[db] Sauvegarde gist impossible :', e.message);
    }
    return;
  }
  if (mode === 'blob') {
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

/** Vrai quand le stockage est distant (gist/blobs) — les écritures y sont lourdes */
export async function isRemote() {
  const mode = await getMode();
  return mode === 'gist' || mode === 'blob';
}