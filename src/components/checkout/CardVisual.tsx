"use client";

import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import type { StripeCardNumberElementChangeEvent, StripeElementStyle } from "@stripe/stripe-js";
import clsx from "clsx";
import { useState } from "react";
import { useTilt } from "@/hooks/useTilt";
import { Glyph } from "@/components/ui/Glyph";
import { detectBrand, formatCardNumber, formatExpiry, type CardBrand } from "@/lib/card";

export type DemoCard = { number: string; name: string; expiry: string; cvc: string };
export type CardErrors = Partial<Record<keyof DemoCard, string>>;
export type StripeCompletion = { number: boolean; expiry: boolean; cvc: boolean; brand: CardBrand; error: string | null };

const STRIPE_STYLE: StripeElementStyle = {
  base: {
    color: "#e6d3ad",
    fontFamily: "Montserrat, system-ui, sans-serif",
    fontSize: "17px",
    letterSpacing: "1.5px",
    iconColor: "#c5a880",
    "::placeholder": { color: "rgba(142,142,147,0.55)" },
  },
  invalid: { color: "#d05a5a", iconColor: "#d05a5a" },
};

function BrandMark({ brand }: { brand: CardBrand }) {
  if (brand === "visa") return <span className="font-serif text-2xl font-bold italic tracking-tight text-gold-light">VISA</span>;
  if (brand === "mastercard")
    return (
      <span className="flex" aria-label="Mastercard">
        <span className="h-7 w-7 rounded-full bg-gold/80" />
        <span className="-ml-3 h-7 w-7 rounded-full bg-crimson/80 mix-blend-screen" />
      </span>
    );
  if (brand === "amex") return <span className="border border-gold-light px-1.5 font-display text-xs tracking-widest text-gold-light">AMEX</span>;
  if (brand === "mir") return <span className="font-display text-xl tracking-[0.2em] text-gold-light">МИР</span>;
  if (brand === "unionpay") return <span className="font-display text-xs tracking-widest text-gold-light">UnionPay</span>;
  return <Glyph className="h-8 w-8 text-gold/70" />;
}

const field = "w-full bg-transparent text-gold-light placeholder:text-ash/45 focus:outline-none";
const errorText = "absolute -bottom-4 left-0 whitespace-nowrap text-[0.6rem] tracking-normal text-crimson-light";

