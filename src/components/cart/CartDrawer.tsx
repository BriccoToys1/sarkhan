"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCart, lineLimit, type FreshProduct } from "@/store/cart";
import { useCartTotals } from "@/hooks/useCartTotals";
import { useModal } from "@/hooks/useModal";
import { formatCents, formatPrice } from "@/lib/format";
import { ArtImage } from "@/components/ui/ArtImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { CountUp } from "@/components/ui/CountUp";
import { ChaliceIcon } from "@/components/ui/icons";
import { btnPrimary } from "@/components/ui/buttons";
import { PromoField } from "./PromoField";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const sync = useCart((s) => s.sync);
  const totals = useCartTotals();
  const panel = useRef<HTMLDivElement>(null);
  useModal(isOpen, panel, close);

  useEffect(() => {
    if (!isOpen) return;
    const ids = useCart.getState().lines.map((l) => l.productId);
    if (ids.length === 0) return;
    const ctrl = new AbortController();
    fetch("/api/cart/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }), signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: { ok: boolean; products: FreshProduct[] }) => d.ok && sync(d.products))
      .catch(() => {});
    return () => ctrl.abort();
  }, [isOpen, sync]);

  const shippingLabel = totals.method === "EXPRESS" ? "Доставка (по всему миру, DHL Express)" : "Доставка (AirMail с трек-номером)";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} aria-hidden />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-abyss shadow-abyss focus:outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-gold/15 bg-obsidian px-6 py-5">
              <h2 className="flex items-center gap-3 font-serif text-xl font-semibold uppercase tracking-[0.2em] text-gold">
                <ChaliceIcon className="h-5 w-5" /> Корзина
              </h2>
              <button type="button" onClick={close} className="text-ash hover:text-gold" aria-label="Закрыть корзину">
                <X className="h-6 w-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ChaliceIcon className="h-12 w-12 text-gold/40 animate-breathe" />
                  <h3 className="font-serif text-xl uppercase tracking-[0.2em] text-gold">Чаша пуста</h3>
                  <p className="max-w-xs font-serif text-base text-ash">Вы ещё не призвали ни одного артефакта.</p>
                  <Link href="/shop" onClick={close} className="mt-2 font-display text-[0.65rem] uppercase tracking-[0.26em] text-gold hover:text-parchment">
                    Войти в Храм →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.productId}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginTop: 0 }}
                        className="flex gap-4 border border-gold/10 bg-obsidian/50 p-3"
                      >
                        <Link href={`/shop/${line.slug}`} onClick={close} className="relative h-24 w-16 shrink-0 overflow-hidden border border-gold/20">
                          <ArtImage src={line.image} alt={line.title} fill sizes="64px" className="object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-3">
                            <Link href={`/shop/${line.slug}`} onClick={close} className="line-clamp-2 font-serif text-base leading-tight text-parchment hover:text-gold">
                              {line.title}
                            </Link>
                            <span className="shrink-0 font-display text-sm text-gold">{formatPrice(line.price * line.quantity)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <QuantitySelector size="sm" value={line.quantity} max={lineLimit(line)} min={1} onChange={(n) => setQuantity(line.productId, n)} />
                            <button type="button" onClick={() => remove(line.productId)} className="flex items-center gap-1 text-[0.68rem] text-ash/70 transition-colors hover:text-crimson-light">
                              <Trash2 className="h-3.5 w-3.5" /> Удалить
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="space-y-4 border-t border-gold/15 bg-obsidian px-6 py-5">
                <PromoField discount={totals.discount} note={totals.promoNote} applied={totals.promoApplied} />
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between text-ash">
                    <dt>Промежуточный итог:</dt>
                    <dd>{formatCents(totals.subtotal)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-gold">
                      <dt>Скидка по купону:</dt>
                      <dd>−{formatCents(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-ash">
                    <dt>{shippingLabel}:</dt>
                    <dd>{totals.shipping === 0 ? "Бесплатно" : formatCents(totals.shipping)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-gold/10 pt-3">
                    <dt className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-parchment">Итого к оплате:</dt>
                    <dd>
                      <CountUp cents={totals.total} className="font-display text-lg text-gold" />
                    </dd>
                  </div>
                </dl>
                <Link href="/checkout" onClick={close} className={`${btnPrimary} w-full`}>
                  Перейти к оформлению заказа <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
