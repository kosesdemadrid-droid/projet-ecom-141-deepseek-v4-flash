import { NextResponse } from 'next/server';
import { db, save, uid, slugify } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

const canManage = (user, shop) => user && (shop.ownerId === user.id || user.role === 'admin');

export async function GET(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || !canManage(user, shop)) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  return NextResponse.json({ products: shop.products });
}

export async function POST(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || !canManage(user, shop)) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.price) {
    return NextResponse.json({ error: 'Nom et prix requis.' }, { status: 400 });
  }
  const product = {
    id: uid(),
    name: body.name,
    slug: slugify(body.name),
    description: body.description || '',
    price: Number(body.price) || 0,
    oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
    images: (body.images || []).filter(Boolean).slice(0, 5),
    category: body.category || 'Général',
    stock: Number(body.stock) != null ? Number(body.stock) : 10,
    variants: Array.isArray(body.variants) ? body.variants : [],
    reviews: [],
    sold: 0,
    createdAt: new Date().toISOString(),
  };
  shop.products.push(product);
  shop.updatedAt = new Date().toISOString();
  await save(data);
  return NextResponse.json({ product });
}