"use client";

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatCents } from "@/lib/format";

/** Плавный «набор» суммы при изменении (центы). */
export function CountUp({ cents, className }: { cents: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = useMotionValue(cents);
  const reduce = useReducedMotion();

  useEffect(() => {
    const unsub = value.on("change", (v) => {
      if (ref.current) ref.current.textContent = formatCents(Math.round(v));
    });
    return unsub;
  }, [value]);

  useEffect(() => {
    if (reduce) {
      value.jump(cents);
      if (ref.current) ref.current.textContent = formatCents(cents);
      return;
    }
    const controls = animate(value, cents, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [cents, reduce, value]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {formatCents(cents)}
    </span>
  );
}