/** Чёрная пластиковая карта: поля ввода визуализируются прямо на ней. */
export function CardVisual({
  mode,
  card,
  onChange,
  errors,
  onStripeChange,
}: {
  mode: "demo" | "stripe";
  card: DemoCard;
  onChange: (patch: Partial<DemoCard>) => void;
  errors: CardErrors;
  onStripeChange?: (state: Partial<StripeCompletion>) => void;
}) {
  const { bind: tiltRef, onPointerMove: onTiltMove, onPointerLeave: onTiltLeave } = useTilt<HTMLDivElement>(8);
  const [flipped, setFlipped] = useState(false);
  const [stripeBrand, setStripeBrand] = useState<CardBrand>("unknown");
  const brand = mode === "stripe" ? stripeBrand : detectBrand(card.number);
  const canFlip = mode === "demo";

  const onStripeNumber = (e: StripeCardNumberElementChangeEvent) => {
    const b = (["visa", "mastercard", "amex", "unionpay"] as const).find((x) => x === e.brand) ?? "unknown";
    setStripeBrand(b);
    onStripeChange?.({ number: e.complete, brand: b, error: e.error?.message ?? null });
  };

  return (
    <div className="mx-auto w-full max-w-[420px]" style={{ perspective: "1400px" }}>
      <div
        ref={tiltRef}
        onPointerMove={onTiltMove}
        onPointerLeave={onTiltLeave}
        className="preserve-3d relative aspect-[1.586] w-full"
        style={{
          transform: `rotateX(var(--rx, 0deg)) rotateY(calc(var(--ry, 0deg) + ${flipped && canFlip ? 180 : 0}deg))`,
          transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* лицевая сторона */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,#1c1b20_0%,#0e0d10_45%,#16141a_100%)] p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9),0_0_40px_rgba(197,168,128,0.1)]">
          <span className="foil-sheen pointer-events-none absolute inset-0 opacity-80" aria-hidden />
          <Glyph className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-gold/[0.06]" strokeWidth={0.8} />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-9 w-12 rounded-md border border-gold/50 bg-[linear-gradient(135deg,#8a6d45,#e6d3ad,#8a6d45)] p-1" aria-hidden>
                <div className="grid h-full grid-cols-3 gap-px opacity-60">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="border border-[#5e4526]/60" />
                  ))}
                </div>
              </div>
              <BrandMark brand={brand} />
            </div>

            <div className="relative">
              <span className="mb-1 block font-display text-[0.5rem] tracking-[0.3em] text-gold/50">НОМЕР КАРТЫ</span>
              {mode === "stripe" ? (
                <CardNumberElement options={{ style: STRIPE_STYLE, showIcon: false, placeholder: "0000 0000 0000 0000" }} onChange={onStripeNumber} />
              ) : (
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-label="Номер карты"
                  aria-invalid={Boolean(errors.number)}
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={(e) => onChange({ number: formatCardNumber(e.target.value) })}
                  onFocus={() => setFlipped(false)}
                  className={clsx(field, "font-sans text-lg tracking-[0.18em] sm:text-xl")}
                />
              )}
              {errors.number && <span className={errorText}>{errors.number}</span>}
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="relative min-w-0 flex-1">
                <span className="mb-1 block font-display text-[0.5rem] tracking-[0.3em] text-gold/50">ВЛАДЕЛЕЦ</span>
                <input
                  autoComplete="cc-name"
                  aria-label="Имя владельца карты"
                  aria-invalid={Boolean(errors.name)}
                  placeholder="ELIZABETH CROWLEY"
                  value={card.name}
                  onChange={(e) => onChange({ name: e.target.value.toUpperCase().replace(/[^A-Z \-'.]/g, "") })}
                  onFocus={() => setFlipped(false)}
                  className={clsx(field, "font-display text-xs tracking-[0.18em]")}
                />
                {errors.name && <span className={errorText}>{errors.name}</span>}
              </div>
              <div className="relative w-20">
                <span className="mb-1 block font-display text-[0.5rem] tracking-[0.3em] text-gold/50">СРОК</span>
                {mode === "stripe" ? (
                  <CardExpiryElement options={{ style: { ...STRIPE_STYLE, base: { ...STRIPE_STYLE.base, fontSize: "14px" } } }} onChange={(e) => onStripeChange?.({ expiry: e.complete, error: e.error?.message ?? null })} />
                ) : (
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    aria-label="Срок действия"
                    aria-invalid={Boolean(errors.expiry)}
                    placeholder="ММ/ГГ"
                    value={card.expiry}
                    onChange={(e) => onChange({ expiry: formatExpiry(e.target.value) })}
                    onFocus={() => setFlipped(false)}
                    className={clsx(field, "font-sans text-sm tracking-[0.12em]")}
                  />
                )}
                {errors.expiry && <span className={errorText}>{errors.expiry}</span>}
              </div>
              {mode === "stripe" && (
                <div className="relative w-14">
                  <span className="mb-1 block font-display text-[0.5rem] tracking-[0.3em] text-gold/50">CVC</span>
                  <CardCvcElement options={{ style: { ...STRIPE_STYLE, base: { ...STRIPE_STYLE.base, fontSize: "14px" } }, placeholder: "•••" }} onChange={(e) => onStripeChange?.({ cvc: e.complete, error: e.error?.message ?? null })} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* оборотная сторона */}
        {canFlip && (
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,#16141a,#0e0d10)]" style={{ transform: "rotateY(180deg)" }}>
            <div className="mt-7 h-11 w-full bg-black" />
            <div className="mx-6 mt-5 flex items-center gap-3">
              <div className="h-9 flex-1 bg-[repeating-linear-gradient(45deg,#e9dfca_0_6px,#d8ccb3_6px_12px)]" />
              <div className="relative">
                <input
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  aria-label="CVC-код"
                  aria-invalid={Boolean(errors.cvc)}
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) => onChange({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  onFocus={() => setFlipped(true)}
                  onBlur={() => setFlipped(false)}
                  className="h-9 w-16 bg-parchment px-2 text-center font-sans text-sm tracking-[0.2em] text-obsidian placeholder:text-ash focus:outline-none"
                />
                {errors.cvc && <span className={errorText}>{errors.cvc}</span>}
              </div>
            </div>
            <p className="mx-6 mt-5 text-[0.55rem] leading-relaxed text-ash/70">Эта карта является пропуском в Храм. Найденную карту верните в бездну.</p>
            <p className="absolute bottom-5 right-6 font-display text-[0.55rem] tracking-[0.4em] text-gold/50">SARKHAN GRIM</p>
          </div>
        )}
      </div>
      {canFlip && (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mx-auto mt-6 block font-display text-[0.58rem] uppercase tracking-[0.26em] text-gold hover:text-parchment"
        >
          {flipped ? "← Лицевая сторона" : "Ввести CVC на обороте →"}
        </button>
      )}
    </div>
  );
}
