"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { formatPrice } from "@/lib/format";
import { ArtImage } from "@/components/ui/ArtImage";

type Result = { id: string; slug: string; title: string; price: number; image: string; type: string };

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <SearchPanel onClose={onClose} />}</AnimatePresence>;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [found, setFound] = useState<{ query: string; results: Result[] }>({ query: "", results: [] });
  useModal(true, panel, onClose);

  const query = q.trim();
  const active = query.length >= 2;
  const loading = active && found.query !== query;
  const results = active ? found.results : [];

  useEffect(() => {
    if (!active) return;
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: { results: Result[] }) => setFound({ query, results: d.results }))
        .catch(() => {});
    }, 220);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [query, active]);

  return (
    <motion.div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Поиск"
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-obsidian/95 px-6 pt-[18vh] backdrop-blur-xl focus:outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" onClick={onClose} className="absolute right-6 top-6 text-ash hover:text-gold" aria-label="Закрыть поиск">
        <X className="h-8 w-8" />
      </button>
      <div className="w-full max-w-2xl">
        <h2 className="mb-8 text-center font-serif text-2xl uppercase tracking-[0.25em] text-gold">Поиск в бездне артефактов</h2>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) (document.getElementById(`sr-${results[0].id}`) as HTMLAnchorElement | null)?.click();
          }}
          className="relative border-b border-gold/30 focus-within:border-gold"
        >
          <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
          <input
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Колода, принт, гримуар, свеча…"
            className="w-full bg-transparent py-4 pl-9 pr-8 text-center font-serif text-xl text-parchment placeholder:text-ash/40 focus:outline-none"
            aria-label="Поисковый запрос"
          />
          <Sparkles className={`absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50 ${loading ? "animate-spin" : "animate-breathe"}`} />
        </form>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {results.map((r) => (
            <Link
              key={r.id}
              id={`sr-${r.id}`}
              href={`/shop/${r.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 border border-gold/10 bg-abyss/80 p-3 transition-colors hover:border-gold/40"
            >
              <span className="relative h-16 w-11 shrink-0 overflow-hidden border border-gold/15">
                <ArtImage src={r.image} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[0.55rem] uppercase tracking-[0.25em] text-gold/60">{r.type}</span>
                <span className="line-clamp-1 font-serif text-base text-parchment">{r.title}</span>
                <span className="font-display text-xs text-gold">{formatPrice(r.price)}</span>
              </span>
            </Link>
          ))}
          {active && !loading && results.length === 0 && (
            <p className="col-span-full py-6 text-center font-serif text-lg italic text-ash">Ничего не найдено в архивах бездны. Попробуйте другое слово.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
