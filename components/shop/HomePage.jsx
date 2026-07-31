'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useShop } from './ShopContext';
import { Img, Stars } from '../ui';
import ProductCard from './ProductCard';
import { formatFCFA } from '@/lib/money';

export default function HomePage({ products }) {
  const { shop, t } = useShop();
  const layout = shop.layout || 'banner';
  const [cat, setCat] = useState('all');

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const featured = products.sort((a, b) => b.sold - a.sold).slice(0, 8);
  const arrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  const byCat = cat === 'all' ? featured : products.filter((p) => p.category === cat).slice(0, 8);
  const top = [...products].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)).slice(0, 3);

  const heroCta = (
    <a href={`/s/${shop.slug}/products`} className="rounded-xl bg-p px-7 py-3.5 text-sm font-bold text-white shadow-brand transition hover-bright">
      {t('shopNow')} →
    </a>
  );

  return (
    <main>
      {/* HÉROS — 3 variantes selon le thème */}
      {layout === 'split' && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="fade-up">
            <span className="rounded-full bg-soft px-3.5 py-1.5 text-xs font-bold text-p">✦ {t('featured')}</span>
            <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl" style={{ color: 'var(--p2)' }}>
              {shop.tagline || shop.name}
            </h1>
            <p className="mt-4 max-w-md text-gray-500">
              {t('ourProducts')} — {products.length} {t('productCount')} · {formatFCFA(Math.max(...products.map((p) => p.price)))} max.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">{heroCta}<a href={`/s/${shop.slug}/about`} className="rounded-xl border-2 border-gray-900/10 px-7 py-3.5 text-sm font-bold text-gray-700 transition hover:border-gray-900/30 dark:border-white/20 dark:text-gray-200">{t('about')}</a></div>
            <div className="mt-8 flex gap-6 border-t border-gray-200 pt-6 text-xs font-semibold text-gray-400 dark:border-gray-800">
              <span>🚚 {t('shipping')} 24-48h</span>
              <span>💳 OM · MTN · Wave</span>
              <span>⭐ 4,8/5</span>
            </div>
          </div>
          <div className="relative fade-up">
            <Img src={shop.hero} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-2xl sm:block">
              <div className="text-xs font-bold text-gray-400">{t('bestSellers')}</div>
              <div className="mt-1 text-lg font-black" style={{ color: 'var(--p)' }}>{formatFCFA(Math.max(...products.map((p) => p.price)))}</div>
              <Stars value={4.8} size={12} />
            </div>
          </div>
        </section>
      )}

      {layout === 'center' && (
        <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-soft/40" />
          <div className="relative mx-auto max-w-3xl fade-up">
            <span className="text-5xl">✨</span>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl" style={{ color: 'var(--p2)' }}>
              {shop.tagline || shop.name}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-gray-500">
              {t('ourProducts')} — {products.length} {t('productCount')} · {formatFCFA(Math.max(...products.map((p) => p.price)))} max.
            </p>
            <div className="mt-8 flex justify-center gap-3">{heroCta}<a href={`/s/${shop.slug}/products`} className="rounded-xl border-2 border-gray-900/10 px-7 py-3.5 text-sm font-bold text-gray-700 dark:border-white/20 dark:text-gray-200">{t('products')}</a></div>
          </div>
          <div className="relative mx-auto mt-14 max-w-5xl grid grid-cols-3 gap-4">
            {top.slice(0, 3).map((p, i) => (
              <Link key={p.id} href={`/s/${shop.slug}/product/${p.id}`} className={`fade-up overflow-hidden rounded-2xl shadow-2xl ${i === 1 ? '-translate-y-6' : ''}`}>
                <Img src={p.images?.[0]} alt="" className="aspect-[4/5] w-full object-cover" />
                <div className="bg-white p-3 text-left dark:bg-gray-900">
                  <div className="line-clamp-1 text-xs font-bold">{p.name}</div>
                  <div className="text-sm font-black text-p">{formatFCFA(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {layout === 'banner' && (
        <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden text-center">
          <Img src={shop.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-2xl px-4 py-24 text-white fade-up">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur">✦ {shop.slogan || t('featured')}</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl drop-shadow">{shop.tagline || shop.name}</h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/80">{t('ourProducts')} · {products.length} {t('productCount')}</p>
            <div className="mt-8 flex justify-center gap-3">{heroCta}<a href={`/s/${shop.slug}/about`} className="rounded-xl border-2 border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">{t('about')}</a></div>
          </div>
        </section>
      )}

      {/* Catégories */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {['all', ...categories].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${cat === c ? 'bg-p text-white shadow-brand' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
              {c === 'all' ? t('allCategories') : c}
            </button>
          ))}
        </div>
      </div>

      {/* Produits */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-p">{cat === 'all' ? t('featured') : cat}</span>
            <h2 className="font-display mt-1.5 text-3xl font-semibold tracking-tight" style={{ color: 'var(--p2)' }}>{cat === 'all' ? t('featured') : cat}</h2>
          </div>
          <a href={`/s/${shop.slug}/products`} className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-900 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300">{t('viewAll')} →</a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {byCat.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Bandeau promo 2 colonnes */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grad-p relative overflow-hidden rounded-3xl p-9 text-white shadow-brand">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/75">{t('newArrivals')}</span>
            <h3 className="font-display mt-2 text-3xl font-semibold leading-tight">-25% sur les nouveautés</h3>
            <a href={`/s/${shop.slug}/products?sort=new`} className="btn-premium mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-black text-gray-900">{t('shopNow')} →</a>
          </div>
          <div className="panel-dark relative overflow-hidden rounded-3xl p-9 text-white">
            <div className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-44 rounded-full bg-orange-500/20 blur-2xl" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{t('delivery')}</span>
            <h3 className="font-display mt-2 text-3xl font-semibold leading-tight">Livraison offerte à Abidjan</h3>
            <p className="mt-2 text-sm text-gray-400">dès 50 000 FCFA d'achat</p>
            <a href={`/s/${shop.slug}/products`} className="btn-premium mt-6 inline-block rounded-xl border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10">{t('shopNow')} →</a>
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-p">{t('newArrivals')}</span>
            <h2 className="font-display mt-1.5 text-3xl font-semibold tracking-tight" style={{ color: 'var(--p2)' }}>{t('newArrivals')}</h2>
          </div>
          <a href={`/s/${shop.slug}/products?sort=new`} className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-900 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300">{t('viewAll')} →</a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {arrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Bandeau confiance */}
      <section className="border-y border-gray-100 bg-white py-10 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6">
          {[
            ['💳', 'Paiement Mobile Money', 'Orange Money · MTN · Wave'],
            ['🚚', 'Livraison rapide', 'Abidjan 24-48h, tout le pays'],
            ['🔄', 'Retours 7 jours', 'Échange ou remboursement'],
            ['🎧', 'Support client', '7j/7 par WhatsApp'],
          ].map(([i, t2, d]) => (
            <div key={t2} className="group">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-2xl transition group-hover:scale-110 dark:bg-gray-800">{i}</div>
              <div className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-100">{t2}</div>
              <div className="text-xs text-gray-400">{d}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}