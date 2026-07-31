'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from './ShopContext';
import { Img, ShareButtons } from '../ui';

export default function ShopShell({ categories, children }) {
  const { shop, t, lang, toggleLang, cartCount, setCartOpen, q, setQ, goSearch, toast } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const nav = [
    { href: `/s/${shop.slug}`, label: t('home'), exact: true },
    { href: `/s/${shop.slug}/products`, label: t('products') },
    { href: `/s/${shop.slug}/about`, label: t('about') },
    { href: `/s/${shop.slug}/contact`, label: t('contact') },
  ];

  const isActive = (n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href));

  const newsletter = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) return;
    fetch(`/api/s/${shop.slug}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(() => toast(t('subscribed')));
    e.target.email.value = '';
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: shop.colors?.bg || '#ffffff',
        '--p': shop.colors?.p || '#ea580c',
        '--p2': shop.colors?.p2 || '#9a3412',
        '--p3': shop.colors?.p3 || '#fbbf24',
        '--font': `'${shop.font || 'Inter'}', ui-sans-serif, sans-serif`,
      }}
    >
      <style>{`body{font-family:var(--font)}`}</style>

      {/* Bandeau promo premium */}
      <div className="grad-p relative overflow-hidden text-center text-xs font-bold text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)' }} />
        <p className="relative px-4 py-2.5 tracking-wide">{t('promoBanner')}</p>
      </div>

      {/* En-tête */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-gray-600 lg:hidden dark:text-gray-300" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <Link href={`/s/${shop.slug}`} className="flex min-w-0 items-center gap-2.5">
            {shop.logo ? (
              <Img src={shop.logo} alt="" className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-md" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black text-white shadow-brand" style={{ background: 'var(--p)' }}>
                {shop.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="truncate text-lg font-black tracking-tight" style={{ color: 'var(--p2)' }}>{shop.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive(n) ? 'bg-soft text-p' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                {n.label}
              </Link>
            ))}
            <div className="mx-1 flex flex-wrap gap-1.5 pl-2">
              {categories.slice(0, 3).map((c) => (
                <Link key={c} href={`/s/${shop.slug}/products?cat=${encodeURIComponent(c)}`} className="rounded-full border border-gray-100 px-3 py-1.5 text-[11px] font-bold text-gray-500 transition hover:border-current hover:text-p dark:border-gray-800 dark:text-gray-400">
                  {c}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Recherche">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            <button onClick={toggleLang} className="hidden rounded-full px-2.5 py-2 text-xs font-black text-gray-500 transition hover:bg-gray-100 sm:block dark:text-gray-300 dark:hover:bg-gray-800" title="Basculer la langue">
              {lang === 'fr' ? 'FR' : 'EN'}
            </button>
            {shop.social?.whatsapp && (
              <a href={`https://wa.me/${shop.social.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="hidden rounded-full p-2.5 text-emerald-600 transition hover:bg-emerald-50 md:block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            )}
            <button onClick={() => setCartOpen(true)} className="group relative rounded-full p-2.5 text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" aria-label="Panier">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 7h12l1.5 13.5a1 1 0 01-1 1.1H5.5a1 1 0 01-1-1.1L6 7z" /><path d="M9 10V6a3 3 0 016 0v4" /></svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-p px-1 text-[10px] font-black text-white shadow-brand">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 pl-4 dark:border-gray-700 dark:bg-gray-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && goSearch()}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
              <button onClick={goSearch} className="shrink-0 rounded-xl bg-p px-6 py-2.5 text-sm font-bold text-white transition hover-bright">{t('search')}</button>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden dark:border-gray-800 dark:bg-gray-900">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive(n) ? 'bg-soft text-p' : 'text-gray-700 dark:text-gray-200'}`}>
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap gap-1.5 px-3">
              {categories.map((c) => (
                <Link key={c} href={`/s/${shop.slug}/products?cat=${encodeURIComponent(c)}`} onClick={() => setMenuOpen(false)} className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {children}

      {/* Pied de page premium */}
      <footer className="panel-dark relative mt-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="orb -bottom-40 left-1/4 h-72 w-72 bg-orange-600/15" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                {shop.logo ? (
                  <Img src={shop.logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-brand" style={{ background: 'var(--p)' }}>{shop.name.slice(0, 1)}</span>
                )}
                <span className="text-lg font-black text-white">{shop.name}</span>
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-400">{shop.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                {['🟠 Orange Money', '🟡 MTN MoMo', '🔵 Wave'].map((p) => (
                  <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-gray-300">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Navigation</h4>
              <ul className="mt-5 space-y-3 text-sm">
                {nav.map((n) => (
                  <li key={n.href}><Link href={n.href} className="text-gray-400 transition hover:text-white">{n.label}</Link></li>
                ))}
                <li><Link href={`/s/${shop.slug}/tracking`} className="text-gray-400 transition hover:text-white">{t('orderTracking')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t('newsletter')}</h4>
              <form onSubmit={newsletter} className="mt-5 flex gap-2">
                <input name="email" type="email" required placeholder={t('newsletterPlaceholder')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-white/30" />
                <button className="shrink-0 rounded-xl bg-p px-4 text-sm font-bold text-white transition hover-bright">{t('subscribe')}</button>
              </form>
              <p className="mt-3 text-xs text-gray-500">{t('newsletterSub')}</p>
              <div className="mt-6">
                <ShareButtons title={shop.name} url={`https://laboutique.ci/s/${shop.slug}`} />
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-gray-600 sm:flex-row">
            <span>© {new Date().getFullYear()} {shop.name} — Fait avec ❤️ à Abidjan</span>
            <span className="flex items-center gap-2">
              {t('payWith')} :
              {['Orange Money', 'MTN MoMo', 'Wave'].map((p) => <span key={p} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-bold text-gray-400">{p}</span>)}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}