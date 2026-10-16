"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import clsx from "clsx";
import { useTilt, tiltStyle } from "@/hooks/useTilt";
import { useQuickView } from "@/components/providers/QuickView";
import { useCart } from "@/store/cart";
import { ArtImage } from "@/components/ui/ArtImage";
import { ChaliceIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS, availabilityLabel } from "@/lib/labels";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: ProductDTO; priority?: boolean }) {
  const { bind: tiltRef, onPointerMove: onTiltMove, onPointerLeave: onTiltLeave } = useTilt<HTMLDivElement>(9);
  const quickView = useQuickView();
  const add = useCart((s) => s.add);
  const soldOut = product.availability === "SOLD_OUT";
  const [front, back] = [product.images[0], product.images[1] ?? product.images[0]];

  return (
    <div className="group/card" style={{ perspective: "1100px" }}>
      <div ref={tiltRef} onPointerMove={onTiltMove} onPointerLeave={onTiltLeave} style={tiltStyle} className="preserve-3d relative">
        <Link
          href={`/shop/${product.slug}`}
          data-transition="off"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            quickView.open(product, e.currentTarget);
          }}
          className="relative block aspect-[2/3] overflow-hidden border border-gold/15 bg-abyss shadow-abyss transition-colors duration-500 group-hover/card:border-gold/45"
          aria-label={`${product.title} — быстрый просмотр`}
        >
          <ArtImage
            src={front}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-all duration-[900ms] group-hover/card:scale-[1.04] group-hover/card:opacity-0"
            preload={priority}
          />
          <ArtImage
            src={back}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="scale-[1.06] object-cover opacity-0 transition-all duration-[900ms] group-hover/card:scale-100 group-hover/card:opacity-100"
          />
          <span className="foil-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" aria-hidden />
          <span className="pointer-events-none absolute inset-2 border border-gold/0 transition-colors duration-700 group-hover/card:border-gold/25" aria-hidden />
          <span className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <span
              className={clsx(
                "border bg-obsidian/80 px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.18em] backdrop-blur",
                soldOut ? "border-crimson/50 text-crimson-light" : "border-gold/25 text-gold",
              )}
            >
              {availabilityLabel(product)}
            </span>
            {product.isLimited && !soldOut && (
              <span className="border border-gold/40 bg-gold/15 px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.18em] text-gold-light backdrop-blur">
                Лимитированный тираж
              </span>
            )}
          </span>
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4 opacity-0 transition-all duration-500 group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 max-lg:pointer-events-auto max-lg:opacity-100" style={{ transform: "translateZ(40px)" }}>
          <button
            type="button"
            onClick={(e) => quickView.open(product, e.currentTarget)}
            className="flex h-10 w-10 items-center justify-center border border-gold/30 bg-obsidian/85 text-parchment backdrop-blur transition-colors hover:border-gold hover:text-gold"
            aria-label={`Быстрый просмотр: ${product.title}`}
            title="Быстрый просмотр"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={soldOut}
            onClick={() => add(product)}
            className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-gold/20 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-30"
            aria-label={`Добавить в корзину: ${product.title}`}
            title={soldOut ? "Продано" : "Добавить в корзину"}
          >
            <ChaliceIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 px-0.5">
        <span className="block font-display text-[0.58rem] uppercase tracking-[0.26em] text-gold/60">{TYPE_LABELS[product.type]}</span>
        <h3 className="font-serif text-lg leading-snug text-parchment transition-colors group-hover/card:text-gold">
          <Link href={`/shop/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className={clsx("font-display text-sm", soldOut ? "text-ash line-through decoration-crimson/60" : "text-gold")}>{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
