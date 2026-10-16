"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { useTilt } from "@/hooks/useTilt";
import { ArtImage } from "@/components/ui/ArtImage";
import { btnLink, btnPrimary } from "@/components/ui/buttons";
import type { OracleCardDTO } from "@/lib/types";

export function Oracle({ cards }: { cards: OracleCardDTO[] }) {
  const [card, setCard] = useState<OracleCardDTO | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const { bind: tiltRef, onPointerMove: onTiltMove, onPointerLeave: onTiltLeave } = useTilt<HTMLDivElement>(12);

  const draw = () => {
    if (flipped || busy || cards.length === 0) return;
    const pool = card ? cards.filter((c) => c.id !== card.id) : cards;
    const next = pool[crypto.getRandomValues(new Uint32Array(1))[0] % pool.length];
    setCard(next);
    setBusy(true);
    requestAnimationFrame(() => setFlipped(true));
    window.setTimeout(() => setBusy(false), 900);
  };

  const reset = () => {
    setFlipped(false);
    setBusy(true);
    window.setTimeout(() => setBusy(false), 900);
  };

  return (
    <section id="oracle" className="relative scroll-mt-20 overflow-hidden border-y border-gold/10 bg-abyss py-28">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-crimson/10 blur-[120px]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="eyebrow mb-4 block">Интерактивное прорицание</span>
        <h2 className="font-serif text-4xl font-semibold uppercase tracking-[0.14em] text-parchment sm:text-5xl">Оракул дня</h2>
        <p className="mx-auto mt-5 max-w-xl font-serif text-xl text-ash">
          Мысленно сформулируйте вопрос. Коснитесь парящей рубашки карты — и она откроет совет из глубин бездны.
        </p>

        <div className="mt-14 flex justify-center">
          <div className="animate-float" style={{ animationPlayState: flipped ? "paused" : "running" }}>
            <div
              ref={tiltRef}
              onPointerMove={onTiltMove}
              onPointerLeave={onTiltLeave}
              style={{ perspective: "1400px" }}
              className="relative h-[400px] w-[240px] sm:h-[460px] sm:w-[276px]"
            >
              <button
                type="button"
                onClick={draw}
                disabled={flipped}
                aria-label={flipped && card ? `Выпала карта: ${card.name}` : "Перевернуть карту"}
                className="preserve-3d group relative block h-full w-full disabled:cursor-default"
                style={{
                  transform: `rotateX(var(--rx, 0deg)) rotateY(calc(var(--ry, 0deg) + ${flipped ? 180 : 0}deg))`,
                  transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span className="backface-hidden absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_0_60px_rgba(197,168,128,0.18)]">
                  <ArtImage src="/art/oracle/back.svg" alt="" fill sizes="280px" className="object-cover" />
                  <span className="foil-sheen absolute inset-0 opacity-70" />
                  <span className="absolute inset-x-0 bottom-10 font-display text-[0.6rem] tracking-[0.4em] text-gold/80 animate-breathe">ПРИКОСНУТЬСЯ</span>
                </span>
                <span className="backface-hidden absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_0_70px_rgba(197,168,128,0.3)]" style={{ transform: "rotateY(180deg)" }}>
                  {card && <ArtImage src={card.image} alt={card.name} fill sizes="280px" className="object-cover" />}
                  <span className="foil-sheen absolute inset-0 opacity-60" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 min-h-[220px] max-w-xl">
          <AnimatePresence mode="wait">
            {flipped && card && (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.8 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                className="border border-gold/20 bg-obsidian/60 p-8 backdrop-blur"
              >
                <span className="font-display text-xs tracking-[0.3em] text-gold/70">{card.numeral}</span>
                <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.12em] text-gold">{card.name}</h3>
                <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.3em] text-ash">{card.keyword}</p>
                <p className="mt-6 font-serif text-xl italic leading-relaxed text-parchment">{card.interpretation}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {card.product && (
                    <Link href={`/shop/${card.product.slug}`} className={clsx(btnPrimary, "whitespace-nowrap px-6 py-3")}>
                      {card.product.type === "DECK" ? "Изучить эту колоду" : "Изучить артефакт"} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <button type="button" onClick={reset} className={btnLink}>
                    <RotateCcw className="h-3.5 w-3.5" /> Вопросить вновь
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
