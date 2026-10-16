// Генерирует демонстрационные SVG-иллюстрации в public/art.
// Запуск: npm run art
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import * as M from "./art/motifs";
import * as S from "./art/scenes";
import type { Motif } from "./art/primitives";
import { skull, scythe, crescent, ring, ticks, eye, lilithGlyph, serpentWave, treeOfLife, f } from "./art/primitives";

const OUT = join(process.cwd(), "public", "art");
let count = 0;

function write(rel: string, svg: string) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg.replace(/\n\s*\n/g, "\n"));
  count++;
}

// ── Оракул ──
const ORACLE: [string, Motif, string, string][] = [
  ["magician", M.magician, "I", "THE MAGICIAN"],
  ["priestess", M.priestess, "II", "THE HIGH PRIESTESS"],
  ["hermit", M.hermit, "IX", "THE HERMIT"],
  ["wheel", M.wheel, "X", "WHEEL OF FORTUNE"],
  ["death", M.death, "XIII", "DEATH"],
  ["devil", M.devil, "XV", "THE DEVIL"],
  ["star", M.starCard, "XVII", "THE STAR"],
  ["moon", M.moon, "XVIII", "THE MOON"],
  ["sun", M.sunCard, "XIX", "THE SUN"],
  ["world", M.world, "XXI", "THE WORLD"],
];
ORACLE.forEach(([slug, motif, num, title], i) => write(`oracle/${slug}.svg`, S.tarotCard(motif, num, title, 100 + i)));
write("oracle/back.svg", S.cardBack());

// ── Картины ──
const deathCanvas = (cx: number, cy: number, s: number) =>
  `${skull(cx, cy - s * 0.15, s * 0.7, 2.6)}
<path d="M ${f(cx - s * 0.75)} ${f(cy + s * 0.75)} C ${f(cx - s * 0.7)} ${f(cy + s * 0.35)} ${f(cx - s * 0.45)} ${f(cy + s * 0.3)} ${f(cx - s * 0.25)} ${f(cy + s * 0.28)} M ${f(cx + s * 0.75)} ${f(cy + s * 0.75)} C ${f(cx + s * 0.7)} ${f(cy + s * 0.35)} ${f(cx + s * 0.45)} ${f(cy + s * 0.3)} ${f(cx + s * 0.25)} ${f(cy + s * 0.28)}" stroke-width="3"/>
<path d="M ${f(cx - s * 0.55)} ${f(cy + s * 0.5)} q ${f(s * 0.12)} ${f(-s * 0.1)} ${f(s * 0.24)} 0 q ${f(s * 0.12)} ${f(-s * 0.1)} ${f(s * 0.24)} 0 M ${f(cx + s * 0.07)} ${f(cy + s * 0.5)} q ${f(s * 0.12)} ${f(-s * 0.1)} ${f(s * 0.24)} 0 q ${f(s * 0.12)} ${f(-s * 0.1)} ${f(s * 0.24)} 0" stroke-width="2"/>
${scythe(cx + s * 0.62, cy - s * 0.95, s * 1.85, 2.4)}`;

const lilithCanvas = (cx: number, cy: number, s: number) =>
  `${lilithGlyph(cx, cy - s * 0.05, s * 0.85, 3)}${serpentWave(cx - s * 0.85, cy + s * 0.8, cx + s * 0.6, s * 0.08, 5, 2.6)}${eye(cx, cy - s * 0.75, s * 0.13, 1.6, true)}`;

const moonKeeper = (cx: number, cy: number, s: number) => {
  let phases = "";
  for (let i = 0; i < 7; i++) {
    const x = cx - s * 0.75 + i * s * 0.25;
    phases += ring(x, cy + s * 0.88, s * 0.07, 1.4);
    if (i !== 3) phases += crescent(x, cy + s * 0.88, s * 0.07, i < 3 ? 180 : 0, 0.5, 'fill="url(#gold)" stroke="none"');
    else phases += `<circle cx="${f(x)}" cy="${f(cy + s * 0.88)}" r="${f(s * 0.07)}" fill="url(#gold)" stroke="none"/>`;
  }
  return `${crescent(cx, cy - s * 0.15, s * 0.6, 0, 0.62, 'stroke-width="2.6"')}${eye(cx + s * 0.05, cy - s * 0.15, s * 0.22, 1.8, true)}${phases}`;
};

