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

  const weekAgo = Date.now() - 7 * 86400000;
  const monthAgo = Date.now() - 30 * 86400000;
  const allOrders = myShops.flatMap((sh) => sh.orders.map((o) => ({ ...o, shopName: sh.name, shopId: sh.id })));
  const ordersThisWeek = allOrders.filter((o) => new Date(o.createdAt).getTime() > weekAgo).length;
  const revenueThisMonth = allOrders
    .filter((o) => new Date(o.createdAt).getTime() > monthAgo && !['cancelled', 'awaiting_payment'].includes(o.status))
    .reduce((s, o) => s + o.total, 0);
  const pending = allOrders.filter((o) => o.status === 'awaiting_payment').length;
  const unread = myShops.reduce((s, x) => s + x.messages.filter((m) => !m.read).length, 0);
  const recent = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const stats = [
    { label: 'Boutiques', value: myShops.length, icon: '🏬', to: '/dashboard/shops', grad: 'from-orange-500 to-amber-500', sub: `${products} produits` },
    { label: 'Produits', value: products, icon: '📦', to: myShops[0] ? `/dashboard/shops/${myShops[0].id}/products` : '/dashboard/shops/new', grad: 'from-blue-500 to-indigo-500', sub: 'en ligne' },
    { label: 'Commandes', value: orders, icon: '🛒', to: myShops[0] ? `/dashboard/shops/${myShops[0].id}/orders` : '/dashboard/shops/new', grad: 'from-emerald-500 to-green-600', sub: `+${ordersThisWeek} cette semaine` },
    { label: 'Revenus', value: formatFCFA(revenue), icon: '💰', to: '/dashboard/shops', grad: 'from-fuchsia-500 to-purple-600', sub: `+${formatFCFA(revenueThisMonth)} ce mois` },
    { label: 'Visites', value: visits, icon: '👀', to: '/dashboard/shops', grad: 'from-cyan-500 to-sky-500', sub: 'sur vos boutiques' },
  ];

  return (
    <div>
      {/* Bannière de bienvenue */}
      <div className="panel-dark grain relative overflow-hidden rounded-3xl px-7 py-8 sm:px-9">
        <div className="orb -right-24 -top-24 h-72 w-72 bg-orange-600/35" />
        <div className="orb -bottom-32 left-1/3 h-64 w-64 bg-amber-500/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-amber-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              {pending > 0 ? `${pending} commande(s) en attente` : 'Tout est en ordre'}
            </span>
            <h1 className="font-display mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Bonjour {user.name.split(' ')[0]} <span className="grad-text">👋</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {myShops.length > 0
                ? `Vous gérez ${myShops.length} boutique(s) et ${products} produits. Bonne vente !`
                : 'Lancez votre première boutique : c\'est gratuit et instantané.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/shops/new" className="btn-premium rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-white shadow-glow-orange">
              ✨ Créer une boutique
            </Link>
            <Link href="/dashboard/templates" className="glass rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              🎁 Boutiques démo
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.to} className="card-premium group rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg text-white shadow-lg ${s.grad}`}>{s.icon}</div>
            <div className="mt-3 truncate text-xl font-black">{s.value}</div>
            <div className="mt-0.5 text-xs font-bold text-gray-800 dark:text-gray-200">{s.label}</div>
            <div className="text-[11px] font-semibold text-emerald-600">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Alertes */}
      {(unread > 0 || pending > 0) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {unread > 0 && (
            <Link href={`/dashboard/shops/${myShops.find((s) => s.messages.some((m) => !m.read)).id}/messages`} className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-700 transition hover:bg-red-100/70 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              ✉️ {unread} message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''} dans votre boîte de réception
            </Link>
          )}
          {pending > 0 && (
            <Link href="/dashboard/shops" className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100/70 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              💳 {pending} paiement(s) en attente de confirmation
            </Link>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Dernières commandes */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div>
              <h2 className="font-display text-lg font-semibold">Dernières commandes</h2>
              <p className="text-xs text-gray-400">{allOrders.length} au total · {formatFCFA(revenue)} de CA</p>
            </div>
            <Link href="/dashboard/shops" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300">
              Tout voir →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="text-4xl">🛒</div>
              <p className="mt-3 text-sm text-gray-400">Aucune commande pour le moment. Partagez le lien de votre boutique !</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-gray-50/70 dark:hover:bg-gray-800/50">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLOR[o.status] || STATUS_COLOR.paid}`}>{STATUS_LABEL[o.status] || o.status}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{o.ref} · {o.customer?.name}</div>
                    <div className="text-xs text-gray-400">{o.shopName} · {o.items.length} article(s) · {new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className="text-sm font-black">{formatFCFA(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mes boutiques */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div>
              <h2 className="font-display text-lg font-semibold">Mes boutiques</h2>
              <p className="text-xs text-gray-400">{myShops.length} boutique(s) active(s)</p>
            </div>
            <Link href="/dashboard/shops" className="text-xs font-bold text-orange-500 hover:underline">Gérer →</Link>
          </div>
          <div className="space-y-2.5 p-4">
            {myShops.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">Aucune boutique. Créez la première ! 🚀</p>
            )}
            {myShops.slice(0, 4).map((s) => (
              <Link key={s.id} href={`/dashboard/shops/${s.id}`} className="group flex items-center gap-3 rounded-2xl border border-gray-100 p-3.5 transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-gray-800 dark:hover:bg-gray-800">
                <Img src={s.hero} alt="" fallback="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{s.name}</div>
                  <div className="text-[11px] text-gray-400">{s.products.length} produits · {formatFCFA(s.stats?.revenue || 0)}</div>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-xs text-gray-400 transition group-hover:bg-white group-hover:text-orange-500 group-hover:shadow dark:bg-gray-800">→</span>
              </Link>
            ))}
            <Link href="/dashboard/shops" className="block rounded-2xl border-2 border-dashed border-gray-200 py-3 text-center text-xs font-bold text-gray-400 transition hover:border-gray-400 hover:text-gray-600 dark:border-gray-700">
              + Toutes mes boutiques
            </Link>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      {myShops.length > 0 && (
        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-display text-lg font-semibold">Accès rapides</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [`/dashboard/shops/${myShops[0].id}/products`, '📦', 'Ajouter un produit', 'Nouveau produit en stock'],
              [`/dashboard/shops/${myShops[0].id}/products/import`, '⚡', 'Importer la démo', 'Produits du thème'],
              [`/dashboard/shops/${myShops[0].id}/settings`, '💳', 'Moyens de paiement', 'OM · MTN · Wave'],
              [`/dashboard/shops/${myShops[0].id}/settings`, '🚚', 'Zones de livraison', 'Abidjan & intérieur'],
            ].map(([href, icon, title, sub]) => (
              <Link key={title} href={href} className="card-premium rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                <span className="text-xl">{icon}</span>
                <div className="mt-2 text-sm font-bold">{title}</div>
                <div className="text-[11px] text-gray-400">{sub}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}