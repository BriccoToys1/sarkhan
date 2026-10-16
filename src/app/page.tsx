import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Oracle } from "@/components/home/Oracle";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Manifesto } from "@/components/home/Manifesto";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductCard } from "@/components/shop/ProductCard";
import { btnLink } from "@/components/ui/buttons";
import { getCollections, getFeaturedProducts, getOracleCards, getProduct } from "@/lib/data";

const FLAGSHIP = "shadow-of-lilith-tarot";

export default async function HomePage() {
  const [cards, featured, flagship, collections] = await Promise.all([getOracleCards(), getFeaturedProducts(4), getProduct(FLAGSHIP), getCollections()]);
  const flagshipCollection = collections.find((c) => c.slug === flagship?.collection?.slug) ?? null;

  return (
    <>
      <Hero videoUrl={process.env.NEXT_PUBLIC_HERO_VIDEO_URL || undefined} posterUrl={process.env.NEXT_PUBLIC_HERO_POSTER_URL || undefined} />
      <Oracle cards={cards} />
      {flagship && <FeaturedCollection product={flagship} collection={flagshipCollection} />}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-t border-gold/10 pt-16 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-3 block">Избранные артефакты</span>
            <h2 className="font-serif text-3xl font-semibold uppercase tracking-[0.12em] text-parchment sm:text-4xl">Из сокровищницы мастерской</h2>
          </div>
          <Link href="/shop" className={btnLink}>
            Весь каталог <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      <Manifesto />
      <Newsletter />
    </>
  );
}
