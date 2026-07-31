import { NextResponse } from 'next/server';
import { db, save } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const data = await db();
  return NextResponse.json({ landing: data.settings?.landing, contact: data.settings?.contact });
}

export async function PUT(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data = await db();
  data.settings = data.settings || {};
  if (body.landing) data.settings.landing = body.landing;
  if (body.contact) data.settings.contact = body.contact;
  await save(data);
  return NextResponse.json({ ok: true });
}