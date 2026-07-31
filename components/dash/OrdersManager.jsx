'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Img, EmptyState, useToast } from '@/components/ui';
import { formatFCFA, formatFCFACompact } from '@/lib/money';
import ShopTabs from './ShopTabs';

const STATUSES = [
  ['awaiting_payment', 'En attente de paiement', 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'],
  ['paid', 'Payée', 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'],
  ['processing', 'En préparation', 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'],
  ['shipped', 'Expédiée', 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400'],
  ['delivered', 'Livrée', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'],
  ['cancelled', 'Annulée', 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'],
];

const PAYMENT_LABEL = { orange: 'Orange Money', mtn: 'MTN MoMo', wave: 'Wave', cod: 'À la livraison' };

export default function OrdersManager({ shop }) {
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const orders = useMemo(() => [...(shop.orders || [])].reverse(), [shop.orders]);
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const revenue = orders.filter((o) => !['cancelled', 'awaiting_payment'].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === 'awaiting_payment').length;

  const setStatus = async (o, status) => {
    const res = await fetch(`/api/shops/${shop.id}/orders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: o.id, status }),
    });
    if (res.ok) { toast('Statut mis à jour ✓'); router.refresh(); }
  };

  const exportCsv = () => {
    const head = ['Référence', 'Date', 'Client', 'Téléphone', 'Ville', 'Articles', 'Sous-total', 'Livraison', 'Total', 'Paiement', 'Statut'];
    const rows = orders.map((o) => [
      o.ref,
      new Date(o.createdAt).toLocaleString('fr-FR'),
      o.customer?.name, o.customer?.phone, o.customer?.city,
      o.items.map((i) => `${i.name} x${i.quantity}`).join(' | '),
      o.subtotal, o.shippingFee, o.total, PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod,
      STATUSES.find((s) => s[0] === o.status)?.[1] || o.status,
    ]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `commandes-${shop.slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast('Export CSV téléchargé 📄');
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{shop.name}</h1>
          <p className="text-sm text-gray-500">{orders.length} commandes · {formatFCFACompact(revenue)} de CA · {pending} en attente</p>
        </div>
        <button onClick={exportCsv} disabled={orders.length === 0} className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 disabled:opacity-50">
          📄 Exporter en CSV
        </button>
      </div>

      <ShopTabs shopId={shop.id} />

      <div className="mb-5 flex flex-wrap gap-2">
        {[['all', `Toutes (${orders.length})`], ...STATUSES.map(([k, l]) => [k, l])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === k ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800'}`}>
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🛒" title="Aucune commande" text="Les commandes de vos clients apparaîtront ici avec le tunnel de paiement mobile money." />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const st = STATUSES.find((s) => s[0] === o.status) || STATUSES[0];
            const isOpen = open === o.id;
            return (
              <div key={o.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${st[2]}`}>{st[1]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">{o.ref}</div>
                    <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString('fr-FR')} · {o.customer?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black">{formatFCFA(o.total)}</div>
                    <div className="text-[10px] font-semibold text-gray-400">{PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod}</div>
                  </div>
                  <span className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {isOpen && (
                  <div className="fade-in border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400">Client</h4>
                        <p className="mt-1.5 text-sm font-bold">{o.customer?.name}</p>
                        <p className="text-xs text-gray-500">📞 {o.customer?.phone}</p>
                        <p className="text-xs text-gray-500">📍 {o.customer?.address}, {o.customer?.city}</p>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400">Livraison & paiement</h4>
                        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300">
                          {o.deliveryMethod === 'pickup' ? '🏬 Retrait en magasin' : `🚚 ${o.zone || 'Livraison'} — ${formatFCFA(o.shippingFee)}`}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">💳 {PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod}</p>
                        <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none dark:border-gray-700 dark:bg-gray-900">
                          {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400">Articles</h4>
                        <div className="mt-1.5 space-y-2">
                          {o.items.map((it, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Img src={it.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-bold">{it.name}</div>
                                <div className="text-[10px] text-gray-400">x{it.quantity}</div>
                              </div>
                              <span className="text-xs font-bold">{formatFCFA(it.price * it.quantity)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-gray-100 pt-2 text-xs font-black dark:border-gray-800">
                            <span>Total</span><span>{formatFCFA(o.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}