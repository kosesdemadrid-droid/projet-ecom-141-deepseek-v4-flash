'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn, ImagePicker, Spinner, useToast } from '@/components/ui';
import { LAYOUT_VARIANTS } from '@/lib/seed-data';

const STEPS = ['Choisir un thème', 'Personnaliser', 'Ajouter des produits'];

export default function ShopWizard() {
  const router = useRouter();
  const toast = useToast();
  const [themes, setThemes] = useState([]);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    themeKey: '',
    name: '',
    tagline: '',
    slug: '',
    logo: null,
    colors: { p: '#ea580c', p2: '#9a3412', p3: '#fbbf24', bg: '#fff7ed' },
    font: 'Inter',
    layout: 'banner',
    hero: '',
    lang: 'fr',
    importMode: 'theme',
  });
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    fetch('/api/themes').then((r) => r.json()).then((j) => setThemes(j.themes || []));
  }, []);

  const theme = themes.find((t) => t.key === form.themeKey);

  const pickTheme = (t) => {
    setForm((f) => ({
      ...f,
      themeKey: t.key,
      colors: { ...t.colors },
      font: t.font,
      layout: t.layouts?.[0] || 'banner',
      hero: t.hero,
      name: f.name || t.sector,
    }));
  };

  const palettes = [
    ['#ea580c', '#9a3412', '#fbbf24'],
    ['#2563eb', '#1e3a8a', '#06b6d4'],
    ['#db2777', '#9d174d', '#c2410c'],
    ['#059669', '#064e3b', '#f97316'],
    ['#7c3aed', '#4c1d95', '#d97706'],
    ['#b45309', '#78350f', '#65a30d'],
  ];

  const create = async () => {
    if (!form.name.trim()) return toast('Donnez un nom à votre boutique.', 'error');
    setBusy(true);
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: form.name.trim(), tagline: form.tagline.trim(), slug: form.slug.trim() }),
      });
      const j = await res.json();
      if (!res.ok) return toast(j.error, 'error');
      let shop = j.shop;
      if (form.importMode === 'theme') {
        const imp = await fetch(`/api/shops/${shop.id}/products/import`, { method: 'POST' }).then((r) => r.json());
        toast(`${imp.count} produits de démonstration importés ! 🎉`);
      } else {
        toast('Boutique créée ! Ajoutez vos produits. ✨');
      }
      router.push(`/dashboard/shops/${shop.id}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const colorInput = (k) => (
    <div key={k}>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-400">{k === 'p' ? 'Couleur principale' : k === 'p2' ? 'Couleur secondaire' : k === 'p3' ? 'Accent' : 'Fond'}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={form.colors[k]} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className="h-9 w-12 cursor-pointer rounded-lg border border-gray-200" />
        <input value={form.colors[k]} onChange={(e) => setForm({ ...form, colors: { ...form.colors, [k]: e.target.value } })} className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400" />
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Créer une nouvelle boutique</h1>
        <div className="mt-5 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={s} className="flex items-center gap-2">
                <button onClick={() => n < step && setStep(n)} className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition ${active ? 'bg-gray-900 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? '✓' : n}
                  </span>
                  <span className={`hidden text-sm font-bold sm:block ${active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                </button>
                {n < 3 && <span className={`h-px w-8 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ÉTAPE 1 — Thème */}
      {step === 1 && (
        <div className="fade-in">
          <div className="mb-5 flex flex-wrap gap-2">
            <button onClick={() => toast('Astuce : chaque thème apporte sa palette, sa police et ses images.')} className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-700">💡 Chaque thème = palette + police + visuels uniques</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => pickTheme(t)}
                className={`group overflow-hidden rounded-2xl border-2 text-left transition hover:-translate-y-0.5 ${form.themeKey === t.key ? 'border-gray-900 ring-4 ring-gray-900/10' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}
              >
                <div className="relative h-32 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.hero} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {form.themeKey === t.key && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
                  )}
                  <span className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] font-bold text-white">
                    <span className="flex gap-1">
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50" style={{ background: t.colors.p }} />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50" style={{ background: t.colors.p2 }} />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50" style={{ background: t.colors.p3 }} />
                    </span>
                    {t.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {themes.length === 0 && <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-gray-300" /></div>}
          <div className="mt-8 flex justify-end">
            <Btn onClick={() => setStep(2)} disabled={!form.themeKey} className="bg-gray-900 px-8 text-white hover:bg-gray-800">
              Continuer →
            </Btn>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Personnalisation */}
      {step === 2 && theme && (
        <div className="fade-in grid gap-6 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Identité de la boutique</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nom de la boutique *</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex : Boutique d'Awa" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Slogan</span>
                  <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Ex : L'élégance à l'ivoirienne" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse (slug)</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 dark:border-gray-700">
                  <span className="text-sm text-gray-400">laboutique.ci/</span>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="maboutique" className="w-full bg-transparent py-3 text-sm outline-none" />
                </div>
                <p className="mt-1 text-xs text-gray-400">Laissez vide pour un slug automatique.</p>
              </label>
              <div className="mt-4">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Logo</span>
                <ImagePicker value={form.logo} onChange={(logo) => setForm({ ...form, logo })} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Couleurs du thème {theme.name}</h3>
                <button onClick={() => setCustom(!custom)} className="text-xs font-bold text-orange-600 hover:underline">{custom ? 'Palette du thème' : 'Personnaliser'}</button>
              </div>
              {!custom ? (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {palettes.map(([p, p2, p3]) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, colors: { ...form.colors, p, p2, p3 } })}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition ${form.colors.p === p ? 'border-gray-900' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <span className="flex gap-1">
                        <span className="h-5 w-5 rounded-full" style={{ background: p }} />
                        <span className="h-5 w-5 rounded-full" style={{ background: p2 }} />
                        <span className="h-5 w-5 rounded-full" style={{ background: p3 }} />
                      </span>
                      <span className="h-1.5 w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${p}, ${p3})` }} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{['p', 'p2', 'p3', 'bg'].map(colorInput)}</div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-bold">Style & mise en page</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {Object.entries(LAYOUT_VARIANTS).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setForm({ ...form, layout: k })}
                    className={`rounded-xl border-2 p-3.5 text-left transition ${form.layout === k ? 'border-gray-900 bg-gray-50 dark:bg-gray-800' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}
                  >
                    <div className={`mb-2 h-16 overflow-hidden rounded-lg border ${k === 'banner' ? 'bg-gradient-to-br from-gray-800 to-gray-600' : k === 'split' ? 'bg-gradient-to-r from-gray-800 to-white' : 'bg-gray-100'}`}>
                      <div className="flex h-full items-center justify-center gap-1.5">
                        {k === 'split' ? (
                          <>
                            <span className="h-10 w-8 rounded bg-white/20" />
                            <span className="h-10 w-8 rounded bg-white/70" />
                          </>
                        ) : k === 'banner' ? (
                          <span className="h-3 w-12 rounded-full bg-white/60" />
                        ) : (
                          <span className="h-10 w-10 rounded-full bg-white/70" />
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-bold">{v.label}</div>
                    <div className="mt-0.5 text-[11px] text-gray-400">{v.hint}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Police du thème</span>
                  <select value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-800">
                    {['Inter', 'Poppins', 'Playfair Display', 'Space Grotesk', 'Lora', 'DM Serif Display', 'Baloo 2', 'Cormorant Garamond', 'Barlow Condensed', 'Fraunces'].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Langue par défaut</span>
                  <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-800">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Bannière principale</span>
                <ImagePicker value={form.hero} onChange={(hero) => setForm({ ...form, hero })} />
              </div>
            </div>
          </div>

          {/* Aperçu en direct */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 truncate text-[10px] font-semibold text-gray-400">aperçu · la boutique.ci/{form.slug || 'votre-slug'}</span>
              </div>
              <div style={{ background: form.colors.bg }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,.08)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {form.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: form.colors.p }}>{form.name.slice(0, 1).toUpperCase() || 'B'}</span>
                      )}
                      <span className="text-sm font-black" style={{ color: form.colors.p2 }}>{form.name || 'Ma Boutique'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold" style={{ color: form.colors.p2 }}>
                      <span>Accueil</span><span>Boutique</span>
                      <span className="flex items-center gap-1 rounded-full px-2 py-1 text-white" style={{ background: form.colors.p }}>🛒 0</span>
                    </div>
                  </div>
                </div>
                {form.layout === 'split' ? (
                  <div className="grid grid-cols-2">
                    <div className="h-40" style={{ background: form.colors.p }}>
                      <div className="flex h-full items-center justify-center text-white"><span className="text-2xl">🏬</span></div>
                    </div>
                    <div className="flex flex-col justify-center gap-2 px-5 py-4">
                      <span className="text-sm font-black" style={{ color: form.colors.p2 }}>{form.tagline || 'Votre slogan ici'}</span>
                      <span className="rounded-lg px-3 py-1.5 text-center text-[10px] font-bold text-white" style={{ background: form.colors.p }}>Découvrir</span>
                    </div>
                  </div>
                ) : form.layout === 'center' ? (
                  <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
                    <span className="text-xl font-black" style={{ color: form.colors.p2 }}>{form.tagline || 'Votre slogan ici'}</span>
                    <span className="rounded-lg px-4 py-2 text-[10px] font-bold text-white" style={{ background: form.colors.p }}>Découvrir nos produits</span>
                  </div>
                ) : (
                  <div className="relative flex h-40 items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative text-center text-white">
                      <div className="text-base font-black drop-shadow">{form.tagline || 'Votre slogan ici'}</div>
                      <span className="mt-2 inline-block rounded-lg px-4 py-1.5 text-[10px] font-bold text-white" style={{ background: form.colors.p }}>Découvrir</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 p-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="overflow-hidden rounded-xl bg-white p-2 shadow-sm">
                      <div className="h-14 rounded-lg bg-gray-200" />
                      <div className="mt-2 h-2 w-3/4 rounded bg-gray-300" />
                      <div className="mt-1.5 h-2 w-1/2 rounded" style={{ background: form.colors.p }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between lg:col-span-5">
            <Btn onClick={() => setStep(1)} className="border border-gray-300 text-gray-600 hover:bg-gray-50">← Retour</Btn>
            <Btn onClick={() => setStep(3)} className="bg-gray-900 px-8 text-white hover:bg-gray-800">Continuer →</Btn>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Produits */}
      {step === 3 && (
        <div className="fade-in mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-black">Ajouter des produits</h3>
            <p className="mt-1 text-sm text-gray-500">Gagnez du temps : importez les produits de démonstration du thème {theme?.name}, ou démarrez avec une boutique vide.</p>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => setForm({ ...form, importMode: 'theme' })}
                className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${form.importMode === 'theme' ? 'border-gray-900 bg-gray-50 dark:bg-gray-800' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}
              >
                <span className="text-3xl">⚡</span>
                <div className="flex-1">
                  <div className="font-bold">Importer les produits de démonstration</div>
                  <div className="mt-1 text-sm text-gray-500">20 à 30 produits réalistes du thème {theme?.name}, avec images Unsplash, prix en FCFA, variantes et avis. Modifiables ensuite.</div>
                </div>
                <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${form.importMode === 'theme' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>✓</span>
              </button>
              <button
                onClick={() => setForm({ ...form, importMode: 'none' })}
                className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${form.importMode === 'none' ? 'border-gray-900 bg-gray-50 dark:bg-gray-800' : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'}`}
              >
                <span className="text-3xl">📦</span>
                <div className="flex-1">
                  <div className="font-bold">Boutique vide</div>
                  <div className="mt-1 text-sm text-gray-500">Je commencerai de zéro et ajouterai mes propres produits depuis le dashboard.</div>
                </div>
                <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${form.importMode === 'none' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>✓</span>
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Btn onClick={() => setStep(2)} className="border border-gray-300 text-gray-600 hover:bg-gray-50">← Retour</Btn>
            <Btn onClick={create} loading={busy} className="bg-gray-900 px-10 py-3 text-white hover:bg-gray-800">
              🚀 Créer ma boutique
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}