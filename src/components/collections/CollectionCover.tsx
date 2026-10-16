"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ArtImage } from "@/components/ui/ArtImage";
import { btnGhost } from "@/components/ui/buttons";
import { toRoman } from "@/lib/format";
import type { CollectionDTO } from "@/lib/types";
import { AmbientButton } from "./AmbientButton";

/** Полноэкранная обложка коллекции с кнопкой эмбиента в углу. */
export function CollectionCover({ collection, index }: { collection: CollectionDTO; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden border-b border-gold/10">
      <motion.div className="absolute inset-[-12%_0]" style={{ y }}>
        <ArtImage src={collection.coverImage} alt="" fill sizes="100vw" className="object-cover" preload={index === 0} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-transparent" />

      <AmbientButton
        className="absolute right-6 top-28 z-10"
        track={{ id: `collection-${collection.slug}`, title: collection.title, preset: collection.ambientPreset, url: collection.ambientUrl }}
      />

      <motion.div style={{ y: textY }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24">
        <span className="font-display text-sm tracking-[0.4em] text-gold/70">СЕРИЯ {toRoman(index + 1)}</span>
        {collection.era && <span className="ml-4 text-xs uppercase tracking-[0.2em] text-ash">{collection.era}</span>}
        <h2 className="mt-4 max-w-3xl font-serif text-5xl font-semibold uppercase leading-[0.95] tracking-[0.08em] text-parchment sm:text-7xl">{collection.title}</h2>
        {collection.subtitle && <p className="mt-3 font-serif text-2xl italic text-gold/80">{collection.subtitle}</p>}
        <p className="mt-6 max-w-xl font-serif text-xl leading-relaxed text-parchment/80">{collection.excerpt}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link href={`/collections/${collection.slug}`} className={btnGhost}>
            Войти во вселенную <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-xs uppercase tracking-[0.2em] text-ash">Артефактов: {collection.productCount}</span>
        </div>
      </motion.div>
    </section>
  );
}
