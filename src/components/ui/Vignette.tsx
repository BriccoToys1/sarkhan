import clsx from "clsx";

/** Гравюрная виньетка-разделитель. */
export function Vignette({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center justify-center gap-4 text-gold", className)} aria-hidden>
      <span className="hairline w-24 sm:w-40" />
      <svg viewBox="0 0 120 24" className="h-6 w-28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M2 12 C 20 12, 26 4, 38 6 C 46 8, 44 16, 38 16 C 33 16, 33 10, 38 10" />
        <path d="M118 12 C 100 12, 94 4, 82 6 C 74 8, 76 16, 82 16 C 87 16, 87 10, 82 10" />
        <path d="M60 3 L 66 12 L 60 21 L 54 12 Z" fill="currentColor" fillOpacity=".25" />
        <circle cx="47" cy="12" r="1.6" fill="currentColor" />
        <circle cx="73" cy="12" r="1.6" fill="currentColor" />
      </svg>
      <span className="hairline w-24 sm:w-40" />
    </div>
  );
}
