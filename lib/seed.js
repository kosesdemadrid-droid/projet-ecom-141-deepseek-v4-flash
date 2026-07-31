/**
 * GÉNÉRATEUR DE BASE DE DONNÉES INITIALE.
 * Crée : comptes (admin + démo), 10 thèmes, 10 boutiques de démonstration
 * avec 20-30 produits chacune, avis clients, commandes et contenus statiques.
 */
import bcrypt from 'bcryptjs';
import {
  THEME_DEFS, DEMO_SHOPS, IMG, REVIEW_NAMES, REVIEW_COMMENTS,
  SIZE_VARIANTS, COLORS, LANDING_DEFAULTS,
} from './seed-data.js';
import { uid, slugify } from './store.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const round500 = (n) => Math.round(n / 500) * 500;

const THEME_SECTORS = Object.fromEntries(THEME_DEFS.map((t) => [t.key, t]));

const sizeCategories = ['sportswear', 'fashion', 'kids'];
const colorCategories = ['shoes', 'bags', 'watches', 'jewelry', 'rings', 'earrings', 'cosmetics', 'skincare', 'perfume', 'toys', 'epicerie', 'sweet', 'nutrition'];

function generateProducts(themeKey, per = rand(22, 28)) {
  const theme = THEME_SECTORS[themeKey];
  const products = [];
  const names = [];
  theme.categories.forEach((cat) => cat.labels.forEach((l) => names.push({ cat, name: l })));
  const shuffled = [...names].sort(() => Math.random() - 0.5).slice(0, per);
  shuffled.forEach(({ cat, name }, i) => {
    const price = round500(rand(cat.prices[0], cat.prices[1]));
    const pool = IMG[cat.key] || IMG.fashion;
    const imgs = [pool[i % pool.length], pool[(i + 3) % pool.length], pool[(i + 5) % pool.length]];
    const hasSize = sizeCategories.includes(cat.key);
    const hasColor = colorCategories.includes(cat.key);
    const variants = [];
    if (hasSize) SIZE_VARIANTS.slice(0, rand(3, 5)).forEach((s) => variants.push({ type: 'Taille', value: s }));
    if (hasColor) [...new Set([pick(COLORS), pick(COLORS)])].forEach((c) => variants.push({ type: 'Couleur', value: c }));
    products.push({
      id: uid(),
      name,
      slug: slugify(name),
      description: `${cat.desc} ${name} — conçu pour durer et livré partout en Côte d'Ivoire.`,
      price,
      oldPrice: Math.random() < 0.35 ? round500(price * 1.25) : null,
      images: imgs,
      category: cat.name,
      stock: rand(3, 60),
      variants,
      createdAt: new Date(Date.now() - rand(1, 90) * 86400000).toISOString(),
      sold: rand(0, 40),
    });
  });
  return products;
}

function generateReviews(products) {
  products.forEach((p) => {
    const n = rand(0, 3);
    for (let i = 0; i < n; i++) {
      p.reviews = p.reviews || [];
      p.reviews.push({
        id: uid(),
        name: pick(REVIEW_NAMES),
        rating: rand(4, 5),
        comment: pick(REVIEW_COMMENTS),
        date: new Date(Date.now() - rand(2, 60) * 86400000).toISOString(),
      });
    }
  });
}

const ABOUT_TMPL = (name) => [
  `Bienvenue chez ${name} !`,
  `Basé à Abidjan, ${name} vous propose une sélection rigoureuse de produits de qualité, choisis pour répondre aux besoins et aux goûts de notre clientèle ivoirienne.\n\nNotre mission : rendre vos achats simples, rapides et sécurisés, avec un paiement mobile money, une livraison dans tout le pays et un service client attentif.\n\nMerci de votre confiance !`,
];

const TERMS_TMPL = [
  '1. Commandes — Toute commande est confirmée après paiement ou à la livraison.\n2. Paiements — Orange Money, MTN MoMo, Wave et espèces à la livraison.\n3. Livraison — Abidjan sous 24-48h, intérieur du pays sous 2-4 jours.\n4. Retours — 7 jours après réception pour les produits non utilisés.\n5. Contact — support@laboutique.ci',
];

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

