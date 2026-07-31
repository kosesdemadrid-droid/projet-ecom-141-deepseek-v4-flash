'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from './ShopContext';
import { ShareButtons } from '../ui';
import { formatFCFA } from '@/lib/money';

const STATUS_LABEL = {
  awaiting_payment: 'En attente de paiement',
  paid: 'Payée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function ConfirmationPage({ order, shop }) {
  const { t } = useShop();
  const params = useSearchParams();
  const isCod = params.get('cod') === '1';
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${shop.slug}/tracking/${order.id}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="fade-up">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-500/10">✅</div>
        <h1 className="mt-5 text-3xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>
          {t('orderConfirmed')} !
        </h1>
        <p className="mt-2 text-gray-500">
          {t('orderReceived')} {isCod ? t('cod').toLowerCase() : t('paySuccess').toLowerCase()}
        </p>
        <div className="mx-auto mt-6 inline-block rounded-2xl bg-gray-50 px-8 py-5 dark:bg-gray-800">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('orderNumber')}</div>
          <div className="mt-1 text-2xl font-black tracking-wide">{order.ref}</div>
          <div className="mt-1 text-sm font-bold text-p">{formatFCFA(order.total)}</div>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Un email de confirmation vient d'être envoyé{order.customer?.email ? ` à ${order.customer.email}` : ''} ✉️ (simulation)
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/s/${shop.slug}/tracking/${order.id}`} className="rounded-xl bg-p px-7 py-3.5 text-sm font-black text-white shadow-brand transition hover-bright">
            📦 {t('trackOrder')}
          </Link>
          <Link href={`/s/${shop.slug}/products`} className="rounded-xl border-2 border-gray-200 px-7 py-3.5 text-sm font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
            {t('continueShopping')}
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <ShareButtons title={`Ma commande ${order.ref} chez ${shop.name}`} url={shareUrl} />
        </div>
      </div>
    </main>
  );
}