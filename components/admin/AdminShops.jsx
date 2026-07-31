'use client';

import { useRouter } from 'next/navigation';
import { Img, useToast } from '@/components/ui';
import { formatFCFA } from '@/lib/money';

export default function AdminShops({ shops }) {
  const router = useRouter();
  const toast = useToast();
  const remove = async (s) => {
    if (!confirm(`Supprimer la boutique « ${s.name} » (${s.products} produits) ?`)) return;
    const res = await fetch('/api/admin/shops', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id }),
    });
    const j = await res.json();
    if (!res.ok) return toast(j.error, 'error');
    toast('Boutique supprimée.');
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Boutiques</h1>
      <p className="mt-1 text-sm text-gray-500">{shops.length} boutique(s) — dont {shops.filter((s) => s.demo).length} de démonstration.</p>
      <div className="mt-6 space-y-3">
        {shops.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Img src={`https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80`} alt="" className="hidden h-12 w-12 rounded-xl object-cover sm:block" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold">{s.name}</span>
                  {s.demo && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600">DÉMO</span>}
                </div>
                <div className="text-xs text-gray-400">laboutique.ci/{s.slug} · {s.ownerName} ({s.ownerEmail})</div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-center text-xs">
              <div><div className="text-sm font-black">{s.products}</div><span className="text-gray-400">produits</span></div>
              <div><div className="text-sm font-black">{s.orders}</div><span className="text-gray-400">commandes</span></div>
              <div><div className="text-sm font-black text-violet-600">{formatFCFA(s.revenue)}</div><span className="text-gray-400">CA</span></div>
              <div><div className="text-sm font-black">{s.visits}</div><span className="text-gray-400">visites</span></div>
            </div>
            <div className="flex gap-2">
              <a href={`/s/${s.slug}`} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-400">Voir ↗</a>
              <button onClick={() => remove(s)} className="rounded-xl border border-red-100 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}