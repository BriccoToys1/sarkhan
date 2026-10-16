"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ArtImage } from "@/components/ui/ArtImage";
import { btnGhost, btnPrimary } from "@/components/ui/buttons";
import { useQuickView } from "@/components/providers/QuickView";
import { formatPrice } from "@/lib/format";
import type { CollectionDTO, ProductDTO } from "@/lib/types";

/** Асимметричный блок флагманского продукта: крупные фото и манифест создания колоды. */
export function FeaturedCollection({ product, collection }: { product: ProductDTO; collection: CollectionDTO | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [140, -120]);
  const yCover = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const quickView = useQuickView();

  return (
    <section ref={ref} className="relative overflow-hidden py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-7">
          {collection && (
            <motion.div style={{ y: yCover }} className="absolute -left-24 -top-16 hidden aspect-[16/10] w-[78%] opacity-35 lg:block">
              <ArtImage src={collection.coverImage} alt="" fill sizes="50vw" className="object-cover" />
            </motion.div>
          )}
          <div className="relative grid grid-cols-12 gap-5">
            <motion.div style={{ y: yBig }} className="col-span-8 col-start-1">
              <button type="button" onClick={(e) => quickView.open(product, e.currentTarget)} className="group relative block aspect-[2/3] w-full overflow-hidden border border-gold/20 shadow-abyss" aria-label={`Быстрый просмотр: ${product.title}`}>
                <ArtImage src={product.images[0]} alt={product.title} fill sizes="(min-width:1024px) 40vw, 70vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                <span className="foil-sheen absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              </button>
            </motion.div>
            <motion.div style={{ y: ySmall }} className="col-span-5 col-start-8 mt-40">
              <div className="relative aspect-[2/3] w-full overflow-hidden border border-gold/20 shadow-abyss">
                <ArtImage src={product.images[1] ?? product.images[0]} alt={`${product.title} — карты`} fill sizes="(min-width:1024px) 22vw, 40vw" className="object-cover" />
              </div>
              <p className="mt-4 font-serif text-sm italic text-ash">78 арканов, тиснение золотой фольгой, срез — матовое золото.</p>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <span className="eyebrow mb-5 block">Флагманская колода</span>
          <h2 className="font-serif text-4xl font-semibold uppercase leading-tight tracking-[0.1em] text-parchment sm:text-5xl">
            {product.titleEn ?? product.title}
          </h2>
          <p className="mt-6 font-serif text-2xl italic leading-relaxed text-gold/85">
            «Колода родилась за три года отшельничества в Карпатах. Каждая линия сначала была вытравлена на меди, и только потом — стала золотом.»
          </p>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ash">
            <p>{product.shortDescription} Двадцать два Старших Аркана выстроены как путь Лилит из Эдема в собственную ночь.</p>
            <p>{product.visualDescription}</p>
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-3xl text-gold">{formatPrice(product.price)}</span>
            {product.editionSize && <span className="text-xs uppercase tracking-[0.2em] text-ash">тираж {product.editionSize} экз.</span>}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={`/shop/${product.slug}`} className={btnPrimary}>
              Изучить колоду <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {collection && (
              <Link href={`/collections/${collection.slug}`} className={btnGhost}>
                Лор коллекции
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
