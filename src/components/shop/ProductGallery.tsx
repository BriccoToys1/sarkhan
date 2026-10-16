"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import { ArtImage } from "@/components/ui/ArtImage";

/** Слайдер изображений с зумом при наведении и миниатюрами. */
export function ProductGallery({ images, title, priority = false }: { images: string[]; title: string; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="group relative aspect-[2/3] w-full overflow-hidden border border-gold/20 bg-obsidian"
        data-cursor="hover"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className={clsx("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "opacity-0")}
            aria-hidden={i !== index}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={zoom && i === index ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            >
              <ArtImage src={src} alt={`${title} — изображение ${i + 1}`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" preload={priority && i === 0} />
            </div>
          </div>
        ))}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-gold/20 bg-obsidian/70 text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label="Предыдущее изображение">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-gold/20 bg-obsidian/70 text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label="Следующее изображение">
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 font-display text-[0.6rem] tracking-[0.3em] text-gold/60">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
      {count > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={clsx("relative aspect-[2/3] w-16 overflow-hidden border transition-colors", i === index ? "border-gold" : "border-gold/15 opacity-60 hover:opacity-100")}
              aria-label={`Показать изображение ${i + 1}`}
              aria-current={i === index}
            >
              <ArtImage src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
