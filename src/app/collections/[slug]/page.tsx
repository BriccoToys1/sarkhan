import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { AmbientButton } from "@/components/collections/AmbientButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { getCollection, getCollections } from "@/lib/data";
import { TYPE_LABELS } from "@/lib/labels";
import { Markdown } from "@/lib/markdown";
import type { ProductType } from "@/lib/types";

const GROUP_ORDER: ProductType[] = ["ORIGINAL", "DECK", "PRINT", "BOOK", "ACCESSORY"];

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return { title: "Коллекция не найдена" };
  return { title: `Коллекция «${data.collection.title}»`, description: data.collection.excerpt, alternates: { canonical: `/collections/${slug}` } };
}

export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80vh] animate-pulse bg-abyss" />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();
  const { collection, products } = data;
  const groups = GROUP_ORDER.map((type) => ({ type, items: products.filter((p) => p.type === type) })).filter((g) => g.items.length > 0);

  return (
    <>
      <section className="relative flex min-h-[86svh] items-end overflow-hidden">
        <ArtImage src={collection.coverImage} alt="" fill sizes="100vw" className="object-cover" preload />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/20" />
        <AmbientButton className="absolute right-6 top-28 z-10" track={{ id: `collection-${collection.slug}`, title: collection.title, preset: collection.ambientPreset, url: collection.ambientUrl }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20">
          <Link href="/collections" className="mb-8 inline-flex items-center gap-1 font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold hover:text-parchment">
            <ChevronLeft className="h-3 w-3" /> Все коллекции
          </Link>
          {collection.era && <p className="font-display text-xs tracking-[0.4em] text-gold/70">{collection.era}</p>}
          <h1 className="mt-3 font-serif text-5xl font-semibold uppercase tracking-[0.08em] text-parchment sm:text-7xl">{collection.title}</h1>
          {collection.subtitle && <p className="mt-3 font-serif text-2xl italic text-gold/80">{collection.subtitle}</p>}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-12 font-serif text-2xl italic leading-relaxed text-gold/85">{collection.excerpt}</p>
        <div className="space-y-6 font-serif text-xl leading-relaxed text-parchment/85">
          <Markdown source={collection.lore} dropCap />
        </div>
        <Vignette className="mt-20" />
      </article>

      <div className="mx-auto max-w-7xl space-y-24 px-6 pb-32">
        {groups.map((g) => (
          <section key={g.type}>
            <h2 className="mb-10 flex items-center gap-6 font-serif text-2xl uppercase tracking-[0.18em] text-parchment">
              {TYPE_LABELS[g.type]} <span className="hairline flex-1" />
            </h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {g.items.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && <p className="text-center font-serif text-xl italic text-ash">Артефакты этой вселенной ещё созревают в мастерской.</p>}
      </div>
    </>
  );
}
