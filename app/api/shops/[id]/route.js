import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  return NextResponse.json({ shop });
}

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const idx = data.shops.findIndex((s) => s.id === params.id && s.ownerId === user.id);
  if (idx === -1) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const allowed = [
    'name', 'tagline', 'slogan', 'colors', 'font', 'hero', 'layout',
    'logo', 'lang', 'pages', 'payments', 'delivery', 'customDomain',
    'social', 'contacts', 'slug',
  ];
  allowed.forEach((k) => {
    if (body[k] !== undefined) data.shops[idx][k] = body[k];
  });
  if (body.slug) {
    const candidate = String(body.slug).toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (candidate && !data.shops.some((s) => s.slug === candidate && s.id !== data.shops[idx].id)) {
      data.shops[idx].slug = candidate;
    }
  }
  data.shops[idx].updatedAt = new Date().toISOString();
  await save(data);
  return NextResponse.json({ shop: data.shops[idx] });
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const idx = data.shops.findIndex((s) => s.id === params.id && s.ownerId === user.id);
  if (idx === -1) return NextResponse.json({ error: 'Boutique introuvable.' }, { status: 404 });
  data.shops.splice(idx, 1);
  await save(data);
  return NextResponse.json({ ok: true });
}