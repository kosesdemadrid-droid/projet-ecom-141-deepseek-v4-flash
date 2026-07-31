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

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
      {discountPct(product) > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black text-white shadow">
          -{discountPct(product)}%
        </span>
      )}
      <Link href={`/s/${shop.slug}/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <Img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        {product.images?.[1] && (
          <Img src={product.images[1]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
        )}
        {out && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-black uppercase tracking-wide text-white">
            {t('soldOut')}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
          <span>{product.category}</span>
          {rating && (
            <span className="flex items-center gap-1 text-amber-500">
              <Stars value={rating} size={11} /> {rating.toFixed(1)}
            </span>
          )}
        </div>
        <Link href={`/s/${shop.slug}/product/${product.id}`} className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition hover:text-p dark:text-gray-100">
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-black text-gray-900 dark:text-gray-100">{formatFCFA(product.price)}</span>
          {product.oldPrice && <span className="text-xs font-semibold text-gray-400 line-through">{formatFCFA(product.oldPrice)}</span>}
        </div>
        <button
          onClick={() => addToCart(product, null, 1)}
          disabled={out}
          className={`mt-3 w-full rounded-xl py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${out ? 'bg-gray-100 text-gray-400' : 'bg-p text-white shadow-brand hover-bright'}`}
        >
          {out ? t('soldOut') : t('addToCart')}
        </button>
      </div>
    </div>
  );
}