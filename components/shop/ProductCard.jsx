'use client';

import Link from 'next/link';
import { useShop } from './ShopContext';
import { Img, Stars } from '../ui';
import { formatFCFA, discountPct } from '@/lib/money';

export default function ProductCard({ product }) {
  const { shop, t, addToCart } = useShop();
  const rating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;
  const out = product.stock <= 0;
  const disc = discountPct(product);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-200 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      {disc > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2.5 py-1 text-[10px] font-black text-white shadow-lg shadow-red-500/30">
          -{disc}%
        </span>
      )}
      <Link href={`/s/${shop.slug}/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <Img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        {product.images?.[1] && (
          <Img src={product.images[1]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-0 transition group-hover:from-black/30 group-hover:opacity-100" />
        {out && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-black uppercase tracking-wide text-white">
            {t('soldOut')}
          </span>
        )}
        {/* Bouton rapide au survol */}
        {!out && (
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, null, 1); }}
              className="w-full rounded-xl bg-white/95 py-2.5 text-xs font-black text-gray-900 shadow-xl backdrop-blur transition hover:bg-white"
            >
              🛒 {t('addToCart')}
            </button>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-gray-400">
          <span>{product.category}</span>
          {rating && (
            <span className="flex items-center gap-1 text-amber-500">
              <Stars value={rating} size={11} /> {rating.toFixed(1)}
            </span>
          )}
        </div>
        <Link href={`/s/${shop.slug}/product/${product.id}`} className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition group-hover:text-p dark:text-gray-100">
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-black text-gray-900 dark:text-gray-100">{formatFCFA(product.price)}</span>
          {product.oldPrice && <span className="text-xs font-semibold text-gray-400 line-through">{formatFCFA(product.oldPrice)}</span>}
        </div>
        <button
          onClick={() => addToCart(product, null, 1)}
          disabled={out}
          className={`mt-3 w-full rounded-xl py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 lg:hidden ${out ? 'bg-gray-100 text-gray-400' : 'bg-p text-white shadow-brand hover-bright'}`}
        >
          {out ? t('soldOut') : t('addToCart')}
        </button>
      </div>
    </div>
  );
}