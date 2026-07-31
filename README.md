# 🛍️ LaBoutique.ci — Plateforme SaaS e-commerce multi-tenant pour la Côte d'Ivoire

Plateforme SaaS complète : un site vitrine où l'on s'inscrit, un **dashboard client** pour créer sa boutique premium (10 thèmes) ou cloner une **boutique démo prête à l'emploi**, des **boutiques e-commerce dynamiques** accessibles via slug (`laboutique.ci/ma-boutique`), un tunnel de commande avec **paiement Mobile Money simulé** (Orange Money, MTN MoMo, Wave), et un **panel super admin**.

> 🇨🇮 Monnaie **FCFA** · Langue FR (par défaut) / EN · Moyens de paiement ivoiriens · Livraison zones Abidjan / intérieur du pays

---

## ✨ Fonctionnalités

### Site vitrine (`/`)
- Hero, fonctionnalités, galerie des **10 thèmes premium**, aperçu des **10 boutiques démo**, témoignages, FAQ, CTA.
- Inscription (nom, email, mot de passe, téléphone), connexion sécurisée, **réinitialisation de mot de passe** (lien par email simulé).
- Contenu du site éditable depuis le panel admin (hero, fonctionnalités, témoignages, FAQ).

### Dashboard client (`/dashboard`)
- Statistiques (boutiques, produits, commandes, revenus, visites) + dernières commandes.
- **Assistant de création en 3 étapes** : ① choisir un thème → ② personnaliser (nom, slogan, logo, palette de couleurs ou couleurs custom, police, mise en page de l'accueil, bannière, langue FR/EN, aperçu en direct) → ③ importer les produits de démo du thème ou démarrer vide.
- **Boutiques prêtes à l'emploi** : 10 boutiques démo clonables en 1 clic (produits, images, bannières, pages incluses).
- Gestion des produits (CRUD complet : images, prix, promo, stock, variantes taille/couleur, catégories, import démo du thème).
- Commandes : liste filtrable, détail, changement de statut (préparation → expédiée → livrée), **export CSV**.
- Messages reçus du formulaire de contact (lu / non lu, suppression).
- Paramètres : identité, couleurs/police/layout, **moyens de paiement activables** (Orange Money, MTN MoMo, Wave, paiement à la livraison), zones de livraison + retrait magasin + livraison offerte, pages À propos/CGV, **nom de domaine personnalisé**, réseaux sociaux & contact.
- Support (FAQ + ticket), compte (profil, mot de passe), **mode sombre/clair**.

### Boutiques clients (`/s/[slug]`)
- **10 thèmes appliqués dynamiquement** (palette, police, layout stockés en base) : Sport, Tech, Mode & Luxe, Beauté, Maison, Alimentation, Enfants, Bijoux, Art, Fitness.
- Accueil (3 variantes de hero), catalogue avec **recherche + filtres** (catégorie, prix min/max, slider, stock) + tri + pagination, fiche produit (galerie d'images, zoom, variantes, quantité, avis, **partage WhatsApp/Facebook/X**), panier (tiroir + page), **tunnel de commande complet**, **paiement simulé** Orange Money / MTN MoMo / Wave (code démo `1234`), confirmation, **suivi de commande** avec timeline, pages À propos / Contact (formulaire fonctionnel) / CGV, newsletter.
- Bascule de langue **FR/EN** en 1 clic.

### Panel super admin (`/admin`)
- Connexion distincte (`admin@laboutique.ci` / `admin123`).
- Statistiques globales (clients, boutiques, produits, commandes, revenus, visites, top boutiques, derniers tickets).
- Gestion des **clients** (liste, suppression) et des **boutiques** (liste, suppression).
- **CRUD des thèmes premium** (création, édition palette/police/layouts/catégories/images, suppression sécurisée).
- **Gestion des contenus de la page d'accueil** (hero, fonctionnalités, témoignages, FAQ).

---

## 🚀 Installation & lancement (local)

Prérequis : **Node.js 18.17+** (testé sous Node 24).

```bash
# 1. Installer les dépendances
npm install

# 2. Générer la base de données de démonstration (optionnel : auto-générée au 1er lancement)
npm run seed

# 3. Lancer en développement
npm run dev            # → http://localhost:3000

# Production
npm run build && npm start
```

> 💡 Si le port 3000 est occupé : `npm run dev -- -p 3100`

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Client (10 boutiques démo) | `demo@laboutique.ci` | `demo123` |
| Super admin | `admin@laboutique.ci` | `admin123` |

### Parcours de test rapide

1. **`/`** — page vitrine, parcourez les thèmes et démos.
2. **`/s/sportiva`** (ou tout autre slug) — boutique démo complète : ajoutez au panier → checkout → payez avec **Orange Money/MTN/Wave** (numéro quelconque, code **1234**).
3. **`/dashboard`** — connectez-vous avec le compte démo : statistiques, commandes, produits, paramètres.
4. **`/dashboard/shops/new`** — assistant 3 étapes ; ou `/dashboard/templates` → « Utiliser » pour cloner une boutique démo.
5. **`/admin`** — panel super admin.

---

## 🗄️ Architecture

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS, mobile-first, composants réutilisables (`components/`).
- **Backend** : API Routes (`app/api/**`) — couche de données `lib/store.js` (fichier JSON `data/db.json`, remplaçable par Supabase/PostgreSQL).
- **Auth** : sessions par cookie signé en base (bcryptjs), rôles `client` / `admin`.
- **Images** : vraies photos **Unsplash** (voir `CREDITS.md`), upload local possible (`/api/upload` → `public/uploads`).
- **Paiements** : simulation complète avec callbacks (code démo `1234`), emails simulés (`lib/mail.js`, visible dans la console du terminal).
- **Thèmes** : configuration (palette, police, hero, layouts, catégories) stockée **en base de données**, appliquée par variables CSS (`--p`, `--p2`, `--p3`, `--font`).

```
app/            pages & API routes
components/     UI partagés, landing, dashboard, boutique, admin
lib/            store (db.json), auth, seed + données (thèmes, images, produits), mail, money, i18n
data/db.json    base de données locale (générée par npm run seed)
scripts/seed.js bootstrap de la base
public/uploads  images importées
```

---

## 🧪 Tests rapides

- Toutes les routes répondent en HTTP 200 (testées en build production).
- Parcours paiement vérifié : commande `awaiting_payment` → payée avec le code `1234` → refus d'un second paiement.
- Clone de boutique démo vérifié : duplication des produits en 1 clic.

## 🔮 Évolutions possibles

- Branchement réel d'Orange Money / MTN MoMo / Wave (API partenaires).
- Migration de `data/db.json` vers Supabase (PostgreSQL + Auth + Storage) — la couche `lib/store.js` est le seul point à remplacer.
- Déploiement Vercel + domaine personnalisé (`settings → Domaine`).
