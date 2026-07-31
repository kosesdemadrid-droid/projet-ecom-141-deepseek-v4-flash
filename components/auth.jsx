'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Btn, Spinner, ToastProvider, useToast } from './ui';

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      <input
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        {...props}
      />
    </label>
  );
}

function AuthShell({ title, sub, children, foot }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gray-900 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <Link href="/" className="absolute left-12 top-10 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-lg shadow-lg">🛍️</span>
            <span className="text-lg font-extrabold">LaBoutique<span className="text-orange-400">.ci</span></span>
          </Link>
          <h2 className="max-w-md text-3xl font-black leading-tight">La première plateforme e-commerce 100% ivoirienne.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300">
            Orange Money, MTN MoMo et Wave intégrés. Livraison à Abidjan et dans tout le pays. Votre boutique en ligne en 5 minutes.
          </p>
          <div className="mt-6 flex gap-2">
            {['Orange Money', 'MTN MoMo', 'Wave'].map((p) => (
              <span key={p} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold backdrop-blur">{p}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-[#fffaf3] px-4 py-12">
        <div className="w-full max-w-md fade-up">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
            Retour au site
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{sub}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-gray-500">{foot}</div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) return setErr('Les mots de passe ne correspondent pas.');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      toast('Compte créé ! Un email de bienvenue vous a été envoyé. ✉️');
      router.push(params.get('next') || '/dashboard');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nom complet" placeholder="Ex : Awa Koné" value={form.name} onChange={set('name')} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" type="email" placeholder="vous@email.com" value={form.email} onChange={set('email')} required />
        <Field label="Téléphone" placeholder="07 XX XX XX XX" value={form.phone} onChange={set('phone')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Mot de passe" type="password" placeholder="6 caractères min." value={form.password} onChange={set('password')} required />
        <Field label="Confirmation" type="password" placeholder="••••••" value={form.confirm} onChange={set('confirm')} required />
      </div>
      {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{err}</p>}
      <Btn type="submit" loading={busy} className="w-full bg-gray-900 py-3.5 text-white transition hover:bg-gray-800">
        Créer mon compte
      </Btn>
      <p className="text-center text-xs text-gray-400">En vous inscrivant, vous acceptez nos conditions d'utilisation.</p>
    </form>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      toast(`Bon retour, ${j.user.name} !`);
      router.push(j.user.role === 'admin' && !params.get('next') ? '/admin' : params.get('next') || '/dashboard');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" placeholder="vous@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <div>
        <Field label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-xs font-semibold text-orange-600 hover:underline">Mot de passe oublié ?</Link>
        </div>
      </div>
      {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{err}</p>}
      <Btn type="submit" loading={busy} className="w-full bg-gray-900 py-3.5 text-white transition hover:bg-gray-800">
        Se connecter
      </Btn>
      <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-xs text-gray-600">
        <strong>Compte démo :</strong> demo@laboutique.ci / demo123
      </div>
    </form>
  );
}

function ForgotForm() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    setSent(true);
    toast('Si ce compte existe, un email de réinitialisation a été envoyé. ✉️');
  };
  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="text-3xl">📬</div>
        <h3 className="mt-2 font-bold text-emerald-800">Email envoyé !</h3>
        <p className="mt-1 text-sm text-emerald-700">
          Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient d'être envoyé (vérifiez aussi votre boîte spam, et la console du terminal pour la simulation).
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline">Retour à la connexion</Link>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Votre email" type="email" placeholder="vous@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Btn type="submit" loading={busy} className="w-full bg-gray-900 py-3.5 text-white transition hover:bg-gray-800">
        Envoyer le lien de réinitialisation
      </Btn>
    </form>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) return setErr('Les mots de passe ne correspondent pas.');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });
      const j = await res.json();
      if (!res.ok) return setErr(j.error);
      setDone(true);
      toast('Mot de passe réinitialisé !');
    } finally {
      setBusy(false);
    }
  };
  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-2 font-bold text-emerald-800">Mot de passe mis à jour</h3>
        <Link href="/login" className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline">Se connecter</Link>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nouveau mot de passe" type="password" placeholder="6 caractères min." value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <Field label="Confirmation" type="password" placeholder="••••••" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
      {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{err}</p>}
      <Btn type="submit" loading={busy} className="w-full bg-gray-900 py-3.5 text-white transition hover:bg-gray-800">
        Réinitialiser
      </Btn>
    </form>
  );
}

export function AuthPage({ mode }) {
  const cfg = {
    register: { title: 'Créer un compte', sub: '30 secondes suffisent. Gratuit, sans carte bancaire.', form: <RegisterForm />, foot: <>Déjà un compte ? <Link href="/login" className="font-bold text-orange-600 hover:underline">Se connecter</Link></> },
    login: { title: 'Se connecter', sub: 'Bon retour parmi nous !', form: <LoginForm />, foot: <>Pas encore de compte ? <Link href="/register" className="font-bold text-orange-600 hover:underline">S'inscrire</Link></> },
    forgot: { title: 'Mot de passe oublié', sub: 'Entrez votre email, nous vous envoyons un lien.', form: <ForgotForm />, foot: <Link href="/login" className="font-bold text-orange-600 hover:underline">Retour à la connexion</Link> },
    reset: { title: 'Nouveau mot de passe', sub: 'Choisissez un mot de passe solide.', form: <ResetForm />, foot: <Link href="/login" className="font-bold text-orange-600 hover:underline">Retour à la connexion</Link> },
  }[mode];
  return (
    <ToastProvider>
      <AuthShell {...cfg}>{cfg.form}</AuthShell>
    </ToastProvider>
  );
}