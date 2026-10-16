import clsx from "clsx";

/** Крутящееся золотое колесо Уробороса — индикатор загрузки. */
export function Ouroboros({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={clsx("animate-spin", className)} style={{ animationDuration: "1.6s" }} aria-hidden>
      <defs>
        <linearGradient id="ouro-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6d45" />
          <stop offset=".5" stopColor="#f3e2bb" />
          <stop offset="1" stopColor="#8a6d45" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="17" fill="none" stroke="url(#ouro-g)" strokeWidth="4.5" strokeDasharray="3 1.6" />
      <path d="M 24 4.2 q 6.5 -1.4 8.6 3.6 q -5 2.2 -8.6 -0.6 Z" fill="#c5a880" />
      <circle cx="28.5" cy="5.2" r="0.9" fill="#0b0b0c" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="#c5a880" strokeOpacity=".5" strokeWidth="1" />
    </svg>
  );
}
