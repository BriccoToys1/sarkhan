"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { ProductCard } from "./ProductCard";
import { PRICE_MAX, PRICE_MIN, PriceRange } from "./PriceRange";
import { filterProducts, SORT_LABELS, type Filters, type SortKey } from "@/lib/filters";
import { AVAILABILITY_LABELS, TYPE_FILTER_LABELS } from "@/lib/labels";
import type { Availability, CollectionRef, ProductDTO, ProductType } from "@/lib/types";

const TYPES = Object.keys(TYPE_FILTER_LABELS) as ProductType[];
const AVAIL = Object.keys(AVAILABILITY_LABELS) as Availability[];

const DEFAULTS: Filters = { q: "", types: [], collections: [], minPrice: PRICE_MIN, maxPrice: PRICE_MAX, availability: [], sort: "default" };

function readUrl(search: string, collections: CollectionRef[]): Filters {
  const sp = new URLSearchParams(search);
  const list = (k: string) => (sp.get(k) ?? "").split(",").filter(Boolean);
  const num = (k: string, d: number) => {
    const n = Number(sp.get(k));
    return Number.isFinite(n) && n > 0 ? n : d;
  };
  const sort = sp.get("sort") as SortKey | null;
  return {
    q: sp.get("q") ?? "",
    types: list("type").filter((t): t is ProductType => TYPES.includes(t as ProductType)),
    collections: list("collection").filter((c) => collections.some((x) => x.slug === c)),
    minPrice: Math.max(PRICE_MIN, num("min", PRICE_MIN)),
    maxPrice: Math.min(PRICE_MAX, num("max", PRICE_MAX)),
    availability: list("status").filter((a): a is Availability => AVAIL.includes(a as Availability)),
    sort: sort && sort in SORT_LABELS ? sort : "default",
  };
}

function toParams(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.types.length) sp.set("type", f.types.join(","));
  if (f.collections.length) sp.set("collection", f.collections.join(","));
  if (f.minPrice !== PRICE_MIN) sp.set("min", String(f.minPrice));
  if (f.maxPrice !== PRICE_MAX) sp.set("max", String(f.maxPrice));
  if (f.availability.length) sp.set("status", f.availability.join(","));
  if (f.sort !== "default") sp.set("sort", f.sort);
  return sp;
}

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "border px-3.5 py-2 font-display text-[0.6rem] uppercase tracking-[0.2em] transition-all duration-300",
        active ? "border-gold bg-gold text-obsidian" : "border-gold/15 text-ash hover:border-gold/50 hover:text-parchment",
      )}
    >
      {children}
    </button>
  );
}

export function ShopCatalog({ products, collections }: { products: ProductDTO[]; collections: CollectionRef[] }) {
  const [search, setSearch] = useUrlSearch();
  const filters = useMemo(() => readUrl(search, collections), [search, collections]);
  const [panelChoice, setPanel] = useState<boolean | null>(null);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const activeCount =
    filters.types.length + filters.collections.length + filters.availability.length + (filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX ? 1 : 0);
  const panel = panelChoice ?? activeCount > 0;
  const setFilters = (f: Filters) => setSearch(toParams(f));
  const update = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-6 border-y border-gold/15 bg-obsidian/90 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Искать артефакт по названию…"
              className="w-full border-0 border-b border-gold/20 bg-transparent py-2 pl-7 pr-2 font-serif text-lg text-parchment placeholder:text-ash/50 focus:border-gold focus:outline-none"
              aria-label="Поиск по каталогу"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPanel(!panel)}
              aria-expanded={panel}
              aria-controls="shop-filters"
              className={clsx(
                "flex items-center gap-2 border px-4 py-2.5 font-display text-[0.62rem] uppercase tracking-[0.22em] transition-colors",
                panel ? "border-gold text-gold" : "border-gold/25 text-parchment hover:border-gold/60",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Фильтры
              {activeCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.55rem] font-bold text-obsidian">{activeCount}</span>}
            </button>
            <label className="relative">
              <span className="sr-only">Сортировка</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="appearance-none border border-gold/25 bg-abyss py-2.5 pl-4 pr-10 font-display text-[0.62rem] uppercase tracking-[0.18em] text-parchment focus:border-gold focus:outline-none"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold" />
            </label>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              id="shop-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-8 pb-2 pt-6 md:grid-cols-2 xl:grid-cols-4">
                <fieldset>
                  <legend className="eyebrow mb-3">Тип товара</legend>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <Chip key={t} active={filters.types.includes(t)} onClick={() => update({ types: toggle(filters.types, t) })}>
                        {TYPE_FILTER_LABELS[t]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="eyebrow mb-3">Коллекция</legend>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c) => (
                      <Chip key={c.slug} active={filters.collections.includes(c.slug)} onClick={() => update({ collections: toggle(filters.collections, c.slug) })}>
                        {c.title}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="eyebrow mb-3">Ценовой диапазон</legend>
                  <PriceRange min={filters.minPrice} max={filters.maxPrice} onChange={(minPrice, maxPrice) => update({ minPrice, maxPrice })} />
                </fieldset>
                <fieldset>
                  <legend className="eyebrow mb-3">Наличие</legend>
                  <div className="flex flex-wrap gap-2">
                    {AVAIL.map((a) => (
                      <Chip key={a} active={filters.availability.includes(a)} onClick={() => update({ availability: toggle(filters.availability, a) })}>
                        {AVAILABILITY_LABELS[a]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-ash">
        <p aria-live="polite">
          Найдено артефактов: <span className="font-display text-gold">{results.length}</span>
        </p>
        {(activeCount > 0 || filters.q) && (
          <button type="button" onClick={() => setFilters({ ...DEFAULTS, sort: filters.sort })} className="flex items-center gap-1.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-gold hover:text-parchment">
            <X className="h-3 w-3" /> Сбросить фильтры
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl italic text-ash">Бездна молчит: под эти условия не подходит ни один артефакт.</p>
          <button type="button" onClick={() => setFilters(DEFAULTS)} className="mt-6 font-display text-[0.65rem] uppercase tracking-[0.26em] text-gold hover:text-parchment">
            Снять все печати →
          </button>
        </div>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
