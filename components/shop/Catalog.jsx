'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from './ShopContext';
import ProductCard from './ProductCard';
import { EmptyState } from '../ui';

export default function Catalog({ products }) {
  const { t, shop } = useShop();
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get('q') || '');
  const [cat, setCat] = useState(sp.get('cat') || 'all');
  const [inStock, setInStock] = useState(sp.get('stock') === '1');
  const [min, setMin] = useState(sp.get('min') || '');
  const [max, setMax] = useState(sp.get('max') || '');
  const [sort, setSort] = useState(sp.get('sort') || 'featured');
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const priceMax = useMemo(() => Math.max(...products.map((p) => p.price)), [products]);
  const [maxPrice, setMaxPrice] = useState(priceMax);

  useEffect(() => setMaxPrice(priceMax), [priceMax]);

  const updateUrl = (next) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (cat !== 'all') p.set('cat', cat);
    if (inStock) p.set('stock', '1');
    if (min) p.set('min', min);
    if (max) p.set('max', max);
    if (sort !== 'featured') p.set('sort', sort);
    const s = p.toString();
    router.replace(`/s/${shop.slug}/products${s ? `?${s}` : ''}`, { scroll: false });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (inStock) list = list.filter((p) => p.stock > 0);
    if (min) list = list.filter((p) => p.price >= Number(min));
    if (max) list = list.filter((p) => p.price <= Number(max));
    if (maxPrice < priceMax) list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case 'priceAsc': list.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': list.sort((a, b) => b.price - a.price); break;
      case 'new': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'rating': list.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)); break;
      default: list.sort((a, b) => b.sold - a.sold);
    }
    return list;
  }, [products, q, cat, inStock, min, max, maxPrice, priceMax, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [q, cat, inStock, min, max, sort, maxPrice]);

  const chip = 'rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('ourProducts')}</h1>
        <p className="mt-1 text-sm text-gray-400">
          {filtered.length} {t('results')}{q && <> pour « <strong>{q}</strong> »</>}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button onClick={() => setShowFilters(!showFilters)} className="rounded-xl bg-p px-4 py-2 text-xs font-bold text-white shadow-brand">
          {showFilters ? '✕ ' : '☰ '}{t('filter')}
        </button>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPlaceholder')} className="min-w-48 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={chip}>
          <option value="featured">{t('sortBy')} : {t('bestSellers')}</option>
          <option value="new">{t('newArrivals')}</option>
          <option value="priceAsc">{t('price')} ↑</option>
          <option value="priceDesc">{t('price')} ↓</option>
          <option value="rating">{t('reviews')}</option>
        </select>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <aside className="fade-in w-60 shrink-0 space-y-5 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">{t('category')}</h4>
              <div className="space-y-1.5">
                <button onClick={() => { setCat('all'); updateUrl({}); }} className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-bold ${cat === 'all' ? 'bg-soft text-p' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>{t('allCategories')}</button>
                {categories.map((c) => (
                  <button key={c} onClick={() => { setCat(c); }} className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-bold ${cat === c ? 'bg-soft text-p' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">{t('price')} (FCFA)</h4>
              <div className="flex gap-2">
                <input type="number" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-gray-800" />
                <input type="number" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-gray-800" />
              </div>
              <div className="mt-3">
                <input type="range" min={0} max={priceMax} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>0</span><span>{maxPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              {t('inStock')}
            </label>
            <button onClick={() => { setQ(''); setCat('all'); setInStock(false); setMin(''); setMax(''); setMaxPrice(priceMax); setSort('featured'); }} className="w-full rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-500 transition hover:border-gray-400 dark:border-gray-700">
              Réinitialiser
            </button>
          </aside>
        )}

        <div className="flex-1">
          {slice.length === 0 ? (
            <EmptyState icon="🔍" title="Aucun résultat" text="Essayez d'élargir vos filtres ou un autre mot-clé." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {slice.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-gray-700">←</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setPage(n)} className={`h-9 w-9 rounded-xl text-sm font-bold transition ${page === n ? 'bg-p text-white' : 'border border-gray-200 dark:border-gray-700'}`}>{n}</button>
                  ))}
                  <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-gray-700">→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}