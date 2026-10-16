import type { ReactNode } from "react";
import { Glyph } from "@/components/ui/Glyph";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden pb-14 pt-36 text-center">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[110px]" aria-hidden />
      <Glyph className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 text-gold/[0.05]" strokeWidth={0.6} />
      <div className="relative mx-auto max-w-3xl px-6 animate-fade-up">
        <span className="eyebrow mb-5 block">{eyebrow}</span>
        <h1 className="font-serif text-4xl font-semibold uppercase tracking-[0.14em] text-parchment sm:text-6xl">{title}</h1>
        {children && <div className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-ash">{children}</div>}
      </div>
    </header>
  );
}
