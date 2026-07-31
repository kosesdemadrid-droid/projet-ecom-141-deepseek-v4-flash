'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Img } from '../ui';
import { formatFCFA } from '@/lib/money';

export function ShopCard({ shop }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const remove = async () => {
    if (!confirm(`Supprimer définitivement « ${shop.name} » ? Cette action est irréversible.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/shops/${shop.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Erreur lors de la suppression.');
      setDeleting(false);
    }
  };
  return (
    <div className="card-premium group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-40 overflow-hidden">
        <Img src={shop.logo || shop.hero} alt={shop.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-gray-700 backdrop-blur">{shop.themeName}</span>
        {shop.unread > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
            ✉️ {shop.unread} message{shop.unread > 1 ? 's' : ''}
          </span>
        )}
        <div className="absolute bottom-3 left-4">
          <h3 className="font-display text-lg font-semibold text-white drop-shadow">{shop.name}</h3>
          <a href={`/s/${shop.slug}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white/75 transition hover:text-white">
            la boutique.ci/{shop.slug} ↗
          </a>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 dark:divide-gray-800 dark:border-gray-800">
        {[
          [shop.productCount, 'produits'],
          [shop.orders, 'commandes'],
          [formatFCFA(shop.revenue), 'CA'],
        ].map(([v, l]) => (
          <div key={l} className="px-4 py-3 text-center">
            <div className="truncate text-sm font-black">{v}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3">
        <Link href={`/dashboard/shops/${shop.id}`} className="btn-premium flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-center text-xs font-black text-white transition hover:bg-gray-800">
          Gérer
        </Link>
        <a href={`/s/${shop.slug}`} target="_blank" rel="noreferrer" title="Voir la boutique" className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
          ↗
        </a>
        <button onClick={remove} disabled={deleting} title="Supprimer" className="rounded-xl border border-red-100 px-3.5 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:hover:bg-red-500/10">
          🗑
        </button>
      </div>
    </div>
  );
}