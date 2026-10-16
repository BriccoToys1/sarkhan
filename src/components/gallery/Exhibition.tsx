"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArtImage } from "@/components/ui/ArtImage";
import { Vignette } from "@/components/ui/Vignette";
import { Ouroboros } from "@/components/ui/Ouroboros";
import { formatPrice } from "@/lib/format";
import type { ArtworkDTO } from "@/lib/types";
import { AudioGuide } from "./AudioGuide";
import { ZoomViewer } from "./ZoomViewer";

function Exhibit({ art, index, onZoom }: { art: ArtworkDTO; index: number; onZoom: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLit(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const right = index % 2 === 1;
  const sold = art.product?.availability === "SOLD_OUT";

  return (
    <section ref={ref} className="relative py-20 sm:py-28" aria-labelledby={`art-${art.id}`}>
      <div className={clsx("mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12", right && "lg:[&>*:first-child]:order-2")}>
        <div className="relative lg:col-span-7">
          {/* виртуальный софит */}
          <div
            aria-hidden
            className={clsx("pointer-events-none absolute -top-40 left-1/2 h-[140%] w-[130%] -translate-x-1/2 transition-opacity duration-[1.6s]", lit ? "spot-on opacity-100" : "opacity-0")}
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255,236,200,0.09) 172deg, rgba(255,236,200,0.16) 180deg, rgba(255,236,200,0.09) 188deg, transparent 200deg)",
              filter: "blur(6px)",
            }}
          />
          <div aria-hidden className={clsx("pointer-events-none absolute inset-x-[10%] -bottom-10 h-16 rounded-[50%] bg-[rgba(255,236,200,0.08)] blur-2xl transition-opacity duration-[1.6s]", lit ? "opacity-100" : "opacity-0")} />
          <motion.button
            type="button"
            onClick={onZoom}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="group relative mx-auto block w-full max-w-md"
            aria-label={`Открыть «${art.title}» в лупе`}
          >
            <span className="block border-[10px] border-[#1d1710] bg-[#1d1710] p-[3px] shadow-[0_40px_90px_-20px_rgba(0,0,0,1)] outline outline-1 outline-gold/40" style={{ boxShadow: lit ? "0 40px 90px -20px #000, 0 0 60px rgba(255,230,190,0.08)" : undefined }}>
              <span className={clsx("relative block aspect-[3/4] overflow-hidden transition-[filter] duration-[1.6s]", lit ? "brightness-100" : "brightness-[0.35]")}>
                <ArtImage src={art.image} alt={art.title} fill sizes="(min-width:1024px) 34vw, 90vw" className="object-cover transition-transform duration-[2s] group-hover:scale-[1.03]" />
              </span>
            </span>
            <span className="absolute bottom-4 right-4 flex items-center gap-2 border border-gold/30 bg-obsidian/80 px-3 py-2 font-display text-[0.55rem] uppercase tracking-[0.24em] text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Search className="h-3.5 w-3.5" /> Лупа
            </span>
          </motion.button>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <span className="font-display text-xs tracking-[0.4em] text-gold/50">№ {String(index + 1).padStart(2, "0")}</span>
          <h2 id={`art-${art.id}`} className="mt-3 font-serif text-3xl uppercase tracking-[0.1em] text-parchment sm:text-4xl">
            {art.title}
          </h2>
          <dl className="mt-5 space-y-1 text-xs uppercase tracking-[0.16em] text-ash">
            <div className="flex gap-2">
              <dt className="sr-only">Материалы</dt>
              <dd>{art.materials}</dd>
            </div>
            {(art.dimensions || art.year) && (
              <div className="flex gap-2">
                <dt className="sr-only">Размер и год</dt>
                <dd>{[art.dimensions, art.year].filter(Boolean).join(" · ")}</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 font-serif text-xl leading-relaxed text-parchment/80">{art.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-gold/10 pt-6">
            <AudioGuide id={art.id} url={art.audioUrl} transcript={art.audioTranscript} />
            <button type="button" onClick={onZoom} className="inline-flex items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold hover:text-parchment">
              <Search className="h-3.5 w-3.5" /> Рассмотреть штрихи
            </button>
            {art.product &&
              (sold ? (
                <span className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-ash">В частной коллекции</span>
              ) : (
                <Link href={`/shop/${art.product.slug}`} className="inline-flex items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold hover:text-parchment">
                  Приобрести · {formatPrice(art.product.price)}
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Exhibition({ initial, next: initialNext, total }: { initial: ArtworkDTO[]; next: number | null; total: number }) {
  const [items, setItems] = useState(initial);
  const [next, setNext] = useState(initialNext);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState<ArtworkDTO | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (next === null || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?cursor=${next}`);
      const data = (await res.json()) as { items: ArtworkDTO[]; next: number | null };
      setItems((prev) => [...prev, ...data.items.filter((a) => !prev.some((p) => p.id === a.id))]);
      setNext(data.next);
    } finally {
      setLoading(false);
    }
  }, [next, loading]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && loadMore(), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const openZoom = (art: ArtworkDTO) => {
    setZoom(art);
    navigator.sendBeacon?.("/api/views", new Blob([JSON.stringify({ kind: "artwork", id: art.id })], { type: "application/json" }));
  };

  return (
    <>
      {items.map((art, i) => (
        <Exhibit key={art.id} art={art} index={i} onZoom={() => openZoom(art)} />
      ))}
      <div ref={sentinel} className="flex flex-col items-center gap-6 py-24 text-center">
        {next !== null ? (
          <Ouroboros className="h-10 w-10" />
        ) : (
          <>
            <Vignette />
            <p className="font-serif text-xl italic text-ash">Конец экспозиции. Работ в зале: {total}.</p>
          </>
        )}
      </div>
      <ZoomViewer
        src={zoom ? (zoom.imageHiRes ?? zoom.image) : null}
        title={zoom?.title ?? ""}
        caption={zoom ? [zoom.materials, zoom.dimensions].filter(Boolean).join(" · ") : undefined}
        onClose={() => setZoom(null)}
      />
    </>
  );
}
