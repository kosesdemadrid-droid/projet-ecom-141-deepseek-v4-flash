'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { t } from '@/lib/shop-strings';

const ShopCtx = createContext(null);
export const useShop = () => useContext(ShopCtx);

const CART_KEY = (slug) => `lb_cart_${slug}`;

export function ShopProvider({ shop, children }) {
  const pathname = usePathname();
  const [lang, setLangState] = useState(shop.lang || 'fr');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    try {
      setLang(localStorage.getItem(`lb_lang_${shop.slug}`) || shop.lang || 'fr');
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop.slug]);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY(shop.slug)) || '[]'));
    } catch { /* ignore */ }
  }, [shop.slug]);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY(shop.slug), JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart, shop.slug]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(`lb_lang_${shop.slug}`, l); } catch { /* ignore */ }
  }, [shop.slug]);

  const toggleLang = useCallback(() => setLang(lang === 'fr' ? 'en' : 'fr'), [lang, setLang]);

  const toast = useCallback((msg, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((x) => [...x, { id, msg, type }]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((product, variant, qty = 1) => {
    setCart((c) => {
      const key = `${product.id}::${variant || ''}`;
      const found = c.find((i) => i.key === key);
      if (found) {
        return c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...c, { key, id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: product.images?.[0], variant, qty, stock: product.stock }];
    });
    toast(t(lang, 'addedToCart'));
    setCartOpen(true);
  }, [lang, toast]);

  const updateQty = useCallback((key, qty) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const removeItem = useCallback((key) => {
    setCart((c) => c.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  // Visite comptée une fois par session
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(`lb_visit_${shop.slug}`);
      if (!seen) {
        sessionStorage.setItem(`lb_visit_${shop.slug}`, '1');
        fetch(`/api/s/${shop.slug}/visit`, { method: 'POST' }).catch(() => {});
      }
    } catch { /* ignore */ }
  }, [shop.slug]);

  const goSearch = () => {
    if (q.trim()) window.location.href = `/s/${shop.slug}/products?q=${encodeURIComponent(q.trim())}`;
  };

  const value = {
    shop,
    lang,
    t: (k) => t(lang, k),
    setLang,
    toggleLang,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    cartOpen,
    setCartOpen,
    toast,
    q,
    setQ,
    goSearch,
    isShopPath: pathname.startsWith(`/s/${shop.slug}`),
  };

  return (
    <ShopCtx.Provider value={value}>
      {children}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm flex-col gap-2">
        {toasts.map((x) => (
          <div key={x.id} className={`pop rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl ${x.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
            {x.msg}
          </div>
        ))}
      </div>
    </ShopCtx.Provider>
  );
}

export function CartDrawer({ onClose }) {
  const { cart, cartTotal, updateQty, removeItem, t, shop } = useShop();
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/50 fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl slideRight dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h3 className="font-bold">{t('cart')} ({cart.length})</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl">🛒</div>
              <p className="mt-3 text-sm text-gray-400">{t('emptyCart')}</p>
              <button onClick={onClose} className="mt-4 rounded-xl bg-p px-5 py-2.5 text-xs font-bold text-white">{t('continueShopping')}</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((i) => (
                <div key={i.key} className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{i.name}</div>
                    {i.variant && <div className="text-xs text-gray-400">{i.variant}</div>}
                    <div className="mt-1 text-sm font-black text-p">
                      {new Intl.NumberFormat('fr-FR').format(i.price)} FCFA
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQty(i.key, i.qty - 1)} className="h-7 w-7 rounded-lg border border-gray-200 text-xs font-bold dark:border-gray-700">−</button>
                      <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                      <button onClick={() => updateQty(i.key, i.qty + 1)} className="h-7 w-7 rounded-lg border border-gray-200 text-xs font-bold dark:border-gray-700">+</button>
                      <button onClick={() => removeItem(i.key)} className="ml-auto text-xs text-gray-400 hover:text-red-500">{t('remove')}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex justify-between text-sm font-bold">
              <span>{t('total')}</span>
              <span>{new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA</span>
            </div>
            <a href={`/s/${shop.slug}/checkout`} className="mt-3 block rounded-xl bg-p py-3.5 text-center text-sm font-bold text-white shadow-brand transition hover-bright">
              {t('checkout')} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}