const ART: [string, S.PaintTheme][] = [
  ["lilith-triumph", { base: "#2a0a0c", blobs: [["#6b1014", 0.5, 0.45, 0.45], ["#120406", 0.1, 0.9, 0.4], ["#3a0d10", 0.9, 0.2, 0.3]], leaf: { kind: "crescent", x: 0.52, y: 0.42, r: 0.36 }, motif: lilithCanvas, scale: 0.42, cy: 0.5, color: "bone", seed: 11 }],
  ["anatomy-of-death", { base: "#1a130c", blobs: [["#3b2a17", 0.5, 0.4, 0.5], ["#0b0806", 0.5, 1, 0.5]], leaf: { kind: "circle", x: 0.5, y: 0.38, r: 0.38 }, motif: deathCanvas, scale: 0.4, cy: 0.5, color: "bone", seed: 21 }],
  ["threshold-guardian", { base: "#0f0d0b", blobs: [["#2a1d12", 0.5, 0.5, 0.5], ["#5a1a12", 0.5, 0.95, 0.35]], leaf: { kind: "arch", x: 0.5, y: 0.42, r: 0.36 }, motif: S.guardianMotif, scale: 0.36, cy: 0.52, color: "gold", seed: 31 }],
  ["nigredo", { base: "#070707", blobs: [["#1c1a16", 0.5, 0.4, 0.5], ["#2b2010", 0.5, 0.5, 0.25]], motif: M.blackSun, scale: 0.42, cy: 0.42, color: "gold", seed: 41 }],
  ["sephirot", { base: "#0a0f1a", blobs: [["#18233b", 0.5, 0.4, 0.5], ["#06080e", 0.5, 1, 0.4]], motif: (cx, cy, s) => `${ring(cx, cy, s, 1)}${ticks(cx, cy, s, s * 1.06, 72, 0.7)}${treeOfLife(cx, cy - s * 0.9, s * 0.32)}`, scale: 0.42, cy: 0.5, color: "gold", seed: 51 }],
  ["opus-magnum", { base: "#0b1311", blobs: [["#183029", 0.5, 0.5, 0.5], ["#2e2a12", 0.5, 0.5, 0.2]], leaf: { kind: "circle", x: 0.5, y: 0.48, r: 0.16 }, motif: M.ouroborosMotif, scale: 0.42, cy: 0.48, color: "gold", seed: 61 }],
  ["moon-keeper", { base: "#0c0a14", blobs: [["#241c3a", 0.4, 0.35, 0.45], ["#3a0f18", 0.8, 0.9, 0.3]], leaf: { kind: "circle", x: 0.5, y: 0.4, r: 0.3 }, motif: moonKeeper, scale: 0.42, cy: 0.5, color: "bone", seed: 71 }],
  ["rose-cross", { base: "#140a0a", blobs: [["#4a1414", 0.5, 0.5, 0.4], ["#0c0606", 0.1, 0.1, 0.4]], leaf: { kind: "arch", x: 0.5, y: 0.35, r: 0.4 }, motif: M.roseCross, scale: 0.4, cy: 0.52, color: "bone", seed: 81 }],
  ["goetia-gate", { base: "#0c0b0a", blobs: [["#2a2216", 0.5, 0.5, 0.5]], motif: M.solomonMotif, scale: 0.44, cy: 0.5, color: "gold", seed: 91 }],
];

const themes = Object.fromEntries(ART);
ART.forEach(([slug, theme]) => write(`gallery/${slug}.svg`, S.artwork(theme)));

