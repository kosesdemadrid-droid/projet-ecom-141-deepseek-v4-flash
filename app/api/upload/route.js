import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  if (process.env.NETLIFY) {
    return NextResponse.json(
      { error: "L'import de fichiers n'est pas disponible sur Netlify (système de fichiers en lecture seule). Utilisez une image Unsplash ou un lien URL." },
      { status: 400 }
    );
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || !file.size) return NextResponse.json({ error: 'Aucun fichier.' }, { status: 400 });
  const name = file.name || 'img';
  const ext = (name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  if (!allowed.includes(ext)) return NextResponse.json({ error: 'Format non supporté.' }, { status: 400 });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const fname = `${id}.${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > 6 * 1024 * 1024) return NextResponse.json({ error: 'Image trop lourde (6 Mo max).' }, { status: 400 });
  await writeFile(path.join(dir, fname), buf);
  return NextResponse.json({ url: `/uploads/${fname}` });
}