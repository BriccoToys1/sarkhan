import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Vignette } from "@/components/ui/Vignette";

export function InfoPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro?: string; sections: { title: string; body: ReactNode }[] }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}>
        {intro}
      </PageHeader>
      <div className="mx-auto max-w-3xl px-6 pb-32">
        {sections.map((s, i) => (
          <section key={s.title} className="border-t border-gold/10 py-10">
            <h2 className="flex items-baseline gap-4 font-serif text-2xl uppercase tracking-[0.12em] text-parchment">
              <span className="font-display text-sm text-gold/60">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-5 space-y-4 font-serif text-lg leading-relaxed text-ash">{s.body}</div>
          </section>
        ))}
        <Vignette className="mt-10" />
      </div>
    </>
  );
}
