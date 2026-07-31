'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShop } from './ShopContext';
import { formatFCFA } from '@/lib/money';

const FLOW = [
  ['awaiting_payment', 'En attente de paiement', '📲'],
  ['paid', 'Paiement confirmé', '💳'],
  ['processing', 'En préparation', '📦'],
  ['shipped', 'Expédiée', '🚚'],
  ['delivered', 'Livrée', '🏠'],
];

const STATUS_LABEL = { awaiting_payment: 'En attente de paiement', paid: 'Payée', processing: 'En préparation', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' };

export default function TrackingPage({ orders }) {
  const { shop, t } = useShop();
  const params = useParams();
  const [input, setInput] = useState(params.id ? decodeURIComponent(params.id) : '');
  const [order, setOrder] = useState(() => {
    const byId = orders.find((o) => o.id === params.id);
    if (byId) return byId;
    return orders.find((o) => o.ref === input) || null;
  });
  const [notFound, setNotFound] = useState(false);

  const search = (e) => {
    e.preventDefault();
    const found = orders.find((o) => o.id === input || o.ref.toLowerCase() === input.toLowerCase());
    setOrder(found || null);
    setNotFound(!found);
  };

  const stepIdx = order ? FLOW.findIndex(([s]) => s === order.status) : -1;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>📦 {t('orderTracking')}</h1>
      <form onSubmit={search} className="mt-5 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Référence (ex : CMD-123456-789) ou n° de commande" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900" />
        <button className="shrink-0 rounded-xl bg-p px-6 py-3 text-sm font-bold text-white transition hover-bright">{t('trackOrder')}</button>
      </form>

      {notFound && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10">
          Aucune commande trouvée. Vérifiez la référence.
        </div>
      )}

      {order && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400">{t('orderNumber')}</div>
              <div className="text-lg font-black">{order.ref}</div>
            </div>
            <span className="rounded-full bg-soft px-3.5 py-1.5 text-xs font-black text-p">{STATUS_LABEL[order.status] || order.status}</span>
          </div>

          <div className="px-6 py-8">
            <div className="flex">
              {FLOW.map(([s, label, icon], i) => {
                const done = i <= stepIdx;
                const cancelled = order.status === 'cancelled';
                return (
                  <div key={s} className="relative flex-1">
                    {i > 0 && (
                      <div className={`absolute left-0 top-5 h-1 w-full ${i <= stepIdx && !cancelled ? 'bg-p' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ left: '-50%' }} />
                    )}
                    <div className="relative flex flex-col items-center text-center">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition ${cancelled ? 'bg-red-100' : done ? 'bg-p text-white shadow-brand' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                        {icon}
                      </span>
                      <span className={`mt-2 hidden text-[10px] font-bold sm:block ${done && !cancelled ? 'text-p' : 'text-gray-400'}`}>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {order.status === 'cancelled' && (
              <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600 dark:bg-red-500/10">Cette commande a été annulée.</p>
            )}
          </div>

          <div className="grid gap-4 border-t border-gray-100 px-6 py-5 sm:grid-cols-2 dark:border-gray-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Livraison</div>
              <p className="mt-1 text-sm font-semibold">
                {order.deliveryMethod === 'pickup' ? '🏬 Retrait en magasin' : `🚚 ${order.zone || 'Livraison'} — ${order.customer?.city || ''}`}
              </p>
              <p className="text-xs text-gray-400">{order.customer?.name} · {order.customer?.phone}</p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400">{t('total')}</div>
              <p className="mt-1 text-sm font-black text-p">{formatFCFA(order.total)}</p>
              <p className="text-xs text-gray-400">{order.items.length} article(s) · {order.paymentMethod === 'cod' ? '💵 À la livraison' : order.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 px-6 py-5 dark:border-gray-800">
            <div className="space-y-2">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{it.name} <span className="text-gray-400">× {it.quantity}</span></span>
                  <span className="font-bold">{formatFCFA(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <Link href={`/s/${shop.slug}/products`} className="mt-5 inline-block text-sm font-bold text-p hover:underline">← {t('continueShopping')}</Link>
          </div>
        </div>
      )}
    </main>
  );
}