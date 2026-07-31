import Link from 'next/link';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import { formatFCFA } from '@/lib/money';
import { Img } from '@/components/ui';
import { ShopCard } from '@/components/dash/ShopCard';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Mes boutiques' };

export default async function ShopsPage() {
  const user = await getSessionUser();
  const data = await db();
  const shops = data.shops
    .filter((s) => s.ownerId === user.id)
    .map((s) => ({
      id: s.id, slug: s.slug, name: s.name, hero: s.hero, logo: s.logo,
      productCount: s.products.length,
      orders: s.orders.length,
      revenue: s.stats?.revenue || 0,
      visits: s.stats?.visits || 0,
      themeName: data.themes.find((t) => t.key === s.themeKey)?.name || s.themeKey,
      unread: s.messages.filter((m) => !m.read).length,
    }));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Mes boutiques</h1>
          <p className="mt-1 text-sm text-gray-500">{shops.length} boutique(s) — gérez-les depuis cet espace.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/templates" className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
            🎁 Boutiques prêtes à l'emploi
          </Link>
          <Link href="/dashboard/shops/new" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800">
            ✨ Créer une boutique
          </Link>
        </div>
      </div>

      {shops.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 p-14 text-center dark:border-gray-700">
          <div className="text-5xl">🏬</div>
          <h2 className="mt-3 text-lg font-bold">Aucune boutique pour le moment</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">Créez une boutique from scratch avec notre assistant 3 étapes, ou dupliquez une boutique démo en 1 clic.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/dashboard/shops/new" className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white">Créer ma boutique</Link>
            <Link href="/dashboard/templates" className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-700">Voir les démos</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shops.map((s) => <ShopCard key={s.id} shop={s} />)}
        </div>
      )}
    </div>
  );
}