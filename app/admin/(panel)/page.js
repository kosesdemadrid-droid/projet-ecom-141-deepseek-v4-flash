import { db } from '@/lib/store';
import { formatFCFA, formatFCFACompact } from '@/lib/money';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const data = await db();
  const revenue = data.shops.reduce((s, x) => s + (x.stats?.revenue || 0), 0);
  const orders = data.shops.reduce((s, x) => s + x.orders.length, 0);
  const products = data.shops.reduce((s, x) => s + x.products.length, 0);
  const visits = data.shops.reduce((s, x) => s + (x.stats?.visits || 0), 0);
  const clients = data.users.filter((u) => u.role === 'client').length;
  const openTickets = data.tickets.filter((t) => t.status === 'open');

  const cards = [
    { label: 'Clients', value: clients, icon: '👥', to: '/admin/clients', color: 'from-violet-500 to-purple-600' },
    { label: 'Boutiques actives', value: data.shops.length, icon: '🏬', to: '/admin/shops', color: 'from-orange-500 to-amber-600' },
    { label: 'Produits en ligne', value: products, icon: '📦', to: '/admin/shops', color: 'from-blue-500 to-indigo-600' },
    { label: 'Commandes', value: orders, icon: '🛒', to: '/admin/shops', color: 'from-emerald-500 to-green-600' },
    { label: 'Revenu total', value: formatFCFACompact(revenue), icon: '💰', to: '/admin/shops', color: 'from-fuchsia-500 to-pink-600' },
    { label: 'Visites', value: visits, icon: '👀', to: '/admin/shops', color: 'from-cyan-500 to-sky-600' },
  ];

  const recent = data.shops
    .flatMap((s) => s.orders.map((o) => ({ ...o, shopName: s.name, shopId: s.id })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
  const top = [...data.shops].sort((a, b) => (b.stats?.revenue || 0) - (a.stats?.revenue || 0)).slice(0, 5);
  const maxRev = Math.max(...top.map((s) => s.stats?.revenue || 0), 1);

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Vue d'ensemble</h1>
      <p className="mt-1 text-sm text-gray-500">Statistiques globales de la plateforme LaBoutique.ci.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.to} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-base text-white ${c.color}`}>{c.icon}</div>
            <div className="mt-2.5 text-lg font-black">{c.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold">Top boutiques par chiffre d'affaires</h2>
          </div>
          <div className="space-y-4 p-5">
            {top.map((s, i) => (
              <div key={s.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-bold">#{i + 1} {s.name}</span>
                  <span className="font-black text-violet-600">{formatFCFA(s.stats?.revenue || 0)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${((s.stats?.revenue || 0) / maxRev) * 100}%` }} />
                </div>
                <div className="mt-0.5 text-[10px] font-semibold text-gray-400">{s.orders.length} commandes · {s.stats?.visits || 0} visites</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold">Dernières commandes (toutes boutiques)</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-xs">{o.items.length}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{o.ref}</div>
                  <div className="text-xs text-gray-400">{o.shopName} · {o.customer?.name}</div>
                </div>
                <span className="text-sm font-black">{formatFCFA(o.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openTickets.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
          <h2 className="font-bold text-amber-800">🎫 {openTickets.length} demande(s) de support en attente</h2>
          <div className="mt-3 space-y-2">
            {openTickets.slice(0, 4).map((t) => (
              <div key={t.id} className="rounded-xl bg-white px-4 py-2.5 text-sm">
                <span className="font-bold">{t.name}</span> — {t.subject}
                <span className="ml-2 text-xs text-gray-400">{new Date(t.createdAt).toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}