'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImagePicker, Btn, useToast } from '@/components/ui';

export default function ThemeEditor({ theme, shopCount }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: theme.name,
    tagline: theme.tagline,
    sector: theme.sector,
    colors: { ...theme.colors },
    font: theme.font,
    hero: theme.hero,
    layouts: [...(theme.layouts || [])],
    categories: theme.categories?.map((c) => ({ ...c })) || [],
    featured: !!theme.featured,
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/themes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: theme.id, ...form }),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast('Thème mis à jour ✓');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500';
  const label = 'mb-1.5 block text-sm font-semibold';

  const toggleLayout = (k) => {
    setForm({
      ...form,
      layouts: form.layouts.includes(k) ? form.layouts.filter((x) => x !== k) : [...form.layouts, k],
    });
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/themes" className="text-sm font-semibold text-gray-500 hover:text-gray-900">← Retour aux thèmes</Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">Modifier · {theme.name}</h1>
        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">{shopCount} boutique(s) l'utilisent</span>
      </div>

      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Identité</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Nom</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            </label>
            <label className="block">
              <span className={label}>Secteur</span>
              <input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} className={input} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>Slogan</span>
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={input} />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Palette & typographie</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['p', 'p2', 'p3', 'bg'].map((k) => (
              <div key={k}>
                <span className="mb-1 block text-[10px] font-bold uppercase text-gray-400">{k}</span>
                <input type="color" value={form.colors[k]} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className="h-10 w-full cursor-pointer rounded-lg border" />
              </div>
            ))}
          </div>
          <label className="mt-4 block">
            <span className={label}>Police</span>
            <select value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} className={input}>
              {['Inter', 'Poppins', 'Playfair Display', 'Space Grotesk', 'Lora', 'DM Serif Display', 'Baloo 2', 'Cormorant Garamond', 'Barlow Condensed', 'Fraunces'].map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
          <div className="mt-4">
            <span className={`${label} block`}>Mises en page disponibles</span>
            <div className="flex flex-wrap gap-2">
              {[['banner', 'Bannière large'], ['split', 'Image / Texte'], ['center', 'Centré minimal']].map(([k, l]) => (
                <button key={k} type="button" onClick={() => toggleLayout(k)} className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${form.layouts.includes(k) ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-400'}`}>
                  {form.layouts.includes(k) ? '✓ ' : ''}{l}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <span className={`${label} block`}>Bannière</span>
            <ImagePicker value={form.hero} onChange={(hero) => setForm({ ...form, hero })} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Catégories du thème</h3>
          <div className="space-y-3">
            {form.categories.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={c.name} onChange={(e) => { const cats = [...form.categories]; cats[i] = { ...c, name: e.target.value }; setForm({ ...form, categories: cats }); }} className={`${input} flex-1`} />
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500">{c.key}</span>
                <button onClick={() => setForm({ ...form, categories: form.categories.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600">🗑</button>
              </div>
            ))}
          </div>
          <button onClick={() => setForm({ ...form, categories: [...form.categories, { name: '', key: 'new' }] })} className="mt-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:border-gray-400">
            + Ajouter une catégorie
          </button>
        </div>

        <Btn onClick={save} loading={busy} className="w-full bg-violet-600 py-3.5 text-white hover:bg-violet-500">Enregistrer le thème</Btn>
      </div>
    </div>
  );
}