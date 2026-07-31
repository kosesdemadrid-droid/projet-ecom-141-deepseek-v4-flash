import { db } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import { formatFCFA } from '@/lib/money';
import { Img } from '@/components/ui';
import { CloneButton } from '@/components/landing';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Boutiques prêtes à l\'emploi' };

export default async function TemplatesPage() {
  const user = await getSessionUser();
  const data = await db();
  const shops = data.shops
    .filter((s) => s.demo)
    .map((s) => ({
      id: s.id, slug: s.slug, name: s.name, hero: s.hero,
      themeName: data.themes.find((t) => t.key === s.themeKey)?.name || s.themeKey,
      tagline: s.tagline,
      productCount: s.products.length,
      topPrice: Math.max(...s.products.map((p) => p.price)),
    }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Boutiques prêtes à l'emploi</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          10 boutiques entièrement configurées (produits, images, bannières, pages). Cliquez sur « Utiliser » : la boutique est dupliquée dans votre espace, puis personnalisez-la à votre guise.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shops.map((s) => (
          <div key={s.id} className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="relative h-44 overflow-hidden">
              <Img src={s.hero} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-700">{s.themeName}</span>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-black text-white drop-shadow">{s.name}</h3>
                <p className="text-xs text-white/80">{s.productCount} produits · jusqu'à {formatFCFA(s.topPrice)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <p className="line-clamp-2 flex-1 text-xs text-gray-500">{s.tagline}</p>
              <div className="flex shrink-0 gap-2">
                <a href={`/s/${s.slug}`} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold text-gray-600 transition hover:border-gray-400 dark:border-gray-700 dark:text-gray-300">
                  Visiter ↗
                </a>
                <CloneButton shop={s}>Utiliser</CloneButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}