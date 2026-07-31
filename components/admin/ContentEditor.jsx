'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn, ImagePicker, useToast } from '@/components/ui';

export default function ContentEditor({ landing }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(JSON.parse(JSON.stringify(landing)));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landing: form }),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast('Contenu du site mis à jour ✓');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500';
  const label = 'mb-1.5 block text-sm font-semibold';

  const setItem = (arr, i, key, val) => {
    const next = JSON.parse(JSON.stringify(form));
    next[arr][i][key] = val;
    setForm(next);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black tracking-tight">Contenu du site vitrine</h1>
      <p className="mt-1 text-sm text-gray-500">Modifiez le hero, les fonctionnalités, les témoignages et la FAQ de la page d'accueil.</p>

      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Hero (première section)</h3>
          <label className="block">
            <span className={label}>Titre</span>
            <input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className={input} />
          </label>
          <label className="mt-4 block">
            <span className={label}>Sous-titre</span>
            <textarea value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} rows={3} className={input} />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Fonctionnalités ({form.features?.length || 0})</h3>
          <div className="space-y-4">
            {(form.features || []).map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4">
                <div className="flex gap-2">
                  <input value={f.icon} onChange={(e) => setItem('features', i, 'icon', e.target.value)} className={`${input} w-20 text-center`} />
                  <input value={f.title} onChange={(e) => setItem('features', i, 'title', e.target.value)} placeholder="Titre" className={input} />
                  <button onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600">🗑</button>
                </div>
                <textarea value={f.text} onChange={(e) => setItem('features', i, 'text', e.target.value)} rows={2} placeholder="Description" className={`${input} mt-2`} />
              </div>
            ))}
          </div>
          <button onClick={() => setForm({ ...form, features: [...(form.features || []), { icon: 'star', title: 'Nouvelle fonctionnalité', text: 'Description…' }] })} className="mt-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:border-gray-400">
            + Ajouter
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Témoignages ({form.testimonials?.length || 0})</h3>
          <div className="space-y-4">
            {(form.testimonials || []).map((t, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4">
                <div className="flex gap-2">
                  <input value={t.name} onChange={(e) => setItem('testimonials', i, 'name', e.target.value)} placeholder="Nom" className={input} />
                  <input value={t.role} onChange={(e) => setItem('testimonials', i, 'role', e.target.value)} placeholder="Rôle" className={input} />
                  <button onClick={() => setForm({ ...form, testimonials: form.testimonials.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600">🗑</button>
                </div>
                <textarea value={t.text} onChange={(e) => setItem('testimonials', i, 'text', e.target.value)} rows={2} placeholder="Témoignage" className={`${input} mt-2`} />
                <div className="mt-2">
                  <span className={`${label} block`}>Photo</span>
                  <ImagePicker value={t.avatar} onChange={(avatar) => setItem('testimonials', i, 'avatar', avatar)} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setForm({ ...form, testimonials: [...(form.testimonials || []), { name: 'Client', role: 'Boutique à Abidjan', text: '…', avatar: '' }] })} className="mt-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:border-gray-400">
            + Ajouter
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">FAQ ({form.faq?.length || 0})</h3>
          <div className="space-y-3">
            {(form.faq || []).map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4">
                <div className="flex gap-2">
                  <input value={f.q} onChange={(e) => setItem('faq', i, 'q', e.target.value)} placeholder="Question" className={input} />
                  <button onClick={() => setForm({ ...form, faq: form.faq.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600">🗑</button>
                </div>
                <textarea value={f.a} onChange={(e) => setItem('faq', i, 'a', e.target.value)} rows={2} placeholder="Réponse" className={`${input} mt-2`} />
              </div>
            ))}
          </div>
          <button onClick={() => setForm({ ...form, faq: [...(form.faq || []), { q: 'Nouvelle question ?', a: 'Réponse…' }] })} className="mt-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:border-gray-400">
            + Ajouter
          </button>
        </div>

        <Btn onClick={save} loading={busy} className="w-full bg-violet-600 py-3.5 text-white hover:bg-violet-500">Enregistrer les modifications</Btn>
      </div>
    </div>
  );
}