'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Img, Spinner } from './ui';
import { formatFCFA } from '@/lib/money';

const ICONS = {
  store: '🏬', smartphone: '📱', palette: '🎨', truck: '🚚', chart: '📊', globe: '🌍',
};

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l1.5 13.5a1 1 0 01-1 1.1H5.5a1 1 0 01-1-1.1L6 7z" /><path d="M9 10V6a3 3 0 016 0v4" /></svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            LaBoutique<span className="text-orange-600">.ci</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          <a href="#fonctionnalites" className="transition hover:text-gray-900">Fonctionnalités</a>
          <a href="#themes" className="transition hover:text-gray-900">Thèmes</a>
          <a href="#demas" className="transition hover:text-gray-900">Démonstrations</a>
          <a href="#faq" className="transition hover:text-gray-900">FAQ</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
            Se connecter
          </Link>
          <Link href="/register" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800">
            S'inscrire
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-600 md:hidden" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? 'M18 6 6 18M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {[['#fonctionnalites', 'Fonctionnalités'], ['#themes', 'Thèmes'], ['#demas', 'Démonstrations'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700">{label}</a>
          ))}
          <div className="mt-2 flex gap-3">
            <Link href="/login" className="flex-1 rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700">Se connecter</Link>
            <Link href="/register" className="flex-1 rounded-xl bg-gray-900 py-2.5 text-center text-sm font-semibold text-white">S'inscrire</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function LandingHero({ stats }) {
  return (
    <section className="relative overflow-hidden bg-[#fff7ec]">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/70 px-3.5 py-1.5 text-xs font-semibold text-orange-700">
            🇨🇮 100% conçu pour la Côte d'Ivoire
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]">
            Créez votre boutique en ligne en{' '}
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">5 minutes</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            La plateforme n°1 en Côte d'Ivoire pour vendre en ligne : boutique premium, paiement{' '}
            <strong className="text-gray-800">Orange Money, MTN MoMo &amp; Wave</strong>, livraison dans tout le pays.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/register" className="rounded-2xl bg-gray-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-gray-800">
              Créer ma boutique — gratuit
            </Link>
            <a href="#demas" className="rounded-2xl border-2 border-gray-900/10 bg-white px-7 py-3.5 text-sm font-bold text-gray-800 transition hover:-translate-y-0.5 hover:border-gray-900/30">
              Voir les démos
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-orange-200/60 pt-6">
            {[
              [stats.shops, 'boutiques créées'],
              [stats.products, 'produits en ligne'],
              [stats.cities, 'villes livrées'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-black text-gray-900">{n}+</div>
                <div className="mt-0.5 text-xs font-medium text-gray-500">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative fade-up lg:pr-6" style={{ animationDelay: '.15s' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-10">
              <div className="overflow-hidden rounded-3xl border border-white/60 shadow-2xl shadow-orange-900/10">
                <Img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700&q=80&auto=format&fit=crop" alt="Boutique" className="h-44 w-full object-cover" />
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5">
                  <span className="text-xs font-bold text-gray-800">Baskets running</span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">32 000 FCFA</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-orange-900/10">
                <Img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop" alt="Sneaker" className="h-40 w-full object-cover" />
                <div className="flex items-center gap-2 px-3.5 py-2.5">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs font-semibold text-gray-500">4,9/5 · 128 avis</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-white/60 shadow-2xl shadow-orange-900/10">
                <Img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=80&auto=format&fit=crop" alt="Maison" className="h-40 w-full object-cover" />
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5">
                  <span className="text-xs font-bold text-gray-800">Canapé 3 places</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">En stock</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/60 shadow-2xl shadow-orange-900/10">
                <Img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80&auto=format&fit=crop" alt="Bijoux" className="h-44 w-full object-cover" />
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5">
                  <span className="text-xs font-bold text-gray-800">Collier or fin</span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">Bijoux</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-white shadow-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">💳</span>
            <span className="text-xs font-semibold">Orange Money · MTN MoMo · Wave</span>
          </div>
        </div>
      </div>
      <div className="border-t border-orange-100 bg-white/60 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-hidden px-4 text-xs font-bold uppercase tracking-widest text-gray-400 sm:px-6">
          <span>Orange Money</span><span className="text-gray-300">•</span><span>MTN MoMo</span><span className="text-gray-300">•</span><span>Wave</span><span className="text-gray-300">•</span><span>Livraison Abidjan</span><span className="text-gray-300">•</span><span>Sous-domaine gratuit</span><span className="text-gray-300">•</span><span>FCFA</span>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-gray-500">{text}</p>}
    </div>
  );
}

export function Features() {
  const list = [
    { icon: 'store', title: 'Boutique premium', text: 'Un site e-commerce magnifique et complet, prêt en quelques clics.', color: 'from-orange-500 to-amber-500' },
    { icon: 'smartphone', title: 'Paiements mobiles', text: 'Orange Money, MTN MoMo et Wave intégrés pour encaisser partout.', color: 'from-amber-500 to-yellow-500' },
    { icon: 'palette', title: '10 thèmes premium', text: 'Sport, mode, beauté, high-tech… une maquette adaptée à votre secteur.', color: 'from-fuchsia-500 to-purple-500' },
    { icon: 'truck', title: 'Livraison simplifiée', text: 'Zones Abidjan et intérieur du pays avec calcul automatique des frais.', color: 'from-emerald-500 to-green-600' },
    { icon: 'chart', title: 'Pilotage complet', text: 'Tableau de bord, produits, stocks, commandes et statistiques.', color: 'from-blue-500 to-indigo-500' },
    { icon: 'globe', title: 'Sous-domaine offert', text: 'votreboutique.laboutique.ci offert, domaine à brancher ensuite.', color: 'from-rose-500 to-pink-500' },
  ];
  return (
    <section id="fonctionnalites" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Fonctionnalités" title="Tout pour vendre en ligne en Côte d'Ivoire" text="De la création de votre boutique à la livraison du colis, nous nous occupons de tout." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f, i) => (
          <div key={f.title} className="fade-up group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg ${f.color}`}>
              {ICONS[f.icon] || ICONS.store}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ThemesGallery({ themes }) {
  return (
    <section id="themes" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Thèmes premium" title="10 maquettes ultra soignées" text="Chaque thème possède sa palette, sa typographie et ses images — choisissez celui qui vous ressemble." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {themes.map((t, i) => (
            <a key={t.id} href={`/s/${t.demoShopSlug}`} target="_blank" rel="noreferrer" className="group fade-up overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-2xl" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="relative h-44 overflow-hidden">
                <Img src={t.hero} alt={t.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-700 backdrop-blur">
                  {t.colors && (
                    <span className="flex gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ background: t.colors.p }} />
                      <span className="h-2 w-2 rounded-full" style={{ background: t.colors.p2 }} />
                      <span className="h-2 w-2 rounded-full" style={{ background: t.colors.p3 }} />
                    </span>
                  )}
                  {t.sector}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{t.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 group-hover:gap-2 transition-all">
                  Voir la démo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CloneButton({ shop, children }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const clone = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/shops/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shop.id }),
      });
      if (res.status === 401) {
        router.push(`/register?next=${encodeURIComponent('/dashboard/templates')}`);
        return;
      }
      const j = await res.json();
      if (j.error) alert(j.error);
      else router.push(`/dashboard/shops/${j.shop.id}`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <button onClick={clone} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-60">
      {busy ? <Spinner className="h-3.5 w-3.5" /> : <span>✨</span>} {children || 'Utiliser cette boutique'}
    </button>
  );
}

export function DemosSection({ shops, compact }) {
  const list = compact ? shops.slice(0, 3) : shops;
  return (
    <section id="demas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead
        eyebrow="Démonstrations"
        title="Boutiques prêtes à l'emploi"
        text="Des boutiques 100% configurées avec produits, images et bannières. Cliquez, c'est la vôtre."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <div key={s.id} className="fade-up group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <Img src={s.hero} alt={s.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-700">{s.themeName}</span>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-black text-white drop-shadow">{s.name}</h3>
                  <p className="text-xs font-medium text-white/80">{s.productCount} produits</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">💰 {formatFCFA(s.topPrice)}</span>
                <span className="text-gray-300">•</span>
                <span>⭐ 4,8</span>
              </div>
              <div className="flex gap-2">
                <a href={`/s/${s.slug}`} className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:border-gray-400">
                  Visiter
                </a>
                <CloneButton shop={s} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {compact && (
        <div className="mt-10 text-center">
          <a href="#demas" className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-gray-800">
            Voir les 10 boutiques démo
          </a>
        </div>
      )}
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: '1', t: 'Créez votre compte', d: 'Inscription gratuite en 30 secondes avec votre nom, email et téléphone.', icon: '👤' },
    { n: '2', t: 'Choisissez votre thème', d: '10 maquettes premium ou 10 boutiques prêtes à l\'emploi, clonées en 1 clic.', icon: '🎨' },
    { n: '3', t: 'Vendez et encaissez', d: 'Partagez votre lien, encaissez via Mobile Money et suivez vos commandes.', icon: '🚀' },
  ];
  return (
    <section className="bg-gray-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Comment ça marche ?</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Votre boutique en 3 étapes</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="fade-up relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-2xl shadow-lg shadow-orange-500/30">{s.icon}</div>
              <div className="absolute right-6 top-6 text-5xl font-black text-white/10">{s.n}</div>
              <h3 className="text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Témoignages" title="Ils ont lancé leur boutique" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <figure key={t.name} className="fade-up rounded-3xl border border-gray-100 bg-white p-7 shadow-sm" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((x) => <span key={x}>★</span>)}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-gray-600">“{t.text}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <div className="text-sm font-bold text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow="FAQ" title="Questions fréquentes" />
        <div className="mt-10 space-y-3">
          {items.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                <span className="font-semibold text-gray-900">{f.q}</span>
                <span className={`shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              {open === i && <p className="fade-in border-t border-gray-100 px-6 py-4 text-sm leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 px-8 py-16 text-center text-white shadow-2xl shadow-orange-500/30">
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative text-3xl font-black tracking-tight sm:text-4xl">Prêt à lancer votre business en ligne ?</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-orange-50">Rejoignez les centaines de commerçants ivoiriens qui vendent déjà sur LaBoutique.ci.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register" className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-orange-600 shadow-xl transition hover:-translate-y-0.5">
            Créer ma boutique gratuitement
          </Link>
          <Link href="/login" className="rounded-2xl border-2 border-white/60 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10">
            J'ai déjà un compte
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white">🛍️</span>
              <span className="text-lg font-extrabold">LaBoutique<span className="text-orange-600">.ci</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              La plateforme SaaS e-commerce n°1 en Côte d'Ivoire. Boutique premium, paiements mobiles et livraison dans tout le pays.
            </p>
            <div className="mt-4 flex gap-2">
              {['🇨🇮', '📱', '💳', '🚚'].map((e, i) => (
                <span key={i} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-lg">{e}</span>
              ))}
            </div>
          </div>
          {[
            ['Produit', [['#fonctionnalites', 'Fonctionnalités'], ['#themes', 'Thèmes premium'], ['#demas', 'Boutiques démo'], ['#faq', 'FAQ']]],
            ['Compte', [['/register', 'Créer un compte'], ['/login', 'Se connecter'], ['/dashboard', 'Mon dashboard'], ['/admin', 'Espace admin']]],
            ['Contact', [['mailto:contact@laboutique.ci', 'contact@laboutique.ci'], ['tel:+2250700000000', '+225 07 00 00 00 00'], ['/demos', 'Voir les démos'], ['#', 'Abidjan, Côte d\'Ivoire']]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-gray-900">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-gray-500 transition hover:text-orange-600">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400 sm:flex-row">
          <span>© {new Date().getFullYear()} LaBoutique.ci — Fait avec ❤️ à Abidjan</span>
          <span>Photos : Unsplash · Paiements simulés en démo · Images libres de droits</span>
        </div>
      </div>
    </footer>
  );
}

export function useLandingData({ themes, shops, settings }) {
  const stats = useMemo(() => {
    const products = shops.reduce((s, x) => s + x.productCount, 0);
    return {
      shops: shops.length + 60,
      products: products + 1800,
      cities: 32,
    };
  }, [shops]);
  return { stats };
}