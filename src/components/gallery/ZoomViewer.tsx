"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, RotateCcw, Search, X } from "lucide-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "@/hooks/useModal";

const MIN = 1;
const MAX = 8;

type View = { scale: number; x: number; y: number };

/** Оверлей сверхвысокого разрешения: колесо/щипок — зум, перетаскивание — панорама, режим «Лупа». */
export function ZoomViewer({ src, title, caption, onClose }: { src: string | null; title: string; caption?: string; onClose: () => void }) {
  return <AnimatePresence>{src && <ZoomPanel key={src} src={src} title={title} caption={caption} onClose={onClose} />}</AnimatePresence>;
}

function ZoomPanel({ src, title, caption, onClose }: { src: string; title: string; caption?: string; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [loupe, setLoupe] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number; ix: number; iy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  useModal(true, panel, onClose);

  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    setView((v) => {
      const scale = Math.min(MAX, Math.max(MIN, v.scale * factor));
      const k = scale / v.scale;
      const x = scale === 1 ? 0 : cx - k * (cx - v.x);
      const y = scale === 1 ? 0 : cy - k * (cy - v.y);
      return { scale, x, y };
    });
  }, []);

  const center = () => {
    const r = stage.current?.getBoundingClientRect();
    return r ? { x: 0, y: 0, w: r.width, h: r.height } : { x: 0, y: 0, w: 0, h: 0 };
  };

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [src, zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    } else if (!loupe) {
      drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const r = stage.current?.getBoundingClientRect();
    if (loupe && r && e.pointerType === "mouse") {
      const img = stage.current?.querySelector("img")?.getBoundingClientRect();
      if (img) setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: img.width, h: img.height, ix: e.clientX - img.left, iy: e.clientY - img.top });
    }
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2 && r) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const target = Math.min(MAX, Math.max(MIN, pinch.current.scale * (dist / pinch.current.dist)));
      zoomAt(target / view.scale, (a.x + b.x) / 2 - r.left - r.width / 2, (a.y + b.y) / 2 - r.top - r.height / 2);
      return;
    }
    if (drag.current && view.scale > 1) {
      setView((v) => ({ ...v, x: drag.current!.vx + (e.clientX - drag.current!.x), y: drag.current!.vy + (e.clientY - drag.current!.y) }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const LENS = 220;
  const MAG = 3;

  return (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={`Лупа: ${title}`}
          tabIndex={-1}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-gold/10 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate font-serif text-xl text-parchment">{title}</p>
              {caption && <p className="truncate text-xs text-ash">{caption}</p>}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setLoupe((l) => !l)} aria-pressed={loupe} className={clsx("hidden h-10 items-center gap-2 border px-3 font-display text-[0.6rem] uppercase tracking-[0.2em] transition-colors md:flex", loupe ? "border-gold text-gold" : "border-gold/20 text-ash hover:text-gold")}>
                <Search className="h-4 w-4" /> Лупа
              </button>
              <button type="button" onClick={() => zoomAt(1 / 1.5, center().x, center().y)} className="flex h-10 w-10 items-center justify-center text-ash hover:text-gold" aria-label="Отдалить">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-display text-xs text-gold">{Math.round(view.scale * 100)}%</span>
              <button type="button" onClick={() => zoomAt(1.5, center().x, center().y)} className="flex h-10 w-10 items-center justify-center text-ash hover:text-gold" aria-label="Приблизить">
                <Plus className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setView({ scale: 1, x: 0, y: 0 })} className="flex h-10 w-10 items-center justify-center text-ash hover:text-gold" aria-label="Сбросить масштаб">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button type="button" onClick={onClose} className="ml-2 flex h-10 w-10 items-center justify-center text-ash hover:text-gold" aria-label="Закрыть">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div
            ref={stage}
            className={clsx("relative flex-1 touch-none select-none overflow-hidden", view.scale > 1 && !loupe ? "cursor-grab active:cursor-grabbing" : "")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={() => setLens(null)}
            onDoubleClick={(e) => {
              const r = stage.current!.getBoundingClientRect();
              if (view.scale > 1) setView({ scale: 1, x: 0, y: 0 });
              else zoomAt(2.5, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-150 ease-out will-change-transform"
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} className="max-h-full max-w-full object-contain shadow-[0_0_80px_rgba(197,168,128,0.12)]" draggable={false} />
            </div>
            {loupe && lens && (
              <div
                className="pointer-events-none absolute rounded-full border-2 border-gold shadow-[0_0_30px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.6)]"
                style={{
                  width: LENS,
                  height: LENS,
                  left: lens.x - LENS / 2,
                  top: lens.y - LENS / 2,
                  backgroundImage: `url("${src}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${lens.w * MAG}px ${lens.h * MAG}px`,
                  backgroundPosition: `${-(lens.ix * MAG - LENS / 2)}px ${-(lens.iy * MAG - LENS / 2)}px`,
                }}
              />
            )}
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[0.55rem] uppercase tracking-[0.3em] text-ash/70">
              Колесо или щипок — масштаб · Перетаскивание — панорама · Двойной клик — приблизить
            </p>
          </div>
        </motion.div>
  );
}
