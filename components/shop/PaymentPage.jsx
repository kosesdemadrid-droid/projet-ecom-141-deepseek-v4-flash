'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from './ShopContext';
import { Btn } from '../ui';
import { formatFCFA } from '@/lib/money';

const PROVIDERS = {
  orange: { name: 'Orange Money CI', color: '#ff7900', dark: false, phone: '+225 07 XX XX XX XX' },
  mtn: { name: 'MTN Mobile Money CI', color: '#ffcc00', dark: true, phone: '+225 05 XX XX XX XX' },
  wave: { name: 'Wave CI', color: '#1dc4ff', dark: false, phone: '+225 07 XX XX XX XX' },
};

export default function PaymentPage({ order, shop }) {
  const { t, toast } = useShop();
  const params = useSearchParams();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('ask'); // ask → code → success/error
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const provider = PROVIDERS[order.paymentMethod] || PROVIDERS.wave;

  useEffect(() => {
    if (order.status === 'paid') setStep('success');
  }, [order.status]);

  const sendCode = (e) => {
    e.preventDefault();
    if (!phone.trim()) return setErr('Entrez votre numéro de téléphone.');
    setErr('');
    toast('Un code vous a été envoyé par SMS (simulation) 📲');
    setStep('code');
  };

  const confirmPay = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/s/${shop.slug}/orders/${order.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      setStep('success');
      toast(t('paySuccess'));
      window.location.href = `/s/${shop.slug}/confirmation/${order.id}`;
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="p-6 text-white" style={{ background: provider.color, color: provider.dark ? '#1a1a1a' : '#fff' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-xl">{provider.name === 'MTN Mobile Money CI' ? '🟡' : provider.name === 'Wave CI' ? '🔵' : '🟠'}</span>
              <div>
                <div className="text-sm font-black">{provider.name}</div>
                <div className="text-xs opacity-80">{t('securePayment')}</div>
              </div>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black">DÉMO</span>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-2xl bg-gray-50 p-4 text-sm dark:bg-gray-800">
            <div className="flex justify-between font-bold">
              <span>{t('total')}</span>
              <span className="text-p">{formatFCFA(order.total)}</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">{order.ref} · {order.items.length} article(s)</div>
          </div>

          {step === 'ask' && (
            <form onSubmit={sendCode} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">{t('phoneForPayment')} ({provider.phone})</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex : 07 07 07 07 07" className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-lg font-black tracking-widest outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <Btn type="submit" className="w-full py-4 font-black" style={{ background: provider.color, color: provider.dark ? '#1a1a1a' : '#fff' }}>
                Recevoir mon code
              </Btn>
              <p className="text-center text-xs text-gray-400">💡 Un SMS de démonstration avec votre code vous sera « envoyé ».</p>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={confirmPay} className="mt-5 space-y-4">
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">📲 Code de démonstration reçu</div>
                <div className="mt-1 text-2xl font-black tracking-[0.3em] text-emerald-700 dark:text-emerald-400">1 2 3 4</div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Saisissez le code reçu</span>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="••••" inputMode="numeric" className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-lg font-black tracking-[0.5em] outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800" />
              </label>
              {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10">{err}</p>}
              <Btn type="submit" loading={busy} className="w-full py-4 font-black" style={{ background: provider.color, color: provider.dark ? '#1a1a1a' : '#fff' }}>
                {t('confirmPayment')} — {formatFCFA(order.total)}
              </Btn>
              <button type="button" onClick={() => setStep('ask')} className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600">
                ← {t('cancel')}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="mt-5 text-center">
              <div className="text-4xl">✅</div>
              <p className="mt-2 font-black text-emerald-600">{t('paySuccess')}</p>
              <Link href={`/s/${shop.slug}/confirmation/${order.id}`} className="mt-4 block rounded-xl bg-p py-3.5 text-sm font-black text-white shadow-brand transition hover-bright">
                {t('orderConfirmed')} →
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">Paiement simulé à des fins de démonstration — aucune transaction réelle.</p>
    </main>
  );
}