"use client";

import { useState } from "react";
import { ArtImage } from "@/components/ui/ArtImage";
import { ZoomViewer } from "@/components/gallery/ZoomViewer";

type Shot = { src: string; title: string; caption: string; wide?: boolean };

export function StudioGallery({ shots, videoUrl }: { shots: Shot[]; videoUrl?: string }) {
  const [open, setOpen] = useState<Shot | null>(null);
  return (
    <>
      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4">
        {videoUrl && (
          <div className="relative col-span-2 row-span-2 overflow-hidden border border-gold/15">
            <video src={videoUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline aria-label="Видео из мастерской" />
          </div>
        )}
        {shots.map((s) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setOpen(s)}
            className={`group relative overflow-hidden border border-gold/15 text-left ${s.wide ? "col-span-2 row-span-2" : ""}`}
          >
            <ArtImage src={s.src} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/95 to-transparent p-4">
              <span className="block font-serif text-lg text-parchment">{s.title}</span>
              <span className="block text-xs text-ash">{s.caption}</span>
            </span>
          </button>
        ))}
      </div>
      <ZoomViewer src={open?.src ?? null} title={open?.title ?? ""} caption={open?.caption} onClose={() => setOpen(null)} />
    </>
  );
}
