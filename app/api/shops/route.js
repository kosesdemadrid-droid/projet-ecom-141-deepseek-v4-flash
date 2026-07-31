import { NextResponse } from 'next/server';
import { db, save, uid, uniqueSlug } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

/** Liste mes boutiques / créer une boutique */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shops = data.shops
    .filter((s) => s.ownerId === user.id)
    .map((s) => ({ ...s, products: undefined }))
    .map((s) => ({ ...s, productCount: data.shops.find((x) => x.id === s.id)?.products.length || 0 }));
  return NextResponse.json({ shops });
}

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { name, tagline, themeKey, colors, font, hero, layout, logo, lang, importProducts, slug } = body;
  if (!name || !themeKey) {
    return NextResponse.json({ error: 'Nom et thème requis.' }, { status: 400 });
  }
  const data = await db();
  const theme = data.themes.find((t) => t.key === themeKey);
  if (!theme) return NextResponse.json({ error: 'Thème introuvable.' }, { status: 404 });

  const shopSlug = uniqueSlug(slug || name, data.shops);
  const shop = {
    id: uid(),
    ownerId: user.id,
    slug: shopSlug,
    name,
    tagline: tagline || '',
    slogan: tagline || '',
    themeKey,
    colors: { ...(colors || theme.colors) },
    font: font || theme.font,
    hero: hero || theme.hero,
    layout: layout || theme.layouts[0] || 'banner',
    logo: logo || null,
    lang: lang === 'en' ? 'en' : 'fr',
    pages: {
      about: [`Bienvenue chez ${name} !`, 'Découvrez notre sélection de produits de qualité, livrés partout en Côte d\'Ivoire.'],
      terms: ['1. Commandes — Toute commande est confirmée après paiement ou à la livraison.\n2. Paiements — Orange Money, MTN MoMo, Wave et espèces à la livraison.\n3. Livraison — Abidjan sous 24-48h, intérieur du pays sous 2-4 jours.\n4. Retours — 7 jours après réception.\n5. Contact — support@laboutique.ci'],
    },
    payments: { orange: true, mtn: true, wave: true, cod: true },
    delivery: {
      zones: [
        { name: 'Abidjan', fee: 1500 },
        { name: 'Intérieur du pays', fee: 3000 },
      ],
      pickup: true,
      freeOver: 50000,
    },
    customDomain: '',
    social: { whatsapp: '', facebook: '', twitter: '' },
    contacts: { email: '', address: '' },
    stats: { visits: 0, orders: 0, revenue: 0 },
    products: [],
    orders: [],
    messages: [],
    subscribers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    demo: false,
  };
  data.shops.push(shop);
  await save(data);
  return NextResponse.json({ shop: { ...shop, productCount: 0 } });
}