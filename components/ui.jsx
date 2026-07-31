'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/** Image avec repli automatique en cas d'échec de chargement */
export function Img({ src, fallback, alt = '', className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const f = fallback || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&auto=format&fit=crop';
  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={f} alt={alt} className={className} {...props} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" {...props} />;
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pop flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl ${
              t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {t.type === 'error' ? '!' : '✓'}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 fade-in" onClick={onClose} />
      <div className={`pop relative w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[88vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Btn({ children, loading, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function EmptyState({ icon = '📦', title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 px-6 py-14 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}
      aria-pressed={checked}
    >
      <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5.5' : 'translate-x-1'}`} style={{ width: 18, height: 18, transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </button>
  );
}

export function Stars({ value, size = 14, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(i)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(value) ? '#f59e0b' : '#e5e7eb'} stroke="#f59e0b" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ---------- Sélecteur d'image (Unsplash / URL / Upload) ---------- */
import { IMG } from '@/lib/seed-data';

export function ImagePicker({ value, onChange }) {
  const [tab, setTab] = useState('unsplash');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const pool = [
    ...new Set([...IMG.fashion, ...IMG.shoes, ...IMG.cosmetics, ...IMG.furniture, ...IMG.food, ...IMG.toys, ...IMG.jewelry, ...IMG.art, ...IMG.fitness, ...IMG.gadgets, ...IMG.portraits]),
  ];
  const upload = async (file) => {
    setBusy(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const j = await res.json();
      if (j.url) onChange(j.url);
      else alert(j.error || 'Échec de l\'upload');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {[
          ['unsplash', 'Photos Unsplash'],
          ['url', 'Lien URL'],
          ['upload', 'Importer'],
        ].map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tab === k ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {l}
          </button>
        ))}
      </div>
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          <button type="button" onClick={() => url && onChange(url)} className="shrink-0 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white">
            OK
          </button>
        </div>
      )}
      {tab === 'upload' && (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-gray-400">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
          <span className="text-2xl">📁</span>
          <span className="text-xs text-gray-500">{busy ? 'Envoi…' : 'Cliquez pour importer une image'}</span>
        </label>
      )}
      {tab === 'unsplash' && (
        <>
          <div className="grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
            {pool.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => onChange(src)}
                className={`relative aspect-square overflow-hidden rounded-lg ring-offset-1 ${value === src ? 'ring-2 ring-gray-900' : 'hover:ring-2 hover:ring-gray-300'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">Images libres de droits — Unsplash.com</p>
        </>
      )}
      {value && (
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu" className="h-16 w-16 rounded-lg object-cover" />
          <button type="button" onClick={() => onChange(null)} className="text-xs font-semibold text-red-600 hover:underline">
            Retirer
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Boutons de partage social ---------- */
export function ShareButtons({ title, url, compact }) {
  const enc = encodeURIComponent;
  const links = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      href: `https://wa.me/?text=${enc(title + ' — ' + url)}`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      name: 'Twitter / X',
      color: '#000000',
      href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ];
  return (
    <div className="flex items-center gap-2">
      {!compact && <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Partager</span>}
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          title={`Partager sur ${l.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:scale-110"
          style={{ backgroundColor: l.color }}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}