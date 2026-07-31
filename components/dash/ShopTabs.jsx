'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = (id) => [
  { href: `/dashboard/shops/${id}`, label: 'Aperçu', icon: '📈', exact: true },
  { href: `/dashboard/shops/${id}/products`, label: 'Produits', icon: '📦' },
  { href: `/dashboard/shops/${id}/orders`, label: 'Commandes', icon: '🛒' },
  { href: `/dashboard/shops/${id}/messages`, label: 'Messages', icon: '✉️' },
  { href: `/dashboard/shops/${id}/settings`, label: 'Paramètres', icon: '⚙️' },
];

export default function ShopTabs({ shopId }) {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-900">
      {TABS(shopId).map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              active ? 'bg-gray-900 text-white shadow dark:bg-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}