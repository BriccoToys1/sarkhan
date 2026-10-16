"use client";

import { Music, VolumeX } from "lucide-react";
import clsx from "clsx";
import { useAmbient, type AmbientTrack } from "@/components/providers/Ambient";

export function AmbientButton({ track, className, compact = false }: { track: AmbientTrack; className?: string; compact?: boolean }) {
  const { playing, track: current, toggle } = useAmbient();
  const active = playing && current?.id === track.id;
  return (
    <button
      type="button"
      onClick={() => toggle(track)}
      aria-pressed={active}
      className={clsx(
        "group flex items-center gap-3 border bg-obsidian/60 font-display text-[0.6rem] uppercase tracking-[0.24em] backdrop-blur-md transition-colors",
        active ? "border-gold text-gold" : "border-gold/30 text-parchment hover:border-gold hover:text-gold",
        compact ? "h-11 w-11 justify-center" : "px-4 py-3",
        className,
      )}
      aria-label={active ? "Остановить звук коллекции" : `Включить звук коллекции «${track.title}»`}
    >
      {active ? <VolumeX className="h-4 w-4" /> : <Music className="h-4 w-4" />}
      {!compact && <span>{active ? "Тишина" : "Слушать лор"}</span>}
      {active && !compact && (
        <span className="wave-active flex h-3 items-end gap-[2px]" aria-hidden>
          {[0, 0.2, 0.4].map((d) => (
            <span key={d} className="wave-bar h-3 w-[2px] bg-gold" style={{ animationDelay: `${d}s` }} />
          ))}
        </span>
      )}
    </button>
  );
}
