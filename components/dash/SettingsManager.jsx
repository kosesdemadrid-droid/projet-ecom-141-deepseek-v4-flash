'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn, ImagePicker, Toggle, useToast } from '@/components/ui';
import { LAYOUT_VARIANTS } from '@/lib/seed-data';
import ShopTabs from './ShopTabs';

const TABS = [
  ['general', '🎨 Général'],
  ['payments', '💳 Paiements'],
  ['delivery', '🚚 Livraison'],
  ['pages', '📄 Pages'],
  ['domain', '🌐 Domaine'],
  ['social', '📣 Social & contact'],
];

export default function SettingsManager({ shop, theme }) {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState('general');
  const [form, setForm] = useState({
    name: shop.name,
    tagline: shop.tagline || '',
    slug: shop.slug,
    logo: shop.logo || null,
    colors: { ...(shop.colors || theme?.colors || {}) },
    font: shop.font || theme?.font || 'Inter',
    layout: shop.layout || 'banner',
    hero: shop.hero || theme?.hero || '',
    lang: shop.lang || 'fr',
    payments: { orange: true, mtn: true, wave: true, cod: true, ...(shop.payments || {}) },
    delivery: shop.delivery || { zones: [{ name: 'Abidjan', fee: 1500 }, { name: 'Intérieur du pays', fee: 3000 }], pickup: true, freeOver: 50000 },
    pages: shop.pages || { about: [''], terms: [''] },
    customDomain: shop.customDomain || '',
    social: shop.social || { whatsapp: '', facebook: '', twitter: '' },
    contacts: shop.contacts || { email: '', address: '' },
  });
  const [busy, setBusy] = useState(false);

  const save = async (msg) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast(msg || 'Paramètres enregistrés ✓');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900';
  const label = 'mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300';

  const paymentInfo = {
    orange: { icon: '🟠', name: 'Orange Money', desc: 'Paiement via portefeuille Orange Money CI', hint: 'Numéro : 07 XX XX XX XX' },
    mtn: { icon: '🟡', name: 'MTN Mobile Money', desc: 'Paiement via portefeuille MTN MoMo CI', hint: 'Numéro : 05 XX XX XX XX' },
    wave: { icon: '🔵', name: 'Wave', desc: 'Paiement via Wave Côte d\'Ivoire', hint: 'Numéro : 07 XX XX XX XX' },
    cod: { icon: '💵', name: 'Paiement à la livraison', desc: 'Espèces remises au livreur', hint: 'Risque de refus à gérer' },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{shop.name}</h1>
        <p className="text-sm text-gray-500">Personnalisez votre boutique et vos moyens de paiement.</p>
      </div>
      <ShopTabs shopId={shop.id} />

      <div className="flex flex-wrap gap-2">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${tab === k ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-3xl">
        {tab === 'general' && (
          <div className="fade-in space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Identité</h3>
              <label className="block">
                <span className={label}>Nom de la boutique</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
              </label>
              <label className="mt-4 block">
                <span className={label}>Slogan</span>
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={input} />
              </label>
              <div className="mt-4">
                <span className={label}>Logo</span>
                <ImagePicker value={form.logo} onChange={(logo) => setForm({ ...form, logo })} />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Couleurs & style</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {['p', 'p2', 'p3', 'bg'].map((k) => (
                  <div key={k}>
                    <span className={`${label} text-[10px]`}>{k === 'p' ? 'Principale' : k === 'p2' ? 'Secondaire' : k === 'p3' ? 'Accent' : 'Fond'}</span>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.colors[k] || '#000000'} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700" />
                      <input value={form.colors[k] || ''} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className={`${input} px-2 py-2 text-xs`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className={label}>Police</span>
                  <select value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} className={input}>
                    {['Inter', 'Poppins', 'Playfair Display', 'Space Grotesk', 'Lora', 'DM Serif Display', 'Baloo 2', 'Cormorant Garamond', 'Barlow Condensed', 'Fraunces'].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={label}>Mise en page d'accueil</span>
                  <select value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })} className={input}>
                    {Object.entries(LAYOUT_VARIANTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={label}>Langue par défaut</span>
                  <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })} className={input}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <span className={label}>Bannière principale</span>
                <ImagePicker value={form.hero} onChange={(hero) => setForm({ ...form, hero })} />
              </div>
            </div>
            <Btn onClick={() => save()} loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}

        {tab === 'payments' && (
          <div className="fade-in space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-1 font-bold">Moyens de paiement</h3>
              <p className="mb-5 text-sm text-gray-500">Activez les moyens acceptés par vos clients. Le tunnel de commande n'affiche que les moyens activés.</p>
              <div className="space-y-3">
                {Object.entries(paymentInfo).map(([k, p]) => (
                  <div key={k} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-xl dark:bg-gray-800">{p.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.desc}</div>
                      </div>
                    </div>
                    <Toggle checked={form.payments[k]} onChange={(v) => setForm({ ...form, payments: { ...form.payments, [k]: v } })} />
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10">
                ℹ️ Les paiements sont simulés en démo : l'acheteur entre son numéro, reçoit un code fictif (1234) et la commande est confirmée.
              </div>
            </div>
            <Btn onClick={() => save('Moyens de paiement mis à jour ✓')} loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}

        {tab === 'delivery' && (
          <div className="fade-in space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Zones de livraison</h3>
              <div className="space-y-3">
                {form.delivery.zones.map((z, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input value={z.name} onChange={(e) => { const zones = [...form.delivery.zones]; zones[i] = { ...z, name: e.target.value }; setForm({ ...form, delivery: { ...form.delivery, zones } }); }} placeholder="Zone" className={input} />
                    <div className="relative">
                      <input type="number" value={z.fee} onChange={(e) => { const zones = [...form.delivery.zones]; zones[i] = { ...z, fee: Number(e.target.value) }; setForm({ ...form, delivery: { ...form.delivery, zones } }); }} className={`${input} w-32 pr-14`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">FCFA</span>
                    </div>
                    <button onClick={() => setForm({ ...form, delivery: { ...form.delivery, zones: form.delivery.zones.filter((_, j) => j !== i) } })} className="rounded-lg p-2 text-red-400 hover:bg-red-50">🗑</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setForm({ ...form, delivery: { ...form.delivery, zones: [...form.delivery.zones, { name: '', fee: 0 }] } })} className="mt-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 transition hover:border-gray-400 dark:border-gray-700">
                + Ajouter une zone
              </button>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800">
                <div>
                  <div className="text-sm font-bold">Retrait en magasin</div>
                  <div className="text-xs text-gray-400">Le client peut venir retirer sa commande (gratuit).</div>
                </div>
                <Toggle checked={form.delivery.pickup} onChange={(v) => setForm({ ...form, delivery: { ...form.delivery, pickup: v } })} />
              </div>
              <div className="mt-4">
                <span className={label}>Livraison offerte dès (FCFA) — 0 pour désactiver</span>
                <input type="number" value={form.delivery.freeOver} onChange={(e) => setForm({ ...form, delivery: { ...form.delivery, freeOver: Number(e.target.value) } })} className={`${input} w-40`} />
              </div>
            </div>
            <Btn onClick={() => save('Livraison mise à jour ✓')} loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}

        {tab === 'pages' && (
          <div className="fade-in space-y-5">
            {[['about', 'Page « À propos »'], ['terms', 'Page « CGV »']].map(([k, title]) => (
              <div key={k} className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 font-bold">{title}</h3>
                <textarea
                  value={(form.pages[k] || []).join('\n\n')}
                  onChange={(e) => setForm({ ...form, pages: { ...form.pages, [k]: e.target.value.split(/\n{2,}/).filter((x) => x.trim()) } })}
                  rows={7}
                  className={input}
                />
                <p className="mt-1 text-xs text-gray-400">Séparez les paragraphes par une ligne vide.</p>
              </div>
            ))}
            <Btn onClick={() => save('Pages mises à jour ✓')} loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}

        {tab === 'domain' && (
          <div className="fade-in">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-1 font-bold">Nom de domaine personnalisé</h3>
              <p className="mb-5 text-sm text-gray-500">
                Votre boutique est accessible sur <strong>laboutique.ci/{form.slug}</strong>. Branchez votre propre domaine pour la servir sur votre marque.
              </p>
              <label className="block">
                <span className={label}>Votre domaine</span>
                <input value={form.customDomain} onChange={(e) => setForm({ ...form, customDomain: e.target.value })} placeholder="ex : maboutique.ci" className={input} />
              </label>
              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-500 dark:bg-gray-800">
                <strong className="text-gray-700 dark:text-gray-200">Comment ça marche :</strong>
                <br />1. Achetez un domaine chez un registrar (ex : .ci, .shop).
                <br />2. Créez un enregistrement CNAME pointant vers <strong>laboutique.ci</strong>.
                <br />3. Renseignez-le ici : votre boutique sera servie sur ce domaine (déploiement en production).
              </div>
            </div>
            <Btn onClick={() => save('Domaine mis à jour ✓')} loading={busy} className="mt-5 bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}

        {tab === 'social' && (
          <div className="fade-in space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Réseaux & contact</h3>
              {[['whatsapp', 'WhatsApp (numéro avec indicatif)', '+225 07 00 00 00 00'], ['facebook', 'Facebook (URL de la page)', 'https://facebook.com/maBoutique'], ['twitter', 'X / Twitter (URL du profil)', 'https://x.com/maBoutique']].map(([k, l, ph]) => (
                <label key={k} className="mt-3 block">
                  <span className={label}>{l}</span>
                  <input value={form.social[k]} onChange={(e) => setForm({ ...form, social: { ...form.social, [k]: e.target.value } })} placeholder={ph} className={input} />
                </label>
              ))}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>Email de contact</span>
                  <input value={form.contacts.email} onChange={(e) => setForm({ ...form, contacts: { ...form.contacts, email: e.target.value } })} placeholder="contact@maboutique.ci" className={input} />
                </label>
                <label className="block">
                  <span className={label}>Adresse</span>
                  <input value={form.contacts.address} onChange={(e) => setForm({ ...form, contacts: { ...form.contacts, address: e.target.value } })} placeholder="Cocody, Abidjan" className={input} />
                </label>
              </div>
            </div>
            <Btn onClick={() => save('Réseaux mis à jour ✓')} loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          </div>
        )}
      </div>
    </div>
  );
}