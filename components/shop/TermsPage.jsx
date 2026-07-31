'use client';

import { useShop } from './ShopContext';

export default function TermsPage({ paragraphs }) {
  const { t } = useShop();
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--p2)' }}>{t('terms')}</h1>
      <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {(paragraphs || ['']).map((p, i) => (
          <p key={i} className="mb-5 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">{p}</p>
        ))}
        <p className="border-t border-gray-100 pt-5 text-xs text-gray-400 dark:border-gray-800">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} · {t('emailSent')}
        </p>
      </div>
    </main>
  );
}