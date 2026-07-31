'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn, Toggle, useToast } from '@/components/ui';

export default function AccountClient({ user }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', currentPassword: '', password: '', confirm: '' });
  const [dark, setDark] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('dashDark', next ? '1' : '0');
    document.documentElement.classList.toggle('dark', next);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) return setErr('Les mots de passe ne correspondent pas.');
    if (form.password && !form.currentPassword) return setErr('Entrez votre mot de passe actuel pour le changer.');
    setBusy(true);
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      toast('Compte mis à jour ✓');
      setForm({ ...form, currentPassword: '', password: '', confirm: '' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const input = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900';
  const label = 'mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300';

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Compte & paramètres</h1>
      <p className="mt-1 text-sm text-gray-500">Gérez vos informations personnelles et vos préférences.</p>

      <form onSubmit={save} className="mt-8 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 font-bold">Informations personnelles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Nom complet</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            </label>
            <label className="block">
              <span className={label}>Téléphone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07 XX XX XX XX" className={input} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>Email (non modifiable)</span>
            <input value={user.email} disabled className={`${input} bg-gray-50 text-gray-400 dark:bg-gray-800`} />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 font-bold">Changer le mot de passe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Mot de passe actuel</span>
              <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={input} />
            </label>
            <label className="block">
              <span className={label}>Nouveau mot de passe</span>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>Confirmer</span>
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={input} />
          </label>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <div className="text-sm font-bold">Mode sombre</div>
            <div className="text-xs text-gray-400">Basculez le dashboard en mode sombre.</div>
          </div>
          <Toggle checked={dark} onChange={toggleDark} />
        </div>

        {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10">{err}</p>}
        <div className="flex flex-wrap gap-3">
          <Btn type="submit" loading={busy} className="bg-gray-900 px-8 py-3 text-white hover:bg-gray-800">Enregistrer</Btn>
          <button type="button" onClick={logout} className="rounded-xl border border-red-200 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/20">
            Se déconnecter
          </button>
        </div>
      </form>
    </div>
  );
}