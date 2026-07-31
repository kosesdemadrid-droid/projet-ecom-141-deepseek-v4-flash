'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Btn } from '@/components/ui';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      if (j.user.role !== 'admin') return setErr('Ce compte n\'a pas les droits administrateur.');
      router.push('/admin');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm fade-up">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-2xl text-white shadow-xl shadow-violet-500/30">🛡️</span>
          <h1 className="mt-4 text-2xl font-black text-white">Administration</h1>
          <p className="mt-1 text-sm text-gray-400">Espace réservé aux super administrateurs.</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900 p-7">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-300">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@laboutique.ci" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-300">Mot de passe</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500" />
          </label>
          {err && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">{err}</p>}
          <Btn type="submit" loading={busy} className="w-full bg-violet-600 py-3.5 text-white transition hover:bg-violet-500">
            Accéder au panel
          </Btn>
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-3 text-xs text-gray-400">
            <strong className="text-gray-300">Accès démo :</strong> admin@laboutique.ci / admin123
          </div>
        </form>
        <p className="mt-6 text-center"><a href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-300">← Retour au site</a></p>
      </div>
    </div>
  );
}