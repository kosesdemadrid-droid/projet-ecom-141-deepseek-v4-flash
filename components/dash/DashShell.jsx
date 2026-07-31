'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '../ui';

const NAV = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/dashboard/shops', label: 'Mes boutiques', icon: '🏬' },
  { href: '/dashboard/shops/new', label: 'Créer une boutique', icon: '✨' },
  { href: '/dashboard/templates', label: 'Boutiques prêtes à l\'emploi', icon: '🎁' },
  { href: '/dashboard/support', label: 'Support', icon: '💬' },
  { href: '/dashboard/account', label: 'Compte & paramètres', icon: '⚙️' },
];

export default function DashShell({ user, shops, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dashDark') === '1';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
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

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
        {/* Barre latérale */}
        <aside className={`panel-dark fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-black/40 transition-all dark:border-gray-800 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-glow-orange">🛍️</span>
              <span className="text-base font-extrabold tracking-tight text-white">LaBoutique<span className="grad-text">.ci</span></span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== '/dashboard' && n.href !== '/dashboard/shops/new' && pathname.startsWith(n.href));
              const isList = n.href === '/dashboard/shops';
              const activeList = isList && pathname.startsWith('/dashboard/shops/') && !pathname.includes('/new');
              const is = active || activeList;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    is ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-amber-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`text-base ${is ? '' : 'opacity-80'}`}>{n.icon}</span>
                  <span className="flex-1">{n.label}</span>
                  {is && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-glow-orange" />}
                </Link>
              );
            })}
            {user.role === 'admin' && (
              <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${pathname.startsWith('/admin') ? 'bg-gradient-to-r from-violet-500/20 to-transparent text-violet-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <span className="text-base">🛡️</span>
                Administration
              </Link>
            )}
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-black text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">{user.name}</div>
                <div className="truncate text-xs text-gray-500">{user.email}</div>
              </div>
              <button onClick={logout} title="Se déconnecter" className="rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-red-400">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              </button>
            </div>
          </div>
        </aside>
        {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

        {/* Contenu */}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/85 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/85 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden font-semibold text-gray-400 sm:block">Mon espace</span>
                {shops.length > 0 && (
                  <Link href={`/dashboard/shops/${shops[0].id}`} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400">
                    🏬 {shops.length} boutique{shops.length > 1 ? 's' : ''}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleDark} title="Mode sombre / clair" className="rounded-lg p-2.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                {dark ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                )}
              </button>
              <Link href={shops[0] ? `/s/${shops[0].slug}` : '/demos'} target="_blank" className="hidden items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 md:inline-flex">
                Voir ma boutique ↗
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}