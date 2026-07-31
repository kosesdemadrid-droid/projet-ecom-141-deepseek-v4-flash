'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';
import { formatFCFA } from '@/lib/money';

export default function AdminClients({ clients }) {
  const router = useRouter();
  const toast = useToast();
  const remove = async (c) => {
    if (!confirm(`Supprimer le client « ${c.name} » et toutes ses boutiques ?`)) return;
    const res = await fetch('/api/admin/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id }),
    });
    const j = await res.json();
    if (!res.ok) return toast(j.error, 'error');
    toast('Client supprimé.');
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Clients</h1>
      <p className="mt-1 text-sm text-gray-500">{clients.length} compte(s) client sur la plateforme.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="hidden grid-cols-12 gap-3 border-b border-gray-100 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 md:grid">
          <span className="col-span-4">Client</span>
          <span className="col-span-2">Contact</span>
          <span className="col-span-2">Boutiques</span>
          <span className="col-span-2">Chiffre d'affaires</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {clients.map((c) => (
            <div key={c.id} className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-12 md:items-center">
              <div className="col-span-2 flex items-center gap-3 md:col-span-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">{c.name.slice(0, 1)}</span>
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs text-gray-400">Inscrit le {new Date(c.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm">{c.email}</div>
                <div className="text-xs text-gray-400">{c.phone || '—'}</div>
              </div>
              <div className="text-sm font-bold md:col-span-2">{c.shops} boutique(s) · {c.orders} cmd</div>
              <div className="text-sm font-black text-violet-600 md:col-span-2">{formatFCFA(c.revenue)}</div>
              <div className="flex justify-end md:col-span-2">
                <button onClick={() => remove(c)} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50">🗑 Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}