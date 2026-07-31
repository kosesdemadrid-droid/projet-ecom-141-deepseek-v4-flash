'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Img, Spinner } from './ui';
import { formatFCFA } from '@/lib/money';

/* ================= NAVIGATION ================= */
export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#0c0a09]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white shadow-glow-orange transition group-hover:scale-105">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l1.5 13.5a1 1 0 01-1 1.1H5.5a1 1 0 01-1-1.1L6 7z" /><path d="M9 10V6a3 3 0 016 0v4" /></svg>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0c0a09] bg-amber-400" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              LaBoutique<span className="grad-text">.ci</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-gray-300 lg:flex">
            {[['#fonctionnalites', 'Fonctionnalités'], ['#themes', 'Thèmes'], ['#demas', 'Démonstrations'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white">
              Se connecter
            </Link>
            <Link href="/register" className="btn-premium rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-white">
              S'inscrire
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-300 md:hidden" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? 'M18 6 6 18M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 pb-4 md:hidden">
            {[['#fonctionnalites', 'Fonctionnalités'], ['#themes', 'Thèmes'], ['#demas', 'Démonstrations'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/10">{label}</a>
            ))}
            <div className="mt-3 flex gap-3">
              <Link href="/login" className="flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-semibold text-white">Se connecter</Link>
              <Link href="/register" className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-center text-sm font-bold text-white">S'inscrire</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ================= HERO ================= */
export function LandingHero({ stats }) {
  const cards = [
    { img: 'photo-1542291026-7eec264c27ff', tag: 'Baskets running', price: '32 000 FCFA', chip: 'En stock', chipCls: 'bg-emerald-400/90 text-emerald-950', delay: 0 },
    { img: 'photo-1515562141207-7a88fb7ce338', tag: 'Collier or fin', price: '45 000 FCFA', chip: 'Bijoux', chipCls: 'bg-purple-400/90 text-purple-950', delay: 0.12 },
    { img: 'photo-1524758631624-e2822e304c36', tag: 'Canapé 3 places', price: '185 000 FCFA', chip: 'Maison', chipCls: 'bg-amber-400/90 text-amber-950', delay: 0.24 },
    { img: 'photo-1505740420928-5e560c06d30e', tag: 'Casque Bluetooth', price: '28 500 FCFA', chip: 'Tech', chipCls: 'bg-sky-400/90 text-sky-950', delay: 0.36 },
  ];
  return (
    <section className="panel-dark grain relative overflow-hidden">
      <div className="orb -top-40 left-1/4 h-96 w-96 bg-orange-600/30" />
      <div className="orb top-40 -right-32 h-96 w-96 bg-amber-500/20" />
      <div className="orb -bottom-48 left-10 h-80 w-80 bg-red-600/15" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="fade-up">
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold text-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            🇨🇮 La plateforme n°1 en Côte d'Ivoire
          </span>

          <h1 className="mt-7 text-[2.75rem] font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.1rem]">
            Créez votre boutique en ligne{' '}
            <em className="font-display font-semibold grad-text not-italic">en 5 minutes</em>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
            Boutique premium, <strong className="font-semibold text-gray-200">Orange Money, MTN MoMo &amp; Wave</strong> intégrés,
            livraison dans tout le pays. Lancez votre business sans coder, sans carte bancaire.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn-premium group rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-glow-orange">
              Créer ma boutique — gratuit
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a href="#demas" className="glass rounded-2xl px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10">
              Voir les démos
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-white/10 pt-7">
            {[
              [stats.shops, 'boutiques créées'],
              [stats.products, 'produits en ligne'],
              [stats.cities, 'villes livrées'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-semibold text-white">{n}+</div>
                <div className="mt-0.5 text-xs font-medium uppercase tracking-widest text-gray-500">{l}</div>
              </div>
            ))}
            <div className="hidden items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 sm:flex">
              <span className="text-lg">🛡️</span>
              <span className="text-xs font-bold text-emerald-300">Paiements 100% sécurisés</span>
            </div>
          </div>
        </div>

        {/* Collage de cartes boutique */}
        <div className="relative fade-up" style={{ animationDelay: '.15s' }}>
          <div className="grid grid-cols-2 gap-5 lg:pr-2">
            {cards.map((c, i) => (
              <div
                key={c.tag}
                className={`card-premium glass overflow-hidden rounded-3xl ${i % 2 === 1 ? 'lg:mt-10' : ''}`}
                style={{ animationDelay: `${c.delay}s` }}
              >
                <div className="relative">
                  <Img src={`https://images.unsplash.com/${c.img}?w=700&q=80&auto=format&fit=crop`} alt={c.tag} className="aspect-[4/3] w-full object-cover" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black ${c.chipCls}`}>{c.chip}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="truncate text-xs font-bold text-white">{c.tag}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black text-amber-300">{c.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-2xl bg-white p-2 shadow-2xl shadow-black/40">
            {[['🟠', '#ff7900', 'Orange Money'], ['🟡', '#ffcc00', 'MTN MoMo'], ['🔵', '#1dc4ff', 'Wave']].map(([icon, color, name]) => (
              <span key={name} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-black" style={{ background: `${color}18`, color }}>
                {icon} {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau défilant */}
      <div className="relative border-t border-white/10 py-4">
        <div className="overflow-hidden">
          <div className="flex w-max animate-[ticker_32s_linear_infinite] gap-10 whitespace-nowrap px-5 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex gap-10">
                {['Orange Money', 'MTN Mobile Money', 'Wave', 'Livraison Abidjan 24h', 'Sous-domaine gratuit', 'FCFA', '10 thèmes premium', 'Support WhatsApp'].map((x) => (
                  <span key={x} className="flex items-center gap-10">
                    {x} <span className="text-orange-500/60">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SECTION HEAD ================= */
export function SectionHead({ eyebrow, title, text, dark }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] ${dark ? 'glass text-amber-300' : 'bg-orange-50 text-orange-600'}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {eyebrow}
      </span>
      <h2 className={`font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-[#141210]'}`}>{title}</h2>
      {text && <p className={`mt-5 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{text}</p>}
    </div>
  );
}

/* ================= FONCTIONNALITÉS ================= */
export function Features() {
  const list = [
    { icon: '🏬', title: 'Boutique premium', text: 'Un site e-commerce magnifique et complet, prêt en quelques clics.', grad: 'from-orange-500 to-amber-500' },
    { icon: '📱', title: 'Paiements mobiles', text: 'Orange Money, MTN MoMo et Wave intégrés pour encaisser partout.', grad: 'from-amber-500 to-yellow-500' },
    { icon: '🎨', title: '10 thèmes premium', text: 'Sport, mode, beauté, high-tech… une maquette adaptée à votre secteur.', grad: 'from-fuchsia-500 to-purple-500' },
    { icon: '🚚', title: 'Livraison simplifiée', text: 'Zones Abidjan et intérieur du pays avec calcul automatique des frais.', grad: 'from-emerald-500 to-green-600' },
    { icon: '📊', title: 'Pilotage complet', text: 'Tableau de bord, produits, stocks, commandes et statistiques.', grad: 'from-blue-500 to-indigo-500' },
    { icon: '🌍', title: 'Sous-domaine offert', text: 'votreboutique.laboutique.ci offert, domaine à brancher ensuite.', grad: 'from-rose-500 to-pink-500' },
  ];
  return (
    <section id="fonctionnalites" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead
        eyebrow="Fonctionnalités"
        title="Tout pour vendre en ligne en Côte d'Ivoire"
        text="De la création de votre boutique à la livraison du colis, nous nous occupons de tout."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f, i) => (
          <div key={f.title} className="card-premium group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-100/60 opacity-0 blur-2xl transition group-hover:opacity-100" />
            <div className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ${f.grad}`} style={{ width: 52, height: 52 }}>
              {f.icon}
            </div>
            <h3 className="text-lg font-black text-[#141210]">{f.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-gray-500">{f.text}</p>
            <span className="mt-5 block h-1 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 group-hover:w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= THÈMES ================= */
export function ThemesGallery({ themes }) {
  return (
    <section id="themes" className="panel-dark grain relative overflow-hidden py-24">
      <div className="orb -top-32 right-1/4 h-80 w-80 bg-orange-600/20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          dark
          eyebrow="Thèmes premium"
          title="10 maquettes ultra soignées"
          text="Chaque thème possède sa palette, sa typographie et ses images — choisissez celui qui vous ressemble."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {themes.map((t, i) => (
            <a key={t.id} href={`/s/${t.demoShopSlug}`} target="_blank" rel="noreferrer" className="card-premium glass group overflow-hidden rounded-3xl" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="relative h-48 overflow-hidden">
                <Img src={t.hero} alt={t.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 rounded-full border border-white/40" style={{ background: t.colors.p }} />
                    <span className="h-2 w-2 rounded-full border border-white/40" style={{ background: t.colors.p2 }} />
                    <span className="h-2 w-2 rounded-full border border-white/40" style={{ background: t.colors.p3 }} />
                  </span>
                  {t.sector}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-white">{t.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-400">{t.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 transition-all group-hover:gap-2.5">
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

/* ================= DÉMOS ================= */
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
    <button onClick={clone} disabled={busy} className="btn-premium inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-black text-white shadow-glow-orange disabled:opacity-60">
      {busy ? <Spinner className="h-3.5 w-3.5" /> : '✨'} {children || 'Utiliser cette boutique'}
    </button>
  );
}

export function DemosSection({ shops, compact }) {
  const list = compact ? shops.slice(0, 6) : shops;
  return (
    <section id="demas" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead
        eyebrow="Démonstrations"
        title="Boutiques prêtes à l'emploi"
        text="Des boutiques 100% configurées avec produits, images et bannières. Cliquez, c'est la vôtre."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <div key={s.id} className="card-premium group overflow-hidden rounded-3xl border border-gray-100 bg-white" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="relative h-52 overflow-hidden bg-gray-100">
              <Img src={s.hero} alt={s.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-gray-700 backdrop-blur">{s.themeName}</span>
              <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">⭐ 4,8</span>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white drop-shadow">{s.name}</h3>
                  <p className="text-xs font-semibold text-white/75">{s.productCount} produits</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">💰 {formatFCFA(s.topPrice)}</span>
              <div className="flex gap-2">
                <a href={`/s/${s.slug}`} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-600 transition hover:border-gray-900 hover:text-gray-900">
                  Visiter
                </a>
                <CloneButton shop={s} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {compact && (
        <div className="mt-12 text-center">
          <a href="/demos" className="btn-premium inline-flex items-center gap-2 rounded-2xl bg-[#141210] px-8 py-4 text-sm font-black text-white transition hover:bg-black">
            Voir les 10 boutiques démo
            <span className="text-amber-400">→</span>
          </a>
        </div>
      )}
    </section>
  );
}

/* ================= COMMENT ÇA MARCHE ================= */
export function HowItWorks() {
  const steps = [
    { n: '01', t: 'Créez votre compte', d: 'Inscription gratuite en 30 secondes avec votre nom, email et téléphone.', icon: '👤' },
    { n: '02', t: 'Choisissez votre thème', d: '10 maquettes premium ou 10 boutiques prêtes à l\'emploi, clonées en 1 clic.', icon: '🎨' },
    { n: '03', t: 'Vendez et encaissez', d: 'Partagez votre lien, encaissez via Mobile Money et suivez vos commandes.', icon: '🚀' },
  ];
  return (
    <section className="panel-dark grain relative overflow-hidden py-24">
      <div className="orb -bottom-40 left-1/3 h-96 w-96 bg-amber-500/15" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead dark eyebrow="Comment ça marche ?" title="Votre boutique en 3 étapes" />
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-orange-500/50 via-amber-400/50 to-orange-500/50 md:block" />
          {steps.map((s, i) => (
            <div key={s.n} className="fade-up relative text-center md:px-6" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-3xl shadow-glow-orange">
                {s.icon}
              </div>
              <div className="font-display mt-5 text-5xl font-semibold text-white/10">{s.n}</div>
              <h3 className="-mt-4 text-lg font-black text-white">{s.t}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-400">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TÉMOIGNAGES ================= */
export function Testimonials({ items }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Témoignages" title="Ils ont lancé leur boutique" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <figure key={t.name} className="card-premium relative rounded-3xl border border-gray-100 bg-white p-8" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="font-display absolute right-7 top-5 text-6xl leading-none text-orange-100">”</span>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((x) => <span key={x}>★</span>)}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-gray-600">“{t.text}”</blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5 border-t border-gray-50 pt-5">
              <span className="rounded-full bg-gradient-to-br from-orange-500 to-amber-400 p-0.5">
                <Img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              </span>
              <div>
                <div className="text-sm font-black text-[#141210]">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ================= FAQ ================= */
export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-[#faf7f2] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow="FAQ" title="Questions fréquentes" />
        <div className="mt-12 space-y-3">
          {items.map((f, i) => (
            <div key={i} className={`overflow-hidden rounded-2xl border transition ${open === i ? 'border-orange-200 bg-white shadow-lg shadow-orange-500/5' : 'border-gray-100 bg-white/70'}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-bold text-[#141210]">{f.q}</span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition-all duration-300 ${open === i ? 'rotate-45 bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              {open === i && <p className="fade-in border-t border-gray-50 px-6 py-4 text-sm leading-relaxed text-gray-500">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
export function LandingCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="panel-dark grain relative overflow-hidden rounded-[2.5rem] px-8 py-20 text-center">
        <div className="orb -top-24 left-1/4 h-72 w-72 bg-orange-600/35" />
        <div className="orb -bottom-28 right-1/4 h-72 w-72 bg-amber-500/25" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="relative mx-auto max-w-2xl">
          <span className="glass inline-block rounded-full px-4 py-2 text-xs font-bold text-amber-200">🚀 Démarrez aujourd'hui</span>
          <h2 className="font-display mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Prêt à lancer votre <span className="grad-text">business en ligne</span> ?
          </h2>
          <p className="mt-5 text-gray-400">Rejoignez les centaines de commerçants ivoiriens qui vendent déjà sur LaBoutique.ci.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-premium rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-9 py-4 text-sm font-black text-white shadow-glow-orange">
              Créer ma boutique gratuitement
            </Link>
            <Link href="/login" className="glass rounded-2xl px-9 py-4 text-sm font-bold text-white transition hover:bg-white/10">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
export function LandingFooter() {
  return (
    <footer className="panel-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-glow-orange">🛍️</span>
              <span className="text-lg font-extrabold text-white">LaBoutique<span className="grad-text">.ci</span></span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-500">
              La plateforme SaaS e-commerce n°1 en Côte d'Ivoire. Boutique premium, paiements mobiles et livraison dans tout le pays.
            </p>
            <div className="mt-5 flex gap-2">
              {[['🟠', '#ff7900'], ['🟡', '#ffcc00'], ['🔵', '#1dc4ff']].map(([e, c], i) => (
                <span key={i} className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: `${c}18`, border: `1px solid ${c}35` }}>{e}</span>
              ))}
            </div>
          </div>
          {[
            ['Produit', [['#fonctionnalites', 'Fonctionnalités'], ['#themes', 'Thèmes premium'], ['#demas', 'Boutiques démo'], ['#faq', 'FAQ']]],
            ['Compte', [['/register', 'Créer un compte'], ['/login', 'Se connecter'], ['/dashboard', 'Mon dashboard'], ['/admin', 'Espace admin']]],
            ['Contact', [['mailto:contact@laboutique.ci', 'contact@laboutique.ci'], ['tel:+2250700000000', '+225 07 00 00 00 00'], ['/demos', 'Voir les démos'], ['#', 'Abidjan, Côte d\'Ivoire']]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{title}</h4>
              <ul className="mt-5 space-y-3">
                {links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-gray-400 transition hover:text-amber-300">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-gray-600 sm:flex-row">
          <span>© {new Date().getFullYear()} LaBoutique.ci — Fait avec ❤️ à Abidjan</span>
          <span className="flex items-center gap-2">
            Photos : Unsplash · Paiements simulés en démo · Images libres de droits
          </span>
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