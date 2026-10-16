"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const INTERACTIVE = "a, button, [role='button'], select, summary, label[for], [data-cursor='hover'], input[type='checkbox'], input[type='radio'], input[type='range']";

/**
 * Золотая точка, которая над интерактивными элементами раскрывается
 * во фрактальное кольцо с перекрестием — «прицел алхимического прибора».
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      setHidden(false);
    };
    const onOver = (e: Event) => setHover(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    const onLeave = () => setHidden(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className={clsx("pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300", hidden ? "opacity-0" : "opacity-100")}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className={clsx(
            "-translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
            hover ? "h-14 w-14" : "h-7 w-7",
            pressed && "scale-75",
          )}
        >
          <svg viewBox="0 0 56 56" className={clsx("h-full w-full text-gold", hover && "animate-spin-slow")} fill="none" stroke="currentColor">
            <circle cx="28" cy="28" r="26" strokeWidth="0.8" strokeOpacity={hover ? 0.9 : 0.4} />
            <g className={clsx("transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")} strokeWidth="0.7">
              <circle cx="28" cy="28" r="19" strokeDasharray="2 3" strokeOpacity=".7" />
              <circle cx="28" cy="28" r="11" strokeOpacity=".45" />
              <path d="M28 0v10M28 46v10M0 28h10M46 28h10" />
              <path d="M28 20v4M28 32v4M20 28h4M32 28h4" strokeOpacity=".8" />
              <path d="M9.6 9.6l3.5 3.5M42.9 42.9l3.5 3.5M46.4 9.6l-3.5 3.5M13.1 42.9l-3.5 3.5" strokeOpacity=".5" />
            </g>
          </svg>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div
          className={clsx(
            "-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_rgba(197,168,128,0.8)] transition-all duration-300",
            hover ? "h-1 w-1 bg-parchment" : "h-2 w-2",
          )}
        />
      </div>
    </div>
  );
}
