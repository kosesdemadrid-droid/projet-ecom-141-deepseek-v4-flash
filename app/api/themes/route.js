import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const data = await db();
  return NextResponse.json({ themes: data.themes });
}