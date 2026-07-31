'use client';

import { useState } from 'react';
import { useShop } from './ShopContext';
import { Btn, ShareButtons } from '../ui';

export default function ContactPage() {
  const { shop, t, toast } = useShop();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return toast('Nom et message requis.', 'error');
    setBusy(true);
    try {
      const res = await fetch(`/api/s/${shop.slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast(t('messageSent'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900';

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('contact')}</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={`${t('fullName')} *`} className={input} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder={t('newsletterPlaceholder')} className={input} />
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t('details')} className={input} />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder={`${t('yourReview')} *`} className={input} />
          <Btn type="submit" loading={busy} className="w-full bg-p py-3.5 font-black text-white shadow-brand hover-bright">{t('submit')}</Btn>
        </form>
        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-bold">{shop.name}</h3>
            <div className="mt-3 space-y-2.5 text-sm text-gray-500">
              <p>📍 {shop.contacts?.address || 'Abidjan, Côte d\'Ivoire'}</p>
              <p>✉️ {shop.contacts?.email || 'contact@' + shop.slug + '.ci'}</p>
              {shop.social?.whatsapp && <p>💬 WhatsApp : {shop.social.whatsapp}</p>}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <ShareButtons title={shop.name} url={`https://laboutique.ci/s/${shop.slug}`} />
            </div>
          </div>
          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="font-bold">🕐 Horaires</h3>
            <div className="mt-3 space-y-1.5 text-sm text-gray-300">
              <p>Lun - Ven : 8h - 19h</p>
              <p>Samedi : 9h - 18h</p>
              <p>Dimanche : fermé</p>
            </div>
            <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-xs text-gray-300">⚡ Réponse garantie sous 24h</p>
          </div>
        </div>
      </div>
    </main>
  );
}