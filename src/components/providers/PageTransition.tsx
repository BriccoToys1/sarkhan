"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Glyph } from "@/components/ui/Glyph";

type Phase = "idle" | "cover" | "reveal";

const TransitionContext = createContext<{ navigate: (href: string) => void }>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

const COVER_MS = 380;
const MIN_GLYPH_MS = 950;
const REVEAL_MS = 520;

/**
 * Смена страниц: затухание → секундный золотой глиф → появление (ТЗ, раздел 1).
 * Перехватывает клики по внутренним ссылкам, поэтому работает со всеми <Link>.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const startedAt = useRef(0);
  const fromPath = useRef(pathname);
  const timers = useRef<number[]>([]);

  const set = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const reveal = useCallback(() => {
    const wait = Math.max(0, MIN_GLYPH_MS - (Date.now() - startedAt.current));
    clearTimers();
    timers.current.push(
      window.setTimeout(() => {
        set("reveal");
        timers.current.push(window.setTimeout(() => set("idle"), REVEAL_MS));
      }, wait),
    );
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || phaseRef.current !== "idle") {
        router.push(href);
        return;
      }
      fromPath.current = window.location.pathname;
      startedAt.current = Date.now();
      set("cover");
      clearTimers();
      timers.current.push(window.setTimeout(() => router.push(href), COVER_MS));
      timers.current.push(window.setTimeout(() => reveal(), 4500));
    },
    [router, reveal],
  );

  useEffect(() => {
    if (phaseRef.current === "cover" && pathname !== fromPath.current) reveal();
  }, [pathname, reveal]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.dataset.transition === "off" || anchor.closest("[data-transition='off']")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/api")) return;
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [navigate]);

  useEffect(() => clearTimers, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-obsidian transition-opacity ease-out",
          phase === "idle" && "opacity-0 duration-0",
          phase === "cover" && "pointer-events-auto opacity-100 duration-[380ms]",
          phase === "reveal" && "opacity-0 duration-500",
        )}
      >
        {phase !== "idle" && (
          <div className="flex flex-col items-center gap-6 text-gold">
            <div className="relative">
              <div className="absolute inset-0 -m-10 rounded-full bg-gold/10 blur-3xl" />
              <Glyph animated className="relative h-24 w-24 drop-shadow-[0_0_18px_rgba(197,168,128,0.45)]" />
            </div>
            <span className="font-display text-[0.6rem] tracking-[0.6em] text-gold/70">SARKHAN GRIM</span>
          </div>
        )}
      </div>
    </TransitionContext.Provider>
  );
}