function generateOrders(shop, products) {
  const orders = [];
  const n = rand(3, 7);
  for (let i = 0; i < n; i++) {
    const itemCount = rand(1, 3);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const p = pick(products);
      items.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0],
        quantity: rand(1, 3),
      });
    }
    const zone = shop.delivery.zones[rand(0, shop.delivery.zones.length - 1)];
    const sub = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingFee = sub >= 50000 && zone.name === 'Abidjan' ? 0 : zone.fee;
    const paid = i % 4 !== 3;
    orders.push({
      id: uid(),
      ref: `CMD-${Date.now().toString().slice(-6)}-${rand(100, 999)}`,
      items,
      subtotal: sub,
      shippingFee,
      total: sub + shippingFee,
      customer: {
        name: pick(REVIEW_NAMES),
        phone: `07 ${rand(0, 9)} ${rand(10, 99)} ${rand(10, 99)} ${rand(10, 99)}`,
        city: pick(['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Korhogo']),
        address: pick(['Rue des Jardins', 'Zone 4', 'Cocody Angré', 'Marcory Résidentiel', 'Bingerville']),
      },
      zone: zone.name,
      deliveryMethod: Math.random() < 0.2 ? 'pickup' : 'delivery',
      paymentMethod: pick(['orange', 'mtn', 'wave', 'cod']),
      status: paid ? pick(ORDER_STATUSES) : 'awaiting_payment',
      createdAt: new Date(Date.now() - rand(1, 45) * 86400000).toISOString(),
    });
    shop.stats.orders++;
    shop.stats.revenue += orders[orders.length - 1].total;
  }
  return orders;
}

export async function seedDatabase() {
  const now = new Date().toISOString();

  const admin = {
    id: uid(), name: 'Super Admin', email: 'admin@laboutique.ci',
    phone: '07 00 00 00 00', password: bcrypt.hashSync('admin123', 10),
    role: 'admin', createdAt: now,
  };
  const demo = {
    id: uid(), name: 'Démo Client', email: 'demo@laboutique.ci',
    phone: '07 07 07 07 07', password: bcrypt.hashSync('demo123', 10),
    role: 'client', createdAt: now,
  };

  const themes = THEME_DEFS.map((t) => ({
    id: uid(),
    key: t.key,
    name: t.name,
    tagline: t.tagline,
    sector: t.sector,
    colors: t.colors,
    font: t.font,
    hero: t.hero,
    layouts: t.layouts,
    categories: t.categories.map((c) => ({ name: c.name, key: c.key })),
    featured: true,
    createdAt: now,
  }));

  const shops = DEMO_SHOPS.map((ds) => {
    const theme = THEME_SECTORS[ds.theme];
    const products = generateProducts(ds.theme);
    generateReviews(products);
    const shop = {
      id: uid(),
      ownerId: demo.id,
      slug: ds.slug,
      name: ds.name,
      tagline: ds.tagline,
      slogan: ds.tagline,
      themeKey: ds.theme,
      colors: { ...theme.colors },
      font: theme.font,
      hero: theme.hero,
      layout: theme.layouts[0],
      logo: null,
      lang: 'fr',
      pages: {
        about: ABOUT_TMPL(ds.name),
        terms: TERMS_TMPL,
      },
      payments: { orange: true, mtn: true, wave: true, cod: true },
      delivery: {
        zones: [
          { name: 'Abidjan', fee: 1500 },
          { name: 'Intérieur du pays', fee: 3000 },
        ],
        pickup: true,
        freeOver: 50000,
      },
      customDomain: '',
      social: { whatsapp: '', facebook: '', twitter: '' },
      contacts: { email: 'contact@' + ds.slug + '.ci', address: 'Abidjan, Côte d\'Ivoire' },
      stats: { visits: rand(120, 900), orders: 0, revenue: 0 },
      products,
      orders: [],
      messages: [],
      subscribers: [],
      createdAt: now,
      updatedAt: now,
      demo: true,
    };
    shop.orders = generateOrders(shop, products);
    shop.stats.visits += shop.orders.length * 12;
    return shop;
  });

  const db = {
    users: [admin, demo],
    sessions: [],
    themes,
    shops,
    tickets: [],
    settings: {
      landing: LANDING_DEFAULTS,
      contact: { email: 'contact@laboutique.ci', phone: '+225 07 00 00 00 00' },
    },
    seededAt: now,
  };
  return db;
}