import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import { formatFCFA } from '@/lib/money';
import ShopTabs from '@/components/dash/ShopTabs';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Aperçu de la boutique' };

export default async function ShopOverview({ params }) {
  const user = await getSessionUser();
  const data = await db();
  const shop = data.shops.find((s) => s.id === params.id);
  if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) notFound();
  const theme = data.themes.find((t) => t.key === shop.themeKey);
  const recent = [...shop.orders].reverse().slice(0, 5);
  const lowStock = shop.products.filter((p) => p.stock <= 5);

  const cards = [
    { label: 'Visites', value: shop.stats?.visits || 0, icon: '👀', to: 'settings' },
    { label: 'Commandes', value: shop.orders.length, icon: '🛒', to: 'orders' },
    { label: 'Revenus', value: formatFCFA(shop.stats?.revenue || 0), icon: '💰', to: 'orders' },
    { label: 'Produits', value: shop.products.length, icon: '📦', to: 'products' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white" style={{ background: shop.colors?.p || '#ea580c' }}>
            {shop.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{shop.name}</h1>
            <a href={`/s/${shop.slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-orange-600 hover:underline">
              la boutique.ci/{shop.slug} ↗
            </a>
          </div>
        </div>
        <div className="flex gap-3">
          {shop.customDomain && (
            <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10">
              🌐 {shop.customDomain}
            </span>
          )}
          <a href={`/s/${shop.slug}`} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800">
            Voir la boutique ↗
          </a>
        </div>
      </div>

      <ShopTabs shopId={shop.id} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={`/dashboard/shops/${shop.id}/${c.to}`} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="text-xl">{c.icon}</div>
            <div className="mt-2 text-xl font-black">{c.value}</div>
            <div className="text-xs font-semibold text-gray-400">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="font-bold">Dernières commandes</h2>
            <Link href={`/dashboard/shops/${shop.id}/orders`} className="text-xs font-bold text-orange-600 hover:underline">Tout voir</Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">Aucune commande pour le moment.</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-xs font-black text-orange-600">{o.items.length}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{o.ref}</div>
                    <div className="text-xs text-gray-400">{o.customer?.name} · {o.paymentMethod.toUpperCase()}</div>
                  </div>
                  <span className="text-sm font-black">{formatFCFA(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 font-bold">Thème & style</h2>
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5">
                <span className="h-6 w-6 rounded-full border" style={{ background: shop.colors?.p }} />
                <span className="h-6 w-6 rounded-full border" style={{ background: shop.colors?.p2 }} />
                <span className="h-6 w-6 rounded-full border" style={{ background: shop.colors?.p3 }} />
              </span>
              <div>
                <div className="text-sm font-bold">{theme?.name || shop.themeKey}</div>
                <div className="text-xs text-gray-400">Police : {shop.font} · Langue : {shop.lang === 'en' ? 'English' : 'Français'}</div>
              </div>
            </div>
            <Link href={`/dashboard/shops/${shop.id}/settings`} className="mt-4 block rounded-xl border border-gray-200 py-2.5 text-center text-xs font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
              Modifier le style
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 font-bold">Paiements activés</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(shop.payments || {}).map(([k, v]) => v && (
                <span key={k} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10">
                  {k === 'orange' ? '🟠 Orange Money' : k === 'mtn' ? '🟡 MTN MoMo' : k === 'wave' ? '🔵 Wave' : '💵 À la livraison'}
                </span>
              ))}
            </div>
          </div>
          {lowStock.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <h2 className="mb-2 font-bold text-amber-800 dark:text-amber-400">⚠️ Stock faible ({lowStock.length})</h2>
              <div className="space-y-1.5">
                {lowStock.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex justify-between text-xs font-semibold text-amber-700 dark:text-amber-500">
                    <span className="truncate">{p.name}</span>
                    <span>{p.stock} restant(s)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}