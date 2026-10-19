"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { SmokeCanvas } from "./SmokeCanvas";
import { ParticleFrame } from "@/components/ui/ParticleFrame";
import { ArtImage } from "@/components/ui/ArtImage";

const CARDS = [
  { src: "/art/oracle/back.svg", className: "left-[2%] top-[16%] w-[22vw] max-w-[180px] min-w-[88px] sm:left-[4%] sm:top-[18%] sm:w-[15vw] sm:max-w-[220px] sm:min-w-[110px]", speed: -120, rot: -12 },
  { src: "/art/oracle/priestess.svg", className: "right-[2%] top-[10%] w-[20vw] max-w-[160px] min-w-[80px] sm:right-[6%] sm:top-[12%] sm:w-[13vw] sm:max-w-[200px] sm:min-w-[100px]", speed: -220, rot: 9 },
  { src: "/art/oracle/moon.svg", className: "left-[14%] bottom-[6%] w-[10vw] max-w-[150px] min-w-[80px] hidden md:block", speed: -60, rot: 6 },
  { src: "/art/oracle/death.svg", className: "right-[16%] bottom-[10%] w-[9vw] max-w-[140px] min-w-[80px] hidden md:block", speed: -300, rot: -7 },
];

export function Hero({ videoUrl, posterUrl }: { videoUrl?: string; posterUrl?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const y0 = useTransform(scrollYProgress, [0, 1], [0, CARDS[0].speed]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, CARDS[1].speed]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, CARDS[2].speed]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, CARDS[3].speed]);
  const ys = [y0, y1, y2, y3];

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden sm:min-h-[640px]">
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#2a2018_0%,#0b0b0c_62%)]" />
        {videoUrl && (
          <video className="absolute inset-0 h-full w-full object-cover opacity-40" src={videoUrl} poster={posterUrl} autoPlay muted loop playsInline preload="metadata" aria-hidden />
        )}
        <div className="paper-grain absolute inset-0 opacity-60" />
      </motion.div>

      <SmokeCanvas className="absolute inset-0 h-full w-full" />

      {CARDS.map((c, i) => (
        <motion.div key={c.src} className={`pointer-events-none absolute ${c.className}`} style={{ y: ys[i] }} aria-hidden>
          <div className="animate-float" style={{ ["--float-rot" as string]: `${c.rot}deg`, animationDelay: `${i * -1.7}s` }}>
            <div className="relative aspect-[3/5] w-full opacity-70 shadow-abyss" style={{ filter: "drop-shadow(0 0 24px rgba(197,168,128,0.18))" }}>
              <ArtImage src={c.src} alt="" fill sizes="220px" className="object-contain" preload={i < 2} />
            </div>
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian" />

      <motion.div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-6" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.18em" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-gold-foil animate-shimmer font-display text-[2.6rem] font-semibold leading-none sm:text-7xl lg:text-8xl"
        >
          SARKHAN GRIM
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mx-auto mt-5 max-w-2xl px-2 font-serif text-xl italic tracking-wide text-gold/85 sm:mt-6 sm:text-3xl"
        >
          Mystical Cards & Esoteric Artifacts
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5"
        >
          <Link
            href="/shop"
            className="group relative inline-flex h-12 items-center justify-center gap-3 px-8 font-display text-[0.7rem] font-normal uppercase leading-none tracking-[0.3em] text-gold transition-colors duration-500 hover:text-parchment sm:h-14 sm:px-10"
          >
            <span className="absolute inset-0 border border-gold/45 transition-all delay-700 duration-700 group-hover:border-gold group-hover:shadow-gold-strong" />
            <ParticleFrame />
            <span className="relative leading-none">Войти в Храм</span>
            <ChevronRight className="relative h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
          </Link>
          <a href="#oracle" className="inline-flex h-10 items-center justify-center font-display text-[0.65rem] font-normal uppercase leading-none tracking-[0.3em] text-ash transition-colors hover:text-gold">
            Вопросить Оракула
          </a>
        </motion.div>
      </motion.div>

      <a
        href="#oracle"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center text-gold/60 transition-colors hover:text-gold sm:bottom-8"
        aria-label="Листать вниз"
      >
        <ChevronDown className="h-8 w-8 animate-bounce sm:h-10 sm:w-10" strokeWidth={1.25} />
      </a>
    </section>
  );
}
