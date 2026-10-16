"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";

const TEXT =
  "Искусство — это мост между материальным и оккультным. Каждая линия, вытравленная мной на медной пластине, каждый оттиск офорта — акт практической магии. Я не иллюстрирую Таро: я открываю каналы для древних архетипов и помогаю искателю заглянуть под покров Изиды.";

/** Манифест автора: текст проявляется посимвольно при прокрутке. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const chars = useMemo(() => Array.from(TEXT), []);
  const [shown, setShown] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.85"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.round(Math.min(1, Math.max(0, v * 1.15)) * chars.length);
    setShown((prev) => (prev === next ? prev : next));
  });

  const visible = reduce ? chars.length : shown;

  return (
    <section ref={ref} className="relative min-h-[130vh] bg-obsidian">
      <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
        <Glyph className="pointer-events-none absolute h-[70vmin] w-[70vmin] text-gold/[0.04]" strokeWidth={0.5} />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-8 block font-display text-2xl tracking-[0.5em] text-gold/70">🜁 🜄 🜃 🜂</span>
          <h2 className="sr-only">Манифест автора</h2>
          <blockquote>
            <p className="font-serif text-3xl italic leading-[1.35] sm:text-4xl lg:text-[2.75rem]" aria-label={TEXT}>
              <span aria-hidden>«</span>
              {chars.map((ch, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="transition-[color,opacity,text-shadow] duration-500"
                  style={{
                    color: i < visible ? "var(--color-parchment)" : "rgba(245,242,235,0.12)",
                    textShadow: i < visible && i > visible - 12 ? "0 0 18px rgba(197,168,128,0.8)" : "none",
                  }}
                >
                  {ch}
                </span>
              ))}
              <span aria-hidden>»</span>
            </p>
            <footer className="mt-12 flex flex-col items-center gap-2">
              <span className="hairline w-24" />
              <cite className="mt-3 font-display text-xs not-italic tracking-[0.4em] text-gold">САРХАН ГРИМ</cite>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ash">Основатель, художник & гравёр</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
