"use client";

import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import type { VenueDTO } from "@/lib/types";
import { LANDMASSES } from "./landmasses";

const W = 1000;
const H = 400;
const TOP = 84;
const BOTTOM = -60;
const project = (lon: number, lat: number): [number, number] => [((lon + 180) / 360) * W, ((TOP - lat) / (TOP - BOTTOM)) * H];

const PATHS = LANDMASSES.map((poly) => "M" + poly.map(([lon, lat]) => project(lon, lat).map((n) => n.toFixed(1)).join(",")).join("L") + "Z");

const ROSES: [number, number, number][] = [
  [505, 135, 46],
  [260, 205, 30],
  [810, 220, 34],
];

function rhumbs() {
  const out: string[] = [];
  for (const [cx, cy] of ROSES) {
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      out.push(`M${cx},${cy}L${(cx + Math.cos(a) * 1400).toFixed(0)},${(cy + Math.sin(a) * 1400).toFixed(0)}`);
    }
  }
  return out.join("");
}

const RHUMBS = rhumbs();

function Rose({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 4 === 0 ? r : i % 2 === 0 ? r * 0.62 : r * 0.38;
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  });
  return (
    <g className="text-gold">
      <circle cx={cx} cy={cy} r={r * 1.08} fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth=".6" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth=".6" />
      <polygon points={pts.join(" ")} fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".7" strokeWidth=".6" />
      <text x={cx} y={cy - r * 1.18} textAnchor="middle" fontSize={r * 0.28} fill="currentColor" className="font-display">
        N
      </text>
    </g>
  );
}

export function PortolanMap({ venues }: { venues: VenueDTO[] }) {
  const [active, setActive] = useState<VenueDTO | null>(venues.find((v) => v.isStudio) ?? null);

  return (
    <div className="relative overflow-hidden border-2 border-gold/30 bg-[#0d0d0f] shadow-abyss">
      <div className="pointer-events-none absolute inset-2 z-10 border border-gold/15" />
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Карта-портулан с галереями, где выставляются работы Сархана Грима">
        <defs>
          <pattern id="waves" width="24" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 5 Q 6 1 12 5 T 24 5" fill="none" stroke="#c5a880" strokeOpacity=".07" strokeWidth=".6" />
          </pattern>
          <radialGradient id="land" cx=".5" cy=".4" r=".8">
            <stop offset="0" stopColor="#2a2318" />
            <stop offset="1" stopColor="#17140f" />
          </radialGradient>
          <clipPath id="sea">
            <rect width={W} height={H} />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#waves)" />
        <g clipPath="url(#sea)">
          <path d={RHUMBS} stroke="#c5a880" strokeOpacity=".09" strokeWidth=".5" fill="none" />
        </g>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`m${i}`} x1={(i * W) / 12} y1={0} x2={(i * W) / 12} y2={H} stroke="#c5a880" strokeOpacity=".05" strokeDasharray="2 6" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`p${i}`} x1={0} y1={(i * H) / 6} x2={W} y2={(i * H) / 6} stroke="#c5a880" strokeOpacity=".05" strokeDasharray="2 6" />
        ))}
        {PATHS.map((d, i) => (
          <path key={i} d={d} fill="url(#land)" stroke="#c5a880" strokeOpacity=".55" strokeWidth=".7" strokeLinejoin="round" />
        ))}
        {ROSES.map(([cx, cy, r]) => (
          <Rose key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
        <g className="font-display" fill="#c5a880" fillOpacity=".35" fontSize="9" letterSpacing="4">
          <text x="300" y="300">OCEANVS ATLANTICVS</text>
          <text x="590" y="330">MARE INDICVM</text>
          <text x="40" y="250">MARE PACIFICVM</text>
        </g>

        {venues.map((v) => {
          const [x, y] = project(v.longitude, v.latitude);
          const isActive = active?.id === v.id;
          return (
            <g
              key={v.id}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
              role="button"
              tabIndex={0}
              aria-label={`${v.city}: ${v.name}`}
              aria-pressed={isActive}
              onClick={() => setActive(v)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(v)}
              className="cursor-pointer outline-none"
              data-cursor="hover"
            >
              <circle r="14" fill="transparent" />
              <circle r={isActive ? 9 : 6} fill="#c5a880" fillOpacity=".2" className="animate-ping" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
              <circle r={v.isStudio ? 4.5 : 3.5} fill={isActive ? "#f3e2bb" : "#c5a880"} stroke="#0b0b0c" strokeWidth="1.2" />
              <text y={-10} textAnchor="middle" fontSize="8.5" letterSpacing="1.5" className={clsx("font-display transition-opacity", isActive ? "opacity-100" : "opacity-60")} fill="#e6d3ad">
                {v.city.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between border-t border-gold/15 px-5 py-3 font-display text-[0.55rem] uppercase tracking-[0.3em] text-gold/60">
        <span>MMXXVI · Portolan Chart</span>
        <span>Sarkhan Grim fecit</span>
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-14 left-4 right-4 z-20 border border-gold/40 bg-obsidian/95 p-5 backdrop-blur-md sm:left-auto sm:w-80"
          >
            <button type="button" onClick={() => setActive(null)} className="absolute right-3 top-3 text-ash hover:text-gold" aria-label="Закрыть">
              <X className="h-4 w-4" />
            </button>
            <p className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-gold">
              {active.city}, {active.country}
              {active.isStudio && " · мастерская"}
            </p>
            <h3 className="mt-2 font-serif text-xl text-parchment">{active.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ash">{active.description}</p>
            {active.address && <p className="mt-2 text-xs text-ash/70">{active.address}</p>}
            {active.url && (
              <a href={active.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-display text-[0.58rem] uppercase tracking-[0.22em] text-gold hover:text-parchment">
                Сайт галереи <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
