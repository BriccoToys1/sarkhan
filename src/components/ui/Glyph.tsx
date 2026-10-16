import clsx from "clsx";

/** Фирменный глиф Sarkhan Grim: круг, полумесяц, ось мира и треугольник стихий. */
export function Glyph({ className, animated = false, strokeWidth = 1.4 }: { className?: string; animated?: boolean; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={clsx(className, animated && "glyph-draw")} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden>
      <circle cx="50" cy="50" r="44" style={{ ["--len" as string]: 280 }} />
      <circle cx="50" cy="50" r="38" strokeOpacity=".45" style={{ ["--len" as string]: 240 }} />
      <path d="M 32 30 A 18 18 0 0 0 68 30 A 13 18 0 0 1 32 30 Z" style={{ ["--len" as string]: 120 }} />
      <path d="M 50 44 V 86" style={{ ["--len" as string]: 42 }} />
      <path d="M 38 66 H 62" style={{ ["--len" as string]: 24 }} />
      <path d="M 50 50 L 66 78 H 34 Z" strokeOpacity=".6" style={{ ["--len" as string]: 100 }} />
      <path d="M 50 8 V 14 M 50 86 V 92 M 8 50 H 14 M 86 50 H 92" style={{ ["--len" as string]: 6 }} />
    </svg>
  );
}
