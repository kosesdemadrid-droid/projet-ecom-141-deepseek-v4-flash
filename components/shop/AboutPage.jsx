'use client';

import { useShop } from './ShopContext';

export default function AboutPage({ paragraphs, shopName }) {
  const { t } = useShop();
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('about')}</h1>
      <div className="mt-6 space-y-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {(paragraphs || ['']).map((p, i) => (
          <p key={i} className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">{p}</p>
        ))}
        <div className="grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3 dark:border-gray-800">
          {[
            ['📍', 'Abidjan, Côte d\'Ivoire'],
            ['💳', 'OM · MTN MoMo · Wave'],
            ['🚚', 'Livraison dans tout le pays'],
          ].map(([i, txt]) => (
            <div key={txt} className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <span className="text-lg">{i}</span> {txt}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}