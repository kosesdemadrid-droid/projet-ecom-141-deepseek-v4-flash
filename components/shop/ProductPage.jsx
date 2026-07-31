'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useShop } from './ShopContext';
import { Img, Stars, ShareButtons } from '../ui';
import ProductCard from './ProductCard';
import { formatFCFA, discountPct } from '@/lib/money';

export default function ProductPage({ product, related, categories }) {
  const { shop, t, addToCart, toast } = useShop();
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewBusy, setReviewBusy] = useState(false);
  const zoomRef = useRef(null);

  const variants = product.variants || [];
  const sizes = variants.filter((v) => v.type === 'Taille');
  const colors = variants.filter((v) => v.type === 'Couleur');
  const images = product.images?.length ? product.images : [shop.hero];
  const out = product.stock <= 0;
  const rating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://laboutique.ci'}/s/${shop.slug}/product/${product.id}`;

  useEffect(() => setImgIdx(0), [product.id]);

  const zoomMove = (e) => {
    if (!zoomRef.current || !zoom) return;
    const r = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return toast('Veuillez remplir tous les champs.', 'error');
    setReviewBusy(true);
    try {
      const res = await fetch(`/api/s/${shop.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, name: reviewForm.name, rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast(t('thankReview'));
      setReviewForm({ name: '', rating: 5, comment: '' });
      setReviewBusy(false);
      window.location.reload();
    } catch { setReviewBusy(false); }
  };

  const breadcrumb = [t('home'), product.category, product.name];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400">
        <Link href={`/s/${shop.slug}`} className="hover:text-p">{breadcrumb[0]}</Link>
        <span>›</span>
        <Link href={`/s/${shop.slug}/products?cat=${encodeURIComponent(product.category)}`} className="hover:text-p">{breadcrumb[1]}</Link>
        <span>›</span>
        <span className="text-gray-600 dark:text-gray-300">{breadcrumb[2]}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galerie */}
        <div>
          <div
            ref={zoomRef}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={zoomMove}
            className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-white dark:border-gray-800"
            style={zoom ? { backgroundImage: `url(${images[imgIdx]})`, backgroundSize: '180%', cursor: 'zoom-in' } : undefined}
          >
            {!zoom && <Img src={images[imgIdx]} alt={product.name} className="h-full w-full object-cover transition duration-700" />}
            {discountPct(product) > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow">
                -{discountPct(product)}%
              </span>
            )}
            {out && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xl font-black uppercase text-white">{t('soldOut')}</span>}
            {zoom && <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white">🔍 {t('details')}</span>}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${imgIdx === i ? 'border-p' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <Img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span className="rounded-full bg-soft px-3 py-1 text-p">{product.category}</span>
            {rating && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-600">
                <Stars value={rating} size={12} /> {rating.toFixed(1)} ({product.reviews.length} {t('reviews')})
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl" style={{ color: 'var(--p2)' }}>{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-p">{formatFCFA(product.price)}</span>
            {product.oldPrice && <span className="text-lg font-semibold text-gray-400 line-through">{formatFCFA(product.oldPrice)}</span>}
            {discountPct(product) > 0 && <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-black text-red-500">Économisez {formatFCFA(product.oldPrice - product.price)}</span>}
          </div>
          <p className="mt-5 leading-relaxed text-gray-500">{product.description}</p>

          {/* Variantes */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">{t('quantity')} — Taille</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((v) => (
                  <button key={v.value} onClick={() => setSelected({ ...selected, Taille: v.value })} className={`min-w-11 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${selected.Taille === v.value ? 'border-p bg-soft text-p' : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300'}`}>
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Couleur</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((v) => (
                  <button key={v.value} onClick={() => setSelected({ ...selected, Couleur: v.value })} className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${selected.Couleur === v.value ? 'border-p bg-soft text-p' : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300'}`}>
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantité + CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-gray-500 hover:text-gray-900">−</button>
              <span className="w-10 text-center text-sm font-black">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-gray-500 hover:text-gray-900">+</button>
            </div>
            <button
              onClick={() => addToCart(product, sizes.length + colors.length > 0 ? Object.values(selected).join(' / ') : null, qty)}
              disabled={out || (sizes.length > 0 && !selected.Taille) || (colors.length > 0 && !selected.Couleur)}
              className="flex-1 rounded-xl bg-p py-4 text-sm font-black text-white shadow-brand transition hover-bright disabled:cursor-not-allowed disabled:opacity-50 min-w-48"
            >
              {out ? t('soldOut') : `${t('addToCart')} · ${formatFCFA(product.price * qty)}`}
            </button>
          </div>
          {sizes.length > 0 && !selected.Taille && <p className="mt-2 text-xs font-semibold text-amber-600">Choisissez une taille pour continuer.</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-5 text-xs font-semibold text-gray-500 dark:border-gray-800">
            <span className="flex items-center gap-1.5">🚚 {t('shipping')} 24-48h Abidjan</span>
            <span className="flex items-center gap-1.5">🔄 Retour 7 jours</span>
            <span className="flex items-center gap-1.5">🛡️ {t('payWith')} OM/MTN/Wave</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <ShareButtons title={`${product.name} — ${shop.name}`} url={shareUrl} />
          </div>
        </div>
      </div>

      {/* Avis */}
      <section className="mt-16 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-5 text-xl font-black" style={{ color: 'var(--p2)' }}>
            {t('reviews')} ({product.reviews?.length || 0})
          </h2>
          <div className="space-y-4">
            {product.reviews?.length === 0 && <p className="text-sm text-gray-400">Aucun avis pour le moment. Soyez le premier !</p>}
            {(product.reviews || []).map((r) => (
              <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-soft text-sm font-black text-p">{r.name.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <div className="text-sm font-bold">{r.name}</div>
                      <div className="text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <Stars value={r.rating} size={13} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xl font-black" style={{ color: 'var(--p2)' }}>{t('writeReview')}</h2>
          <form onSubmit={submitReview} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-500">{t('yourName')}</span>
              <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800" />
            </label>
            <div className="mt-3">
              <span className="mb-1.5 block text-xs font-bold text-gray-500">{t('rating')}</span>
              <Stars value={reviewForm.rating} size={20} onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
            </div>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-bold text-gray-500">{t('yourReview')}</span>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800" />
            </label>
            <button disabled={reviewBusy} className="mt-4 w-full rounded-xl bg-p py-3 text-sm font-bold text-white transition hover-bright disabled:opacity-50">
              {reviewBusy ? '…' : t('submit')}
            </button>
          </form>
        </div>
      </section>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-black" style={{ color: 'var(--p2)' }}>{t('featured')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}