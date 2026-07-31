'use client';

import { useRouter } from 'next/navigation';
import { EmptyState, useToast } from '@/components/ui';
import { fmtDateTime } from '@/lib/format';
import ShopTabs from './ShopTabs';

export default function MessagesManager({ shop }) {
  const router = useRouter();
  const toast = useToast();
  const messages = [...(shop.messages || [])].reverse();

  const toggleRead = async (m) => {
    await fetch(`/api/shops/${shop.id}/messages`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: m.id, read: !m.read }),
    });
    router.refresh();
  };

  const remove = async (m) => {
    if (!confirm('Supprimer ce message ?')) return;
    await fetch(`/api/shops/${shop.id}/messages`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: m.id }),
    });
    toast('Message supprimé.');
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">{shop.name}</h1>
        <p className="text-sm text-gray-500">Messages reçus via le formulaire de contact de votre boutique.</p>
      </div>
      <ShopTabs shopId={shop.id} />
      {messages.length === 0 ? (
        <EmptyState icon="✉️" title="Aucun message" text="Les messages envoyés depuis la page Contact de votre boutique apparaîtront ici." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`rounded-2xl border p-5 shadow-sm ${m.read ? 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900' : 'border-orange-200 bg-orange-50/50 dark:border-orange-500/30 dark:bg-orange-500/5'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{m.name}</span>
                    {!m.read && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">Nouveau</span>}
                  </div>
                  <div className="text-xs text-gray-400">{m.email} · {fmtDateTime(m.createdAt)}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(m)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
                    {m.read ? 'Marquer non lu' : '✓ Lu'}
                  </button>
                  <button onClick={() => remove(m)} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50">🗑</button>
                </div>
              </div>
              <p className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-200">{m.subject}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}