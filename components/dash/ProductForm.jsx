'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Btn, ImagePicker, useToast } from '@/components/ui';
import { SIZE_VARIANTS, COLORS } from '@/lib/seed-data';

export default function ProductForm({ shop, product }) {
  const router = useRouter();
  const toast = useToast();
  const cats = ['Général', ...new Set(shop.products.map((p) => p.category))].filter(Boolean);
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    category: product?.category || cats[0] || 'Général',
    stock: product?.stock ?? 10,
    images: product?.images || [],
    variants: product?.variants || [],
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    setErr('');
    if (!form.name.trim()) return setErr('Le nom du produit est requis.');
    if (!form.price || Number(form.price) <= 0) return setErr('Le prix est requis (FCFA).');
    setBusy(true);
    try {
      const url = product
        ? `/api/shops/${shop.id}/products/${product.id}`
        : `/api/shops/${shop.id}/products`;
      const res = await fetch(url, {
        method: product ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          stock: Number(form.stock),
          images: form.images,
          variants: form.variants,
        }),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      toast(product ? 'Produit mis à jour ✓' : 'Produit ajouté ✓');
      router.push(`/dashboard/shops/${shop.id}/products`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const addVariant = (type, value) => {
    if (form.variants.some((v) => v.type === type && v.value === value)) return toast('Variante déjà présente.', 'error');
    setForm({ ...form, variants: [...form.variants, { type, value }] });
  };
  const removeVariant = (i) => setForm({ ...form, variants: form.variants.filter((_, x) => x !== i) });

  const img = (i, v) => setForm({ ...form, images: form.images.map((x, j) => (j === i ? v : x)) });

  return (
    <div>
      <div className="mb-6">
        <Link href={`/dashboard/shops/${shop.id}/products`} className="text-sm font-semibold text-gray-500 hover:text-gray-900">← Retour aux produits</Link>
        <h1 className="mt-1 text-2xl font-black tracking-tight">{product ? 'Modifier le produit' : 'Nouveau produit'} · {shop.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-bold">Informations</h3>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nom du produit *</span>
              <input value={form.name} onChange={set('name')} placeholder="Ex : Baskets running Pro" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</span>
              <textarea value={form.description} onChange={set('description')} rows={4} placeholder="Décrivez votre produit : matières, avantages, conseils d'utilisation…" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
            </label>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-bold">Prix & stock</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Prix (FCFA) *</span>
                <input type="number" value={form.price} onChange={set('price')} placeholder="15000" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Ancien prix (promo)</span>
                <input type="number" value={form.oldPrice} onChange={set('oldPrice')} placeholder="20000" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</span>
                <input type="number" value={form.stock} onChange={set('stock')} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Catégorie</span>
              <input value={form.category} onChange={set('category')} list="cats" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800" />
              <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-1 font-bold">Variantes (taille, couleur…)</h3>
            <p className="mb-4 text-xs text-gray-400">Le client choisit ses variantes sur la fiche produit.</p>
            <div className="flex flex-wrap gap-2">
              {['Taille', 'Couleur'].map((type) => (
                <select key={type} defaultValue="" onChange={(e) => e.target.value && addVariant(type, e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800">
                  <option value="">+ Ajouter : {type}</option>
                  {(type === 'Taille' ? SIZE_VARIANTS : COLORS).map((v) => <option key={v}>{v}</option>)}
                </select>
              ))}
            </div>
            {form.variants.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.variants.map((v, i) => (
                  <span key={i} className="flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {v.type} : {v.value}
                    <button onClick={() => removeVariant(i)} className="text-gray-400 hover:text-red-500">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-bold">Photos ({form.images.length}/5)</h3>
            <div className="space-y-4">
              {form.images.map((src, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                  <ImagePicker value={src} onChange={(v) => img(i, v)} />
                </div>
              ))}
              {form.images.length < 5 && (
                <div className="rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-700">
                  <ImagePicker value={null} onChange={(v) => v && setForm({ ...form, images: [...form.images, v] })} />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-bold">Aperçu</h3>
            {form.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.images[0]} alt="" className="h-40 w-full rounded-xl object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50 text-3xl dark:bg-gray-800">🖼️</div>
            )}
            <div className="mt-3 text-sm font-bold">{form.name || 'Nom du produit'}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-black text-gray-900 dark:text-gray-100">{Number(form.price) ? `${new Intl.NumberFormat('fr-FR').format(Number(form.price))} FCFA` : '—'}</span>
              {form.oldPrice && <span className="text-sm font-semibold text-gray-400 line-through">{new Intl.NumberFormat('fr-FR').format(Number(form.oldPrice))} FCFA</span>}
            </div>
          </div>

          {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10">{err}</p>}
          <Btn onClick={save} loading={busy} className="w-full bg-gray-900 py-3.5 text-white hover:bg-gray-800">
            {product ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </Btn>
        </div>
      </div>
    </div>
  );
}