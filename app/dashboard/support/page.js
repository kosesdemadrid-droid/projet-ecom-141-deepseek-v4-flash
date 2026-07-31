'use client';

import { useState } from 'react';
import { Btn, useToast } from '@/components/ui';

export default function SupportPage() {
  const toast = useToast();
  const [form, setForm] = useState({ subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const faqs = [
    ['Comment changer le thème de ma boutique ?', 'Rendez-vous dans Paramètres → Général, ou créez une nouvelle boutique depuis l\'assistant.'],
    ['Comment activer Orange Money ?', 'Paramètres → Paiements de votre boutique : activez Orange Money, MTN MoMo ou Wave en un clic.'],
    ['Puis-je importer les produits de démonstration ?', 'Oui, dans Produits cliquez sur « Importer les produits du thème » : 20-30 produits avec images et prix en FCFA.'],
    ['Comment connecter mon domaine ?', 'Paramètres → Domaine : ajoutez votre domaine et un enregistrement CNAME vers laboutique.ci.'],
    ['Où sont les messages de contact ?', 'Onglet Messages de votre boutique : les demandes du formulaire de contact y arrivent en temps réel.'],
  ];
  const [open, setOpen] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      setDone(true);
      toast('Votre demande a bien été envoyée. Un email de confirmation simulé a été expédié ! ✉️');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Support</h1>
      <p className="mt-1 text-sm text-gray-500">Une question ? Consultez la FAQ ou écrivez-nous, nous répondons sous 24h.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-bold">Questions fréquentes</h2>
          <div className="space-y-2.5">
            {faqs.map(([q, a], i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
                <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold">
                  {q}
                  <span className={`transition-transform ${open === i ? 'rotate-45' : ''}`}>＋</span>
                </button>
                {open === i && <p className="fade-in border-t border-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800">{a}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 font-bold">Écrire au support</h2>
            {done ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="text-3xl">✅</div>
                <p className="mt-2 text-sm font-bold text-emerald-700">Demande envoyée !</p>
                <p className="mt-1 text-xs text-emerald-600">Notre équipe vous répondra à votre adresse email.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Sujet</span>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-800">
                    <option value="">Choisir un sujet…</option>
                    <option>Création de boutique</option>
                    <option>Paiements (Orange Money / MTN / Wave)</option>
                    <option>Livraison</option>
                    <option>Facturation</option>
                    <option>Autre</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Message</span>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required placeholder="Décrivez votre problème…" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-800" />
                </label>
                <Btn type="submit" loading={busy} className="w-full bg-gray-900 py-3 text-white hover:bg-gray-800">Envoyer ma demande</Btn>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}