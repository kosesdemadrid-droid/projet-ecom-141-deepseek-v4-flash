'use client';

import Link from 'next/link';
import { useShop } from './ShopContext';
import { Img } from '../ui';
import { formatFCFA } from '@/lib/money';

export default function CartPage() {
  const { shop, t, cart, cartTotal, updateQty, removeItem } = useShop();
  const freeOver = shop.delivery?.freeOver || 0;
  const remaining = freeOver - cartTotal;
  const progress = Math.min(100, (cartTotal / freeOver) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('cart')}</h1>
      {freeOver > 0 && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
            {remaining > 0 ? (
              <span>Plus que <span className="text-p">{formatFCFA(remaining)}</span> pour la {t('shipping')} {t('free')} 🎉</span>
            ) : (
              <span className="text-emerald-600">🎉 Vous bénéficiez de la livraison offerte !</span>
            )}
            <span className="text-xs text-gray-400">{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-p transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-14 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-5xl">🛒</div>
          <h2 className="mt-3 text-lg font-bold">{t('emptyCart')}</h2>
          <Link href={`/s/${shop.slug}/products`} className="mt-4 inline-block rounded-xl bg-p px-7 py-3 text-sm font-bold text-white shadow-brand transition hover-bright">
            {t('emptyCartCta')}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((i) => (
              <div key={i.key} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <Link href={`/s/${shop.slug}/product/${i.id}`}>
                  <Img src={i.image} alt="" className="h-24 w-20 rounded-xl object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/s/${shop.slug}/product/${i.id}`} className="text-sm font-bold hover:text-p">{i.name}</Link>
                      {i.variant && <div className="mt-0.5 text-xs text-gray-400">{i.variant}</div>}
                    </div>
                    <button onClick={() => removeItem(i.key)} className="text-xs text-gray-400 transition hover:text-red-500">{t('remove')} ✕</button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700">
                      <button onClick={() => updateQty(i.key, i.qty - 1)} className="px-3 py-1.5 text-gray-500">−</button>
                      <span className="w-8 text-center text-sm font-black">{i.qty}</span>
                      <button onClick={() => updateQty(i.key, i.qty + 1)} className="px-3 py-1.5 text-gray-500">+</button>
                    </div>
                    <span className="text-base font-black text-p">{formatFCFA(i.price * i.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
            <Link href={`/s/${shop.slug}/products`} className="inline-block text-sm font-bold text-p hover:underline">← {t('continueShopping')}</Link>
          </div>

          <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 lg:sticky lg:top-24 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 font-bold">{t('orderSummary')}</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>{t('subtotal')}</span><span className="font-bold text-gray-900 dark:text-gray-100">{formatFCFA(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>{t('shipping')}</span><span className="font-bold text-emerald-600">{t('deliveryZone')} → étape suivante</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black dark:border-gray-800">
                <span>{t('total')}</span><span>{formatFCFA(cartTotal)}</span>
              </div>
            </div>
            <Link href={`/s/${shop.slug}/checkout`} className="mt-5 block rounded-xl bg-p py-4 text-center text-sm font-black text-white shadow-brand transition hover-bright">
              {t('checkout')} →
            </Link>
            <p className="mt-3 text-center text-[11px] text-gray-400">💳 Orange Money · MTN MoMo · Wave · 💵 {t('cod')}</p>
          </div>
        </div>
      )}
    </main>
  );
}