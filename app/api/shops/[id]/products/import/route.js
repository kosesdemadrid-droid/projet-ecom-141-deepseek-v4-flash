import { NextResponse } from 'next/server';
import { db, save, uid, slugify } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

/** Importe les produits de démonstration du thème dans la boutique */
export async function POST(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id && s.ownerId === user.id);
  if (!shop) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { seedDatabase } = await import('@/lib/seed');
  const seed = await seedDatabase();
  const sourceShop = seed.shops.find((s) => s.themeKey === shop.themeKey);

  const names = new Set(shop.products.map((p) => p.name));
  let count = 0;
  if (sourceShop) {
    sourceShop.products.forEach((p) => {
      if (names.has(p.name)) return;
      names.add(p.name);
      shop.products.push({
        ...p,
        id: uid(),
        slug: slugify(p.name + '-' + Math.random().toString(36).slice(2, 6)),
        reviews: [],
        createdAt: new Date().toISOString(),
      });
      count++;
    });
  }
  shop.updatedAt = new Date().toISOString();
  await save(data);
  return NextResponse.json({ count, total: shop.products.length });
}