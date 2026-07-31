import { db } from '@/lib/store';
import {
  LandingNav, LandingHero, Features, ThemesGallery, DemosSection,
  HowItWorks, Testimonials, Faq, LandingCta, LandingFooter,
} from '@/components/landing';
const Hero = LandingHero;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await db();
  const settings = data.settings?.landing;
  const themes = data.themes.map((t) => ({
    id: t.id, name: t.name, tagline: t.tagline, sector: t.sector,
    colors: t.colors, hero: t.hero,
    demoShopSlug: data.shops.find((s) => s.themeKey === t.key)?.slug || '',
  }));
  const shops = data.shops
    .filter((s) => s.demo)
    .map((s) => ({
      id: s.id, slug: s.slug, name: s.name, hero: s.hero,
      themeName: data.themes.find((t) => t.key === s.themeKey)?.name || s.themeKey,
      productCount: s.products.length,
      topPrice: Math.max(...s.products.map((p) => p.price)),
    }));

  return (
    <main>
      <LandingNav />
      <Hero stats={{ shops: 120, products: 4200, cities: 32 }} />
      <Features />
      <ThemesGallery themes={themes} />
      <DemosSection shops={shops} compact />
      <HowItWorks />
      <Testimonials items={settings?.testimonials || []} />
      <Faq items={settings?.faq || []} />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}