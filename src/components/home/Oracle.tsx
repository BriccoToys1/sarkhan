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
    <section id="oracle" className="relative scroll-mt-20 overflow-hidden border-y border-gold/10 bg-abyss py-16 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-crimson/10 blur-[120px]" />

      <div
        className={clsx(
          "relative mx-auto px-5 text-center transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6",
          flipped ? "max-w-5xl" : "max-w-md",
        )}
      >
        <span className="eyebrow mb-3 block sm:mb-4">Интерактивное прорицание</span>
        <h2 className="font-serif text-3xl font-semibold uppercase tracking-[0.14em] text-parchment sm:text-4xl md:text-5xl">Оракул дня</h2>
        <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ash sm:mt-5 sm:text-xl">
          Мысленно сформулируйте вопрос. Коснитесь парящей рубашки карты — и она откроет совет из глубин бездны.
        </p>

        <div className="mt-10 flex flex-col items-center sm:mt-12">
          <div className="animate-float" style={{ animationPlayState: flipped ? "paused" : "running" }}>
            <div
              ref={tiltRef}
              onPointerMove={onTiltMove}
              onPointerLeave={onTiltLeave}
              style={{ perspective: "1400px" }}
              className="relative h-[320px] w-[192px] sm:h-[400px] sm:w-[240px] md:h-[460px] md:w-[276px]"
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
                </span>
                <span
                  className="backface-hidden absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_0_70px_rgba(197,168,128,0.3)]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {card && <ArtImage src={card.image} alt={card.name} fill sizes="280px" className="object-cover" />}
                  <span className="foil-sheen absolute inset-0 opacity-60" />
                </span>
              </button>
            </div>
          </div>

          {!flipped && (
            <button
              type="button"
              onClick={draw}
              disabled={busy || cards.length === 0}
              className="mt-6 font-display text-[0.65rem] uppercase tracking-[0.4em] text-gold/85 transition-colors hover:text-gold animate-breathe sm:mt-8 sm:text-[0.7rem]"
            >
              Прикоснуться
            </button>
          )}
        </div>

        <div className={clsx("mx-auto transition-all duration-700", flipped ? "mt-10 min-h-[200px] max-w-xl sm:mt-12" : "mt-0 min-h-0")}>
          <AnimatePresence mode="wait">
            {flipped && card && (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.8 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                className="border border-gold/20 bg-obsidian/60 p-5 backdrop-blur sm:p-8"
              >
                <span className="font-display text-xs tracking-[0.3em] text-gold/70">{card.numeral}</span>
                <h3 className="mt-2 font-serif text-2xl uppercase tracking-[0.12em] text-gold sm:text-3xl">{card.name}</h3>
                <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.3em] text-ash">{card.keyword}</p>
                <p className="mt-5 font-serif text-lg italic leading-relaxed text-parchment sm:mt-6 sm:text-xl">{card.interpretation}</p>
                <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row">
                  {card.product && (
                    <Link href={`/shop/${card.product.slug}`} className={clsx(btnPrimary, "w-full whitespace-nowrap px-6 sm:w-auto")}>
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
