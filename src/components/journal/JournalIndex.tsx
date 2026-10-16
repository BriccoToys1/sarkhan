"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { ArtImage } from "@/components/ui/ArtImage";
import { formatDate } from "@/lib/format";
import { RUBRIC_LABELS } from "@/lib/labels";
import type { JournalPostDTO, JournalRubric } from "@/lib/types";

const RUBRICS = Object.keys(RUBRIC_LABELS) as JournalRubric[];

function Meta({ post }: { post: JournalPostDTO }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-display text-[0.58rem] uppercase tracking-[0.24em]">
      <span className="text-gold">{RUBRIC_LABELS[post.rubric]}</span>
      <span className="text-ash">{formatDate(post.publishedAt)}</span>
      <span className="text-ash/70">{post.readingTime} мин чтения</span>
    </div>
  );
}

export function JournalIndex({ posts }: { posts: JournalPostDTO[] }) {
  const [search, setSearch] = useUrlSearch();
  const fromUrl = new URLSearchParams(search).get("rubric") as JournalRubric | null;
  const rubric = fromUrl && RUBRICS.includes(fromUrl) ? fromUrl : null;

  const select = (r: JournalRubric | null) => setSearch(new URLSearchParams(r ? { rubric: r } : {}));

  const list = rubric ? posts.filter((p) => p.rubric === rubric) : posts;
  const [lead, ...rest] = list;

  return (
    <>
      <nav className="mb-16 flex flex-wrap justify-center gap-2" aria-label="Рубрики">
        {[null, ...RUBRICS].map((r) => (
          <button
            key={r ?? "all"}
            type="button"
            onClick={() => select(r)}
            aria-pressed={rubric === r}
            className={clsx(
              "border px-4 py-2 font-display text-[0.6rem] uppercase tracking-[0.22em] transition-colors",
              rubric === r ? "border-gold bg-gold text-obsidian" : "border-gold/15 text-ash hover:border-gold/50 hover:text-parchment",
            )}
          >
            {r ? RUBRIC_LABELS[r] : "Все записи"}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={rubric ?? "all"} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          {!lead ? (
            <p className="py-20 text-center font-serif text-xl italic text-ash">В этой рубрике пока лишь тишина.</p>
          ) : (
            <>
              <Link href={`/journal/${lead.slug}`} className="group grid gap-10 border-b border-gold/10 pb-16 lg:grid-cols-12 lg:items-center">
                <div className="relative aspect-[12/7] overflow-hidden border border-gold/20 lg:col-span-7">
                  {lead.coverImage && <ArtImage src={lead.coverImage} alt="" fill sizes="(min-width:1024px) 55vw, 95vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" preload />}
                </div>
                <div className="lg:col-span-5">
                  <Meta post={lead} />
                  <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-parchment transition-colors group-hover:text-gold">{lead.title}</h2>
                  <p className="drop-cap mt-6 font-serif text-xl leading-relaxed text-ash">{lead.excerpt}</p>
                  <span className="mt-8 inline-block font-display text-[0.62rem] uppercase tracking-[0.26em] text-gold">Читать манускрипт →</span>
                </div>
              </Link>
              <ul className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <li key={post.id}>
                    <Link href={`/journal/${post.slug}`} className="group block">
                      <div className="relative aspect-[12/7] overflow-hidden border border-gold/15">
                        {post.coverImage && <ArtImage src={post.coverImage} alt="" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />}
                      </div>
                      <div className="mt-5">
                        <Meta post={post} />
                        <h3 className="mt-3 font-serif text-2xl leading-snug text-parchment transition-colors group-hover:text-gold">{post.title}</h3>
                        <p className="mt-3 line-clamp-3 font-serif text-lg leading-relaxed text-ash">{post.excerpt}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
