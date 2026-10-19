"use client";

import { formatPrice } from "@/lib/format";

export const PRICE_MIN = 30;
export const PRICE_MAX = 5000;
const STEPS = 1000;

// Логарифмическая шкала: дешёвые артефакты не теряются рядом с оригиналами за 5000 ₽.
const toPos = (price: number) => Math.round((Math.log(price / PRICE_MIN) / Math.log(PRICE_MAX / PRICE_MIN)) * STEPS);
const toPrice = (pos: number) => {
  const raw = PRICE_MIN * Math.pow(PRICE_MAX / PRICE_MIN, pos / STEPS);
  const step = raw < 100 ? 5 : raw < 1000 ? 10 : 100;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(raw / step) * step));
};

export function PriceRange({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const a = toPos(min);
  const b = toPos(max);
  return (
    <div>
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gold/20" />
        <div className="absolute top-1/2 h-px -translate-y-1/2 bg-gold" style={{ left: `${(a / STEPS) * 100}%`, right: `${100 - (b / STEPS) * 100}%` }} />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={a}
          onChange={(e) => onChange(Math.min(toPrice(Number(e.target.value)), max), max)}
          className="range-thumb absolute inset-0 w-full"
          aria-label="Минимальная цена"
          aria-valuetext={formatPrice(min)}
        />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={b}
          onChange={(e) => onChange(min, Math.max(toPrice(Number(e.target.value)), min))}
          className="range-thumb absolute inset-0 w-full"
          aria-label="Максимальная цена"
          aria-valuetext={formatPrice(max)}
        />
      </div>
      <div className="mt-2 flex justify-between font-display text-xs text-gold">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}
