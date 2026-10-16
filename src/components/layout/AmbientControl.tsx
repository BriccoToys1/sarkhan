"use client";

import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import { useAmbient } from "@/components/providers/Ambient";

export function AmbientControl() {
  const { playing, track, toggle } = useAmbient();
  return (
    <div className="fixed bottom-5 left-5 z-40 hidden items-center gap-3 rounded-full border border-gold/20 bg-abyss/80 py-2 pl-2 pr-4 shadow-gold-glow backdrop-blur-md sm:flex">
      <button
        type="button"
        onClick={() => toggle()}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors hover:bg-gold/20"
        aria-label={playing ? "Выключить эмбиент" : "Включить эмбиент бездны"}
        aria-pressed={playing}
      >
        {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-[0.55rem] tracking-[0.3em] text-gold/60">SARKHAN GRIM</span>
        <span className="text-[0.68rem] text-ash">{playing && track ? track.title : "Эмбиент безмолвия"}</span>
      </div>
      <div className={clsx("flex h-3 items-end gap-[3px] pl-1", playing && "wave-active")} aria-hidden>
        {[0, 0.15, 0.3, 0.45].map((d) => (
          <span key={d} className="wave-bar h-3 w-[2px] rounded-full bg-gold/60" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );
}
