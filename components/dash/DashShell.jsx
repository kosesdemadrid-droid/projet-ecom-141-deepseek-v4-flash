'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '../ui';

const NAV = [
  { section: 'Général', items: [
    { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { href: '/dashboard/shops', label: 'Mes boutiques', icon: '🏬' },
    { href: '/dashboard/shops/new', label: 'Créer une boutique', icon: '✨', cta: true },
    { href: '/dashboard/templates', label: 'Boutiques prêtes à l\'emploi', icon: '🎁' },
  ]},
  { section: 'Assistance', items: [
    { href: '/dashboard/support', label: 'Support', icon: '💬' },
    { href: '/dashboard/account', label: 'Compte & paramètres', icon: '⚙️' },
  ]},
];

export default function DashShell({ user, shops, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('dashDark') === '1';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('dashDark', next ? '1' : '0');
    document.documentElement.classList.toggle('dark', next);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const totalUnread = shops.reduce((s, x) => s + (x.unreadMessages || 0), 0);
  const firstShop = shops[0];
  const filteredShops = q.trim()
    ? shops.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
    : shops;

  const go = (href) => {
    setMenuOpen(false); setSearchFocus(false); setQ('');
    router.push(href);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f7f6f3] text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
        {/* ============ SIDEBAR ============ */}
        <aside className={`panel-dark fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-all lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-16 items-center gap-2.5 px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-glow-orange">
                🛍️
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0c0a09] bg-amber-400" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-white">LaBoutique<span className="grad-text">.ci</span></span>
            </Link>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
            {NAV.map((group) => (
              <div key={group.section}>
                <div className="mb-2 px-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-gray-600">{group.section}</div>
                <div className="space-y-1">
                  {group.items.map((n) => {
                    const active = n.href === '/dashboard' ? pathname === '/dashboard'
                      : n.href === '/dashboard/shops' ? (pathname.startsWith('/dashboard/shops') && !pathname.includes('/new'))
                      : pathname.startsWith(n.href);
                    if (n.cta) {
                      return (
                        <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="btn-premium mt-1 flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-2.5 text-sm font-black text-white shadow-glow-orange">
                          <span>{n.icon}</span>
                          <span className="flex-1">{n.label}</span>
                          <span>+</span>
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                          active ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-amber-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className={`text-base ${active ? '' : 'opacity-80'}`}>{n.icon}</span>
                        <span className="flex-1">{n.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-glow-orange" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            {user.role === 'admin' && (
              <div>
                <div className="mb-2 px-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-gray-600">Pilote</div>
                <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${pathname.startsWith('/admin') ? 'bg-gradient-to-r from-violet-500/20 to-transparent text-violet-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <span className="text-base">🛡️</span>
                  <span className="flex-1">Administration</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className="relative">
              <button ref={avatarRef} onClick={() => setAvatarOpen(!avatarOpen)} className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-3 transition hover:bg-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-black text-white shadow-glow-orange">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-bold text-white">{user.name}</span>
                  <span className="block truncate text-[11px] text-gray-500">{user.email}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`text-gray-500 transition-transform ${avatarOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {avatarOpen && (
                <div className="pop absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
                  {[['/dashboard/account', '⚙️ Compte & paramètres'], ['/dashboard/shops', '🏬 Mes boutiques'], ['/', '🌍 Voir le site']].map(([href, label]) => (
                    <Link key={href} href={href} onClick={() => setAvatarOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white">{label}</Link>
                  ))}
                  <button onClick={logout} className="flex w-full items-center gap-2.5 border-t border-white/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10">⎋ Se déconnecter</button>
                </div>
              )}
            </div>
          </div>
        </aside>
        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        {/* ============ CONTENU ============ */}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-gray-200/70 bg-[#f7f6f3]/85 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/85">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <button onClick={() => setOpen(true)} className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-200/60 dark:hover:bg-gray-800 lg:hidden" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </button>

              {/* Sélecteur de boutique */}
              <div className="relative hidden md:block" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-bold shadow-sm transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                  <span className="text-base">🏬</span>
                  {firstShop ? <span className="max-w-36 truncate">{firstShop.name}</span> : <span>Mes boutiques</span>}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {menuOpen && (
                  <div className="pop absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Rechercher une boutique…"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5">
                      {filteredShops.length === 0 && <p className="px-4 py-6 text-center text-xs text-gray-400">Aucune boutique trouvée.</p>}
                      {filteredShops.map((s) => (
                        <Link key={s.id} href={`/dashboard/shops/${s.id}`} onClick={() => go('')} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-black text-white">{s.name.slice(0, 1)}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{s.name}</span>
                            <span className="block text-[11px] text-gray-400">laboutique.ci/{s.slug}</span>
                          </span>
                          {s.unreadMessages > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">{s.unreadMessages}</span>}
                          <span className="text-gray-300">›</span>
                        </Link>
                      ))}
                      <Link href="/dashboard/shops" onClick={() => go('')} className="mt-1 block rounded-xl border-2 border-dashed border-gray-200 py-2 text-center text-xs font-bold text-gray-400 transition hover:border-gray-400 dark:border-gray-700">
                        + Toutes mes boutiques
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1" />

              {/* Notifications */}
              <Link
                href={shops.find((s) => s.unreadMessages > 0) ? `/dashboard/shops/${shops.find((s) => s.unreadMessages > 0).id}/messages` : '/dashboard/shops'}
                title="Messages non lus"
                className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-200/60 dark:hover:bg-gray-800"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                {totalUnread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{totalUnread}</span>
                )}
              </Link>

              {/* Mode sombre */}
              <button onClick={toggleDark} title="Mode sombre / clair" className="rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-200/60 dark:text-gray-300 dark:hover:bg-gray-800">
                {dark ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                )}
              </button>

              <Link
                href={firstShop ? `/s/${firstShop.slug}` : '/demos'}
                target="_blank"
                className="hidden items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 sm:inline-flex"
              >
                Voir ma boutique
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>

          <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
            <p className="border-t border-gray-200/70 pt-6 text-center text-xs text-gray-400 dark:border-gray-800">
              © {new Date().getFullYear()} LaBoutique.ci — {user.name} · <a href="/" className="hover:text-orange-500">Site vitrine ↗</a>
            </p>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}