'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from './ShopContext';
import { Img, Btn } from '../ui';
import { formatFCFA } from '@/lib/money';

const METHODS = {
  orange: { name: 'Orange Money', icon: '🟠', color: '#ff7900', note: 'Paiement via votre portefeuille Orange Money Côte d\'Ivoire' },
  mtn: { name: 'MTN Mobile Money', icon: '🟡', color: '#ffcc00', note: 'Paiement via votre portefeuille MTN MoMo Côte d\'Ivoire' },
  wave: { name: 'Wave', icon: '🔵', color: '#1dc4ff', note: 'Paiement via votre compte Wave Côte d\'Ivoire' },
  cod: { name: 'Paiement à la livraison', icon: '💵', color: '#10b981', note: 'Vous payez en espèces à la réception du colis' },
};

export default function CheckoutPage() {
  const { shop, t, cart, cartTotal, clearCart, toast } = useShop();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', address: '' });
  const [method, setMethod] = useState('delivery');
  const [zone, setZone] = useState(shop.delivery?.zones?.[0]?.name || '');
  const [pay, setPay] = useState(Object.keys(shop.payments || {}).find((k) => shop.payments[k]) || 'cod');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const shippingFee = useMemo(() => {
    if (method === 'pickup') return 0;
    const z = shop.delivery?.zones?.find((x) => x.name === zone);
    if (!z) return 0;
    const freeOver = shop.delivery?.freeOver || 0;
    return freeOver > 0 && cartTotal >= freeOver ? 0 : z.fee;
  }, [method, zone, cartTotal, shop.delivery]);

  const total = cartTotal + shippingFee;
  const enabled = Object.entries(shop.payments || {}).filter(([, v]) => v).map(([k]) => k);

  const placeOrder = async (e) => {
    e.preventDefault();
    setErr('');
    if (cart.length === 0) return setErr('Votre panier est vide.');
    if (!form.name.trim() || !form.phone.trim()) return setErr('Nom et téléphone sont requis.');
    setBusy(true);
    try {
      const res = await fetch(`/api/s/${shop.slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ id: i.id, qty: i.qty, variant: i.variant })),
          customer: form,
          zone,
          deliveryMethod: method,
          paymentMethod: pay,
          subtotal: cartTotal,
        }),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      clearCart();
      if (pay === 'cod') {
        router.push(`/s/${shop.slug}/confirmation/${j.order.id}?cod=1`);
      } else {
        router.push(`/s/${shop.slug}/checkout/payment?order=${j.order.id}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900';

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('checkout')}</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        <form onSubmit={placeOrder} className="space-y-6 lg:col-span-3">
          {/* Coordonnées */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-p text-[11px] font-black text-white">1</span> {t('contactInfo')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={`${t('fullName')} *`} className={input} />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={`${t('phone')} * (ex : 07 XX XX XX XX)`} className={input} />
            </div>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder={t('newsletterPlaceholder')} className={`${input} mt-4`} />
          </div>

          {/* Livraison */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-p text-[11px] font-black text-white">2</span> {t('delivery')}</h2>
            <div className="space-y-3">
              {shop.delivery?.pickup && (
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${method === 'pickup' ? 'border-p bg-soft' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}>
                  <input type="radio" name="m" checked={method === 'pickup'} onChange={() => setMethod('pickup')} className="accent-orange-600" />
                  <span className="text-xl">🏬</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{t('pickup')}</div>
                    <div className="text-xs text-gray-400">Gratuit — {shop.contacts?.address || 'Abidjan'}</div>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{t('free')}</span>
                </label>
              )}
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${method === 'delivery' ? 'border-p bg-soft' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}>
                <input type="radio" name="m" checked={method === 'delivery'} onChange={() => setMethod('delivery')} className="accent-orange-600" />
                <span className="text-xl">🚚</span>
                <div className="flex-1">
                  <div className="text-sm font-bold">{t('delivery')}</div>
                  <div className="text-xs text-gray-400">Zones configurées par {shop.name}</div>
                </div>
              </label>
            </div>
            {method === 'delivery' && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <select value={zone} onChange={(e) => setZone(e.target.value)} className={input}>
                  {(shop.delivery?.zones || []).map((z) => (
                    <option key={z.name} value={z.name}>{z.name} — {z.fee === 0 ? t('free') : formatFCFA(z.fee)}</option>
                  ))}
                </select>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder={t('city')} className={input} />
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t('address')} className={`${input} sm:col-span-2`} />
              </div>
            )}
          </div>

          {/* Paiement */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-p text-[11px] font-black text-white">3</span> {t('payment')}</h2>
            <div className="space-y-3">
              {enabled.map((k) => (
                <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${pay === k ? 'border-p bg-soft' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}>
                  <input type="radio" name="p" checked={pay === k} onChange={() => setPay(k)} className="accent-orange-600" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: `${METHODS[k].color}22` }}>{METHODS[k].icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{METHODS[k].name}</div>
                    <div className="text-xs text-gray-400">{METHODS[k].note}</div>
                  </div>
                  {k !== 'cod' && <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ background: METHODS[k].color }}>CI</span>}
                </label>
              ))}
            </div>
          </div>

          {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10">{err}</p>}
          <Btn type="submit" loading={busy} className="w-full bg-p py-4 text-base font-black text-white shadow-brand hover-bright">
            {pay === 'cod' ? `${t('orderNow')} — ${formatFCFA(total)}` : `${t('makePayment')} — ${formatFCFA(total)}`}
          </Btn>
          <p className="text-center text-xs text-gray-400">🔒 Paiement 100% sécurisé · Simulation de démonstration</p>
        </form>

        {/* Récapitulatif */}
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 lg:sticky lg:top-24 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 font-bold">{t('orderSummary')}</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {cart.map((i) => (
              <div key={i.key} className="flex items-center gap-3">
                <Img src={i.image} alt="" className="h-14 w-11 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-xs font-bold">{i.name}</div>
                  {i.variant && <div className="text-[10px] text-gray-400">{i.variant}</div>}
                  <div className="text-[10px] text-gray-400">x{i.qty}</div>
                </div>
                <span className="text-xs font-black">{formatFCFA(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
            <div className="flex justify-between text-gray-500"><span>{t('subtotal')}</span><span>{formatFCFA(cartTotal)}</span></div>
            <div className="flex justify-between text-gray-500">
              <span>{t('shipping')}</span>
              <span className={shippingFee === 0 ? 'font-bold text-emerald-600' : 'font-bold'}>{shippingFee === 0 ? t('free') : formatFCFA(shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black dark:border-gray-800">
              <span>{t('total')}</span><span className="text-p">{formatFCFA(total)}</span>
            </div>
          </div>
          <Link href={`/s/${shop.slug}/cart`} className="mt-4 block text-center text-xs font-bold text-gray-400 hover:text-p">← {t('cart')}</Link>
        </div>
      </div>
    </main>
  );
}