// ── Товары ──
write("products/lilith-deck-box.svg", S.deckBox(M.lilithMotif, "THE SHADOW", "OF LILITH · TAROT", "#1e1014"));
write("products/lilith-deck-cards.svg", S.cardsFan([M.priestess, M.moon, M.lilithMotif, M.starCard, M.devil], ["II", "XVIII", "0", "XVII", "XV"]));
write("products/solomon-cloth.svg", S.altarCloth());
write("products/solomon-cloth-detail.svg", S.altarClothDetail());
write("products/death-xiii-painting.svg", S.framedPainting({ ...themes["anatomy-of-death"], seed: 22 }));
write("products/death-xiii-detail.svg", S.artwork({ ...themes["anatomy-of-death"], scale: 0.7, cy: 0.42 }));
write("products/guardian-print.svg", S.artPrint(S.guardianMotif, "THE THRESHOLD GUARDIAN", "12/100"));
write("products/guardian-print-detail.svg", S.printDetail(S.guardianMotif));
write("products/goetia-book.svg", S.leatherBook("ARS GOETIA"));
write("products/goetia-book-open.svg", S.openGrimoire());
write("products/hermetic-deck-box.svg", S.deckBox(M.hermeticMotif, "HERMETIC LIGHT", "ORACLE · 44 CARDS", "#10171a"));
write("products/hermetic-deck-cards.svg", S.cardsFan([M.magician, M.sunCard, M.hermeticMotif, M.wheel, M.world], ["I", "XIX", "✦", "X", "XXI"]));
write("products/bestiary-deck-box.svg", S.deckBox(M.bestiaryMotif, "BESTIARIUM", "INFERNALE · TAROT", "#17120d"));
write("products/bestiary-deck-cards.svg", S.cardsFan([M.moon, M.devil, M.bestiaryMotif, M.death, M.hermit], ["XVIII", "XV", "✦", "XIII", "IX"]));
write("products/ouroboros-print.svg", S.artPrint(M.ouroborosMotif, "OPUS MAGNUM", "37/150"));
write("products/ouroboros-print-detail.svg", S.printDetail(M.ouroborosMotif));
write("products/nigredo-painting.svg", S.framedPainting({ ...themes["nigredo"], seed: 42 }));
write("products/nigredo-detail.svg", S.artwork({ ...themes["nigredo"], scale: 0.62 }));
write("products/altar-candle.svg", S.candle());
write("products/altar-candle-detail.svg", S.artwork({ base: "#1a120b", blobs: [["#5a3a16", 0.5, 0.45, 0.4]], motif: M.chaliceMotif, scale: 0.4, color: "gold", seed: 13 }));
write("products/velvet-pouch.svg", S.velvetPouch());
write("products/velvet-pouch-detail.svg", S.artwork({ base: "#140c1a", blobs: [["#2d1b36", 0.5, 0.5, 0.5]], motif: (cx, cy, s) => crescent(cx, cy, s * 0.8, 0, 0.55, 'stroke-width="3"'), scale: 0.4, color: "gold", seed: 14 }));
write("products/lilith-print.svg", S.artPrint(M.lilithMotif, "LILITH ENTHRONED", "5/50"));
write("products/lilith-print-detail.svg", S.printDetail(M.lilithMotif));
write("products/moon-keeper-painting.svg", S.framedPainting({ ...themes["moon-keeper"], seed: 72 }));
write("products/moon-keeper-detail.svg", S.artwork({ ...themes["moon-keeper"], scale: 0.62 }));
write("products/codex-book.svg", S.leatherBook("CODEX ALCHEMICUS"));
write("products/codex-book-open.svg", S.openGrimoire());

// ── Коллекции ──
write("collections/lilith.svg", S.collectionCover("lilith"));
write("collections/alchemy.svg", S.collectionCover("alchemy"));
write("collections/bestiary.svg", S.collectionCover("bestiary"));

// ── Журнал ──
write("journal/symbolism.svg", S.journalCover(M.hermeticMotif, 201, "#0c0b0d"));
write("journal/tarot-history.svg", S.journalCover(M.wheel, 202, "#0d0b09"));
write("journal/alchemy-art.svg", S.journalCover(M.ouroborosMotif, 203, "#090d0c"));
write("journal/studio-news.svg", S.journalCover(M.solomonMotif, 204, "#0d0909"));
write("journal/lilith.svg", S.journalCover(M.lilithMotif, 205, "#100809"));

// ── Мастерская ──
write("about/portrait.svg", S.portrait());
write("about/studio-shelves.svg", S.studioShelves());
write("about/studio-herbs.svg", S.studioHerbs());
write("about/studio-press.svg", S.studioPress());
write("about/technique-etching.svg", S.techniqueEtching(M.death));
write("about/technique-ink.svg", S.techniqueInk());
write("about/technique-digital.svg", S.techniqueDigital(M.lilithMotif));

console.log(`Сгенерировано SVG: ${count} → public/art`);
