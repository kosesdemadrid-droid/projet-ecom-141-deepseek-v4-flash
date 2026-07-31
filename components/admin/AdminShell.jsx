'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '../ui';

const NAV = [
  { href: '/admin', label: 'Vue d\'ensemble', icon: '📊', exact: true },
  { href: '/admin/clients', label: 'Clients', icon: '👥' },
  { href: '/admin/shops', label: 'Boutiques', icon: '🏬' },
  { href: '/admin/themes', label: 'Thèmes premium', icon: '🎨' },
  { href: '/admin/content', label: 'Contenu du site', icon: '📝' },
];

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-800 bg-gray-950 text-gray-300">
          <div className="flex h-16 items-center gap-2.5 border-b border-gray-800 px-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white">🛡️</span>
            <div>
              <div className="text-sm font-black text-white">LaBoutique.ci</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Super Admin</div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${active ? 'bg-violet-500/15 text-violet-300' : 'hover:bg-white/5 hover:text-white'}`}>
                  <span>{n.icon}</span>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">{user.name.slice(0, 1)}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-white">{user.name}</div>
                <div className="truncate text-[10px] text-gray-500">{user.email}</div>
              </div>
              <button onClick={logout} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white" title="Se déconnecter">⎋</button>
            </div>
          </div>
        </aside>
        <div className="pl-60">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="text-sm font-semibold text-gray-500">Panneau d'administration global</div>
            <div className="flex items-center gap-3">
              <Link href="/" className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-100">Site vitrine ↗</Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-100">Dashboard ↗</Link>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}