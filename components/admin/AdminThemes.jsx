'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Img, Modal, ImagePicker, Btn, useToast } from '@/components/ui';

export default function AdminThemes({ themes, usage }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', tagline: '', sector: '', key: '', colors: { p: '#ea580c', p2: '#9a3412', p3: '#fbbf24', bg: '#ffffff' }, font: 'Inter', hero: '', layouts: ['banner', 'split', 'center'], featured: true });

  const remove = async (t) => {
    if (!confirm(`Supprimer le thème « ${t.name} » ?`)) return;
    const res = await fetch('/api/admin/themes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: t.id }),
    });
    const j = await res.json();
    if (!res.ok) return toast(j.error, 'error');
    toast('Thème supprimé.');
    router.refresh();
  };

  const create = async () => {
    if (!form.name.trim()) return toast('Nom requis.', 'error');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      toast('Thème créé ✓');
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Thèmes premium</h1>
          <p className="mt-1 text-sm text-gray-500">{themes.length} thèmes — la configuration est stockée en base de données.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-500">
          + Nouveau thème
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {themes.map((t) => (
          <div key={t.id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
            <div className="relative h-36">
              <Img src={t.hero} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-4 w-4 rounded-full border border-white/60" style={{ background: t.colors.p }} />
                  <span className="h-4 w-4 rounded-full border border-white/60" style={{ background: t.colors.p2 }} />
                  <span className="h-4 w-4 rounded-full border border-white/60" style={{ background: t.colors.p3 }} />
                </span>
                <span className="text-sm font-black text-white drop-shadow">{t.name}</span>
              </div>
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-700">{t.sector}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="text-xs text-gray-400">
                <div>📦 {usage[t.key] || 0} boutique(s)</div>
                <div>Font : {t.font} · {t.layouts.length} layouts</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/themes/${t.id}`} className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800">Modifier</Link>
                <button onClick={() => remove(t)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Créer un nouveau thème" wide>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Nom du thème *</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex : Photographie & Objectifs" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Secteur</span>
              <input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Ex : Photographie" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Slogan</span>
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none" />
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['p', 'p2', 'p3', 'bg'].map((k) => (
              <div key={k}>
                <span className="mb-1 block text-[10px] font-bold uppercase text-gray-400">{k === 'p' ? 'Principale' : k === 'p2' ? 'Secondaire' : k === 'p3' ? 'Accent' : 'Fond'}</span>
                <input type="color" value={form.colors[k]} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className="h-10 w-full cursor-pointer rounded-lg border" />
              </div>
            ))}
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-semibold">Image bannière</span>
            <ImagePicker value={form.hero} onChange={(hero) => setForm({ ...form, hero })} />
          </div>
          <Btn onClick={create} loading={busy} className="w-full bg-violet-600 py-3 text-white hover:bg-violet-500">Créer le thème</Btn>
        </div>
      </Modal>
    </div>
  );
}