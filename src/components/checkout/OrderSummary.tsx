"use client";

import { ArtImage } from "@/components/ui/ArtImage";
import { CountUp } from "@/components/ui/CountUp";
import { PromoField } from "@/components/cart/PromoField";
import { formatCents, formatPrice } from "@/lib/format";
import type { Totals } from "@/lib/pricing";
import type { CartLine } from "@/store/cart";

export function OrderSummary({ lines, totals, locked }: { lines: CartLine[]; totals: Totals; locked: boolean }) {
  return (
    <aside className="border border-gold/15 bg-abyss p-6 lg:sticky lg:top-28" aria-label="Итоги заказа">
      <h2 className="eyebrow mb-6">Список приобретений</h2>
      <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center gap-4">
            <span className="relative h-16 w-11 shrink-0 overflow-hidden border border-gold/20">
              <ArtImage src={l.image} alt="" fill sizes="44px" className="object-cover" />
              <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center bg-gold px-1 text-[0.6rem] font-bold text-obsidian">{l.quantity}</span>
            </span>
            <span className="min-w-0 flex-1 font-serif text-base leading-tight text-parchment">{l.title}</span>
            <span className="font-display text-sm text-gold">{formatPrice(l.price * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-gold/10 pt-5">{!locked && <PromoField discount={totals.discount} note={totals.promoNote} applied={totals.promoApplied} />}</div>
      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between text-ash">
          <dt>Промежуточный итог</dt>
          <dd>{formatCents(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-gold">
          <dt>Скидка по купону</dt>
          <dd>
            −<CountUp cents={totals.discount} />
          </dd>
        </div>
        <div className="flex justify-between text-ash">
          <dt>{totals.method === "EXPRESS" ? "Доставка DHL Express" : "Доставка AirMail"}</dt>
          <dd>{totals.shipping === 0 ? "Бесплатно" : <CountUp cents={totals.shipping} />}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-gold/10 pt-4">
          <dt className="font-display text-[0.7rem] uppercase tracking-[0.22em] text-parchment">Итого к оплате</dt>
          <dd>
            <CountUp cents={totals.total} className="font-display text-2xl text-gold" />
          </dd>
        </div>
      </dl>
    </aside>
  );
}
