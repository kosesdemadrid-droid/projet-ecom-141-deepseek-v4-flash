import Link from 'next/link';
import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import { formatFCFA } from '@/lib/money';
import { Img } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Tableau de bord' };

const STATUS_LABEL = {
  awaiting_payment: 'En attente de paiement',
  paid: 'Payée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_COLOR = {
  awaiting_payment: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  paid: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  processing: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  shipped: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  const data = await db();
  const myShops = data.shops.filter((s) => s.ownerId === user.id);
  const products = myShops.reduce((s, x) => s + x.products.length, 0);
  const orders = myShops.reduce((s, x) => s + x.orders.length, 0);
  const revenue = myShops.reduce((s, x) => s + (x.stats?.revenue || 0), 0);
  const visits = myShops.reduce((s, x) => s + (x.stats?.visits || 0), 0);
  const recent = myShops
    .flatMap((sh) =>
      sh.orders.map((o) => ({ ...o, shopName: sh.name, shopId: sh.id }))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const stats = [
    { label: 'Boutiques', value: myShops.length, icon: '🏬', to: '/dashboard/shops', color: 'from-orange-500 to-amber-500' },
    { label: 'Produits', value: products, icon: '📦', to: myShops[0] ? `/dashboard/shops/${myShops[0].id}/products` : '/dashboard/shops/new', color: 'from-blue-500 to-indigo-500' },
    { label: 'Commandes', value: orders, icon: '🛒', to: myShops[0] ? `/dashboard/shops/${myShops[0].id}/orders` : '/dashboard/shops/new', color: 'from-emerald-500 to-green-600' },
    { label: 'Revenus', value: formatFCFA(revenue), icon: '💰', to: '/dashboard/shops', color: 'from-fuchsia-500 to-purple-600' },
    { label: 'Visites', value: visits, icon: '👀', to: '/dashboard/shops', color: 'from-cyan-500 to-sky-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Bonjour {user.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-gray-500">Voici un aperçu de votre activité sur LaBoutique.ci.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.to} className="card-premium group rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg text-white shadow-lg ${s.color}`}>{s.icon}</div>
            <div className="mt-3 text-xl font-black">{s.value}</div>
            <div className="text-xs font-semibold text-gray-400">{s.label}</div>
          </Link>
        ))}
      </div>

      {myShops.length === 0 && (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-10 text-center dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="text-4xl">🚀</div>
          <h2 className="mt-3 text-lg font-bold">Lancez votre première boutique</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Choisissez un thème premium ou clonez une boutique démo déjà remplie de produits. C'est gratuit et instantané.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/shops/new" className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800">✨ Créer ma boutique</Link>
            <Link href="/dashboard/templates" className="rounded-xl border-2 border-gray-900/10 px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-900/30">🎁 Boutiques prêtes à l'emploi</Link>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="font-bold">Dernières commandes</h2>
            <Link href="/dashboard/shops" className="text-xs font-bold text-orange-600 hover:underline">Tout voir</Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">Aucune commande pour le moment.</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLOR[o.status] || STATUS_COLOR.paid}`}>{STATUS_LABEL[o.status] || o.status}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{o.ref} · {o.customer?.name}</div>
                    <div className="text-xs text-gray-400">{o.shopName} · {o.items.length} article(s)</div>
                  </div>
                  <span className="text-sm font-black">{formatFCFA(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="font-bold">Mes boutiques</h2>
          </div>
          <div className="space-y-3 p-4">
            {myShops.length === 0 && <p className="py-6 text-center text-sm text-gray-400">Aucune boutique.</p>}
            {myShops.slice(0, 4).map((s) => (
              <Link key={s.id} href={`/dashboard/shops/${s.id}`} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-orange-200 hover:bg-orange-50/40 dark:border-gray-800 dark:hover:bg-gray-800">
                <Img src={s.hero} alt="" fallback="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80" className="h-11 w-11 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.products.length} produits · {formatFCFA(s.stats?.revenue || 0)}</div>
                </div>
                <span className="text-gray-300">›</span>
              </Link>
            ))}
            <Link href="/dashboard/shops" className="block rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-center text-xs font-bold text-gray-400 transition hover:border-gray-400 hover:text-gray-600 dark:border-gray-700">
              + Toutes mes boutiques
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}