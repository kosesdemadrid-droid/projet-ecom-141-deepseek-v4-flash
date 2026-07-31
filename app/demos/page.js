import { db } from '@/lib/store';
import { LandingNav, DemosSection, SectionHead, LandingFooter } from '@/components/landing';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Boutiques de démonstration' };

export default async function DemosPage() {
  const data = await db();
  const shops = data.shops
    .filter((s) => s.demo)
    .map((s) => ({
      id: s.id, slug: s.slug, name: s.name, hero: s.hero,
      themeName: data.themes.find((t) => t.key === s.themeKey)?.name || s.themeKey,
      productCount: s.products.length,
      topPrice: Math.max(...s.products.map((p) => p.price)),
    }));
  return (
    <main className="min-h-screen bg-white">
      <LandingNav />
      <div className="bg-[#fff7ec] py-14 text-center">
        <SectionHead eyebrow="10 boutiques prêtes à l'emploi" title="Choisissez, c'est la vôtre" text="Chaque boutique démo est entièrement configurée : produits, images, bannières et pages. Un clic pour la dupliquer dans votre espace." />
      </div>
      <DemosSection shops={shops} />
      <LandingFooter />
    </main>
  );
}