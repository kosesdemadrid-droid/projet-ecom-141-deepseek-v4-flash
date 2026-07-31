import { NextResponse } from 'next/server';
import { db, save, uid, slugify } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

const FONTS = ['Inter', 'Poppins', 'Playfair Display', 'Space Grotesk', 'Lora', 'DM Serif Display', 'Baloo 2', 'Cormorant Garamond', 'Barlow Condensed', 'Fraunces'];

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.colors?.p) return NextResponse.json({ error: 'Nom et couleur requise.' }, { status: 400 });
  const data = await db();
  const key = slugify(body.key || body.name) || 'theme';
  if (data.themes.some((t) => t.key === key)) return NextResponse.json({ error: 'Ce thème existe déjà.' }, { status: 409 });
  data.themes.push({
    id: uid(),
    key,
    name: body.name,
    tagline: body.tagline || '',
    sector: body.sector || 'Général',
    colors: { p: body.colors.p, p2: body.colors.p2 || body.colors.p, p3: body.colors.p3 || '#fbbf24', bg: body.colors.bg || '#ffffff' },
    font: FONTS.includes(body.font) ? body.font : 'Inter',
    hero: body.hero || '',
    layouts: Array.isArray(body.layouts) && body.layouts.length ? body.layouts : ['banner', 'split', 'center'],
    categories: Array.isArray(body.categories) ? body.categories : [],
    featured: body.featured !== false,
    createdAt: new Date().toISOString(),
  });
  await save(data);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data = await db();
  const t = data.themes.find((x) => x.id === body.id);
  if (!t) return NextResponse.json({ error: 'Thème introuvable.' }, { status: 404 });
  ['name', 'tagline', 'sector', 'colors', 'hero', 'layouts', 'categories', 'featured'].forEach((k) => {
    if (body[k] !== undefined) t[k] = body[k];
  });
  if (FONTS.includes(body.font)) t.font = body.font;
  await save(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  const data = await db();
  const t = data.themes.find((x) => x.id === id);
  if (!t) return NextResponse.json({ error: 'Thème introuvable.' }, { status: 404 });
  if (data.shops.some((s) => s.themeKey === t.key)) {
    return NextResponse.json({ error: 'Impossible : des boutiques utilisent ce thème.' }, { status: 409 });
  }
  data.themes = data.themes.filter((x) => x.id !== id);
  await save(data);
  return NextResponse.json({ ok: true });
}