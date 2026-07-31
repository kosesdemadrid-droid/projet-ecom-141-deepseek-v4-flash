'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Img, EmptyState, Btn, useToast } from '@/components/ui';
import { formatFCFA, discountPct } from '@/lib/money';
import ShopTabs from './ShopTabs';

export default function ProductsManager({ shop }) {
  const router = useRouter();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const cats = useMemo(() => [...new Set(shop.products.map((p) => p.category))], [shop.products]);
  const [cat, setCat] = useState('all');

  const filtered = shop.products
    .filter((p) => (cat === 'all' || p.category === cat))
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => setPage(1), [q, cat]);

  const remove = async (id, name) => {
    if (!confirm(`Supprimer « ${name} » ?`)) return;
    const res = await fetch(`/api/shops/${shop.id}/products/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Produit supprimé.'); router.refresh(); }
  };

  const importTheme = async () => {
    const res = await fetch(`/api/shops/${shop.id}/products/import`, { method: 'POST' });
    const j = await res.json();
    toast(`${j.count} produits de démonstration importés ! 🎉`);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{shop.name}</h1>
          <p className="text-sm text-gray-500">Gérez vos produits, stocks et variantes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={importTheme} className="rounded-xl border-2 border-dashed border-orange-300 px-4 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-50 dark:border-orange-500/40">
            ⚡ Importer les produits du thème
          </button>
          <Link href={`/dashboard/shops/${shop.id}/products/new`} className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800">
            + Ajouter un produit
          </Link>
        </div>
      </div>

      <ShopTabs shopId={shop.id} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
          </span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit…" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none dark:border-gray-700 dark:bg-gray-900">
          <option value="all">Toutes les catégories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Aucun produit"
          text="Ajoutez votre premier produit ou importez la collection de démonstration du thème."
          action={
            <div className="flex gap-3">
              <Link href={`/dashboard/shops/${shop.id}/products/new`} className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white">+ Ajouter</Link>
              <button onClick={importTheme} className="rounded-xl border-2 border-orange-200 px-5 py-2.5 text-sm font-bold text-orange-600">⚡ Importer la démo</button>
            </div>
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="hidden grid-cols-12 gap-3 border-b border-gray-100 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 md:grid dark:border-gray-800">
              <span className="col-span-5">Produit</span>
              <span className="col-span-2">Prix</span>
              <span className="col-span-2">Stock</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {slice.map((p) => (
                <div key={p.id} className="grid grid-cols-2 gap-3 px-5 py-3.5 md:grid-cols-12 md:items-center">
                  <div className="col-span-2 flex items-center gap-3 md:col-span-5">
                    <Img src={p.images?.[0]} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <Link href={`/dashboard/shops/${shop.id}/products/edit/${p.id}`} className="block truncate text-sm font-bold hover:text-orange-600">{p.name}</Link>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{p.category}</span>
                        {p.reviews?.length > 0 && <span>⭐ {p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length.toFixed(1)}</span>}
                        {p.variants?.length > 0 && <span>· {p.variants.length} variantes</span>}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm font-black">{formatFCFA(p.price)}</div>
                    {discountPct(p) > 0 && <div className="text-[10px] font-bold text-red-500">-{discountPct(p)}%</div>}
                  </div>
                  <div className="md:col-span-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${p.stock <= 5 ? 'bg-red-50 text-red-600 dark:bg-red-500/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10'}`}>
                      {p.stock <= 0 ? 'Rupture' : `${p.stock} en stock`}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2 md:col-span-3">
                    <a href={`/s/${shop.slug}/product/${p.id}`} target="_blank" rel="noreferrer" title="Voir sur la boutique" className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 transition hover:border-gray-400">↗</a>
                    <Link href={`/dashboard/shops/${shop.id}/products/edit/${p.id}`} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">Modifier</Link>
                    <button onClick={() => remove(p.id, p.name)} className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {pages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold disabled:opacity-40 dark:border-gray-700">←</button>
              <span className="text-sm font-bold text-gray-500">{page} / {pages}</span>
              <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold disabled:opacity-40 dark:border-gray-700">→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}