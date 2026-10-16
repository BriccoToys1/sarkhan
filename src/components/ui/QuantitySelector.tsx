"use client";

import { Minus, Plus } from "lucide-react";
import clsx from "clsx";

export function QuantitySelector({
  value,
  onChange,
  max,
  min = 1,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
  min?: number;
  size?: "sm" | "md";
}) {
  const btn = clsx("flex items-center justify-center text-ash transition-colors hover:text-gold disabled:opacity-30", size === "sm" ? "h-7 w-7" : "h-10 w-10");
  return (
    <div className="inline-flex items-center border border-gold/25" role="group" aria-label="Количество">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Уменьшить">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={clsx("min-w-8 text-center font-display text-gold", size === "sm" ? "text-xs" : "text-sm")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Увеличить">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
