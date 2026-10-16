// Сцены: карты, «предметные фото», картины, обложки.
import {
  arch,
  bat,
  crescent,
  doc,
  eye,
  f,
  flame,
  frameCorners,
  g,
  goldStroke,
  hexagram,
  lilithGlyph,
  planetRing,
  polar,
  ring,
  rng,
  rose,
  scribbleLines,
  serpentWave,
  star,
  stars,
  sun,
  text,
  ticks,
  treeOfLife,
  type Motif,
} from "./primitives";
import { solomonMotif } from "./motifs";

// ───────── Карты ─────────

export function tarotCard(motif: Motif, numeral: string, title: string, seed: number) {
  const W = 600;
  const H = 1000;
  const body = `<rect x="18" y="18" width="564" height="964" rx="16" fill="#0e0d10"/>
<rect x="18" y="18" width="564" height="964" rx="16" fill="url(#hatch)"/>
<g stroke="none">${stars(seed, 80, 520, 760, 40, 150)}</g>
${g(`<rect x="18" y="18" width="564" height="964" rx="16" stroke-width="2.6"/>
<rect x="34" y="34" width="532" height="932" rx="8" stroke-width="1"/>
${frameCorners(34, 34, 532, 932, 64, 1.4)}
${ring(300, 98, 40, 1.4)}${ticks(300, 98, 44, 50, 24, 0.8)}
<path d="M 82 878 L 518 878 L 546 910 L 518 942 L 82 942 L 54 910 Z" stroke-width="1.6" fill="#0b0b0c"/>
<path d="M 92 888 L 508 888 M 92 932 L 508 932" stroke-width="0.6"/>
${motif(300, 490, 215)}`)}
${text(300, 110, numeral, 32, { spacing: 4 })}
${text(300, 920, title, 25, { spacing: 6 })}`;
  return doc(W, H, body, { bg: "#000" });
}

export function cardBack() {
  const W = 600;
  const H = 1000;
  const defs = `<pattern id="lattice" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#c5a880" stroke-width=".7" stroke-opacity=".12"/><circle cx="20" cy="20" r="1.4" fill="#c5a880" fill-opacity=".25"/></pattern>`;
  const body = `<rect x="18" y="18" width="564" height="964" rx="16" fill="#0e0d10"/>
<rect x="34" y="34" width="532" height="932" rx="8" fill="url(#lattice)"/>
<circle cx="300" cy="500" r="250" fill="url(#glow)"/>
${g(`<rect x="18" y="18" width="564" height="964" rx="16" stroke-width="2.6"/>
<rect x="34" y="34" width="532" height="932" rx="8" stroke-width="1"/>
<rect x="52" y="52" width="496" height="896" rx="4" stroke-width="0.6"/>
${frameCorners(52, 52, 496, 896, 80, 1.6)}
${ring(300, 500, 205, 2)}${ring(300, 500, 190, 0.8)}${ticks(300, 500, 190, 205, 96, 0.7)}
${ring(300, 500, 120, 1.2)}
${hexagram(300, 500, 170, 1.8)}
${eye(300, 500, 62, 2.2, true)}
${crescent(300, 175, 46, -90, 0.5, 'stroke-width="2" fill="url(#gold)" fill-opacity=".2"')}
${crescent(300, 825, 46, 90, 0.5, 'stroke-width="2" fill="url(#gold)" fill-opacity=".2"')}
${star(300, 112, 14, 5, 8, 0, 'stroke-width="1" fill="url(#gold)"')}
${star(300, 888, 14, 5, 8, 0, 'stroke-width="1" fill="url(#gold)"')}
${planetRing(300, 500, 155, 30, 1.1, 25.7)}`)}`;
  return doc(W, H, body, { bg: "#000", defs });
}

// ───────── Предметная съёмка ─────────

function backdrop(w: number, h: number, floorY: number, tint = "#1b181c") {
  return `<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#0b0b0c"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141215"/><stop offset="1" stop-color="#060606"/></linearGradient>
<radialGradient id="spot" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#e9d6ae" stop-opacity=".2"/><stop offset=".6" stop-color="#c5a880" stop-opacity=".05"/><stop offset="1" stop-color="#c5a880" stop-opacity="0"/></radialGradient></defs>
<rect width="${w}" height="${floorY}" fill="url(#wall)"/>
<rect y="${floorY}" width="${w}" height="${h - floorY}" fill="url(#floor)"/>
<rect width="${w}" height="${h}" fill="url(#spot)"/>
<line x1="0" y1="${floorY}" x2="${w}" y2="${floorY}" stroke="#c5a880" stroke-opacity=".08"/>`;
}

const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.75) =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#000" opacity="${op}" filter="url(#soft)"/>`;

export function deckBox(motif: Motif, title: string, subtitle: string, tint = "#1b181c") {
  const W = 800;
  const H = 1200;
  const defs = `<linearGradient id="boxFront" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a181d"/><stop offset=".6" stop-color="#0f0e11"/><stop offset="1" stop-color="#09090a"/></linearGradient>`;
  const body = `${backdrop(W, H, 860, tint)}
${shadow(430, 900, 270, 30)}
<polygon points="230,300 570,300 612,262 272,262" fill="#1e1c21"/>
<polygon points="570,300 612,262 612,842 570,880" fill="#08080a"/>
<rect x="230" y="300" width="340" height="580" fill="url(#boxFront)"/>
${g(`<polygon points="230,300 570,300 612,262 272,262" stroke-width=".8" stroke-opacity=".5"/>
<rect x="246" y="316" width="308" height="548" stroke-width="1.2"/>
<rect x="254" y="324" width="292" height="532" stroke-width=".5"/>
${frameCorners(254, 324, 292, 532, 40, 1.1)}
${motif(400, 540, 118)}
<line x1="290" y1="730" x2="510" y2="730" stroke-width=".8"/>`)}
${text(400, 770, title, 21, { spacing: 4 })}
${text(400, 800, subtitle, 13, { spacing: 5, weight: 400 })}
${text(400, 842, "SARKHAN GRIM", 10, { spacing: 6, weight: 400 })}
<line x1="230" y1="300" x2="230" y2="880" stroke="#f3e2bb" stroke-opacity=".25"/>`;
  return doc(W, H, body, { defs });
}

function miniCard(x: number, y: number, w: number, h: number, inner: string) {
  return `<rect x="${f(x + 10)}" y="${f(y + 14)}" width="${w}" height="${h}" rx="12" fill="#000" opacity=".6" filter="url(#soft)"/>
<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="12" fill="#0e0d10"/>
${g(`<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="12" stroke-width="2"/>
<rect x="${f(x + 10)}" y="${f(y + 10)}" width="${f(w - 20)}" height="${f(h - 20)}" rx="6" stroke-width=".8"/>
${inner}`)}`;
}

export function cardsFan(motifs: Motif[], numerals: string[]) {
  const W = 800;
  const H = 1200;
  const cw = 250;
  const ch = 416;
  const px = 400;
  const py = 1010;
  const angles = [-26, -13, 0, 13, 26];
  const cards = angles
    .map((a, i) => {
      const x = px - cw / 2;
      const y = py - ch - 230;
      const cx = px;
      const cy = y + ch * 0.48;
      const motif = motifs[i % motifs.length];
      const inner = `${motif(cx, cy, 88)}${ring(cx, y + 36, 16, 1)}`;
      return `<g transform="rotate(${a} ${px} ${py})">${miniCard(x, y, cw, ch, inner)}${text(cx, y + 42, numerals[i % numerals.length], 13, { spacing: 2 })}</g>`;
    })
    .join("\n");
  return doc(W, H, `${backdrop(W, H, 900)}${shadow(400, 930, 300, 26)}${cards}`);
}

export function altarCloth() {
  const W = 800;
  const H = 1200;
  const defs = `<radialGradient id="velvet" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#a3262a"/><stop offset=".55" stop-color="#6e1215"/><stop offset="1" stop-color="#3c080a"/></radialGradient>`;
  let fringe = "";
  for (let t = 0; t <= 1; t += 0.018) {
    const lx = f(70 + 330 * t);
    const ly = f(690 + 200 * t);
    const rx = f(730 - 330 * t);
    fringe += `<line x1="${lx}" y1="${ly}" x2="${lx}" y2="${f(ly + 16)}"/><line x1="${rx}" y1="${ly}" x2="${rx}" y2="${f(ly + 16)}"/>`;
  }
  const body = `${backdrop(W, H, 760, "#1a1416")}
${shadow(400, 905, 330, 40, 0.8)}
<polygon points="70,690 400,490 730,690 400,890" fill="url(#velvet)"/>
<g stroke="#d9b98a" stroke-width="1.2" stroke-opacity=".75">${fringe}</g>
${g(`<polygon points="70,690 400,490 730,690 400,890" stroke-width="2.4"/>
<polygon points="110,690 400,515 690,690 400,865" stroke-width=".8" stroke-dasharray="6 5"/>
<g transform="translate(400 690) scale(1 .6) translate(-400 -690)">${solomonMotif(400, 690, 220)}</g>`)}
<ellipse cx="330" cy="620" rx="180" ry="60" fill="#fff" opacity=".05" filter="url(#soft)"/>
<circle cx="70" cy="690" r="9" fill="url(#gold)"/><circle cx="730" cy="690" r="9" fill="url(#gold)"/><circle cx="400" cy="890" r="9" fill="url(#gold)"/>
<path d="M 70 699 l -6 40 h 12 Z M 730 699 l -6 40 h 12 Z M 400 899 l -6 40 h 12 Z" fill="url(#gold)" opacity=".85"/>`;
  return doc(W, H, body, { defs });
}

export function altarClothDetail() {
  const W = 800;
  const H = 1200;
  const defs = `<radialGradient id="velvet" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#9a2125"/><stop offset=".6" stop-color="#651013"/><stop offset="1" stop-color="#330608"/></radialGradient>`;
  const body = `<rect width="${W}" height="${H}" fill="url(#velvet)"/>
<rect width="${W}" height="${H}" filter="url(#paint)" opacity=".5"/>
${g(`${solomonMotif(400, 600, 330)}${ring(400, 600, 360, 1, 'stroke-dasharray="3 6"')}`, goldStroke(2.2))}
<g stroke="none">${stars(44, 40, 800, 1200, 0, 0, "#f3e2bb")}</g>`;
  return doc(W, H, body, { defs, bg: "#3c080a" });
}

export type PaintTheme = {
  base: string;
  blobs: [string, number, number, number][];
  leaf?: { kind: "circle" | "arch" | "crescent"; x: number; y: number; r: number };
  motif: Motif;
  scale: number;
  cy?: number;
  color?: "gold" | "bone";
  seed: number;
};

function crackle(seed: number, x: number, y: number, w: number, h: number) {
  const r = rng(seed);
  let d = "";
  for (let i = 0; i < 70; i++) {
    let px = x + r() * w;
    let py = y + r() * h;
    d += `M ${f(px)} ${f(py)}`;
    for (let k = 0; k < 4; k++) {
      px += (r() - 0.5) * 34;
      py += (r() - 0.5) * 34;
      d += ` L ${f(px)} ${f(py)}`;
    }
  }
  return `<path d="${d}" fill="none" stroke="#000" stroke-width=".6" opacity=".18"/>`;
}

export function paintingCanvas(t: PaintTheme, x: number, y: number, w: number, h: number, id = "cv") {
  const defs = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  const blobs = t.blobs
    .map(([c, bx, by, br]) => `<circle cx="${f(x + bx * w)}" cy="${f(y + by * h)}" r="${f(br * w)}" fill="${c}"/>`)
    .join("");
  let leaf = "";
  if (t.leaf) {
    const lx = x + t.leaf.x * w;
    const ly = y + t.leaf.y * h;
    const lr = t.leaf.r * w;
    const shape =
      t.leaf.kind === "circle"
        ? `<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(lr)}"`
        : t.leaf.kind === "crescent"
          ? `<path d="M ${f(lx)} ${f(ly - lr)} A ${f(lr)} ${f(lr)} 0 1 0 ${f(lx)} ${f(ly + lr)} A ${f(lr * 0.55)} ${f(lr)} 0 1 1 ${f(lx)} ${f(ly - lr)} Z" transform="rotate(-25 ${f(lx)} ${f(ly)})"`
          : `<path d="M ${f(lx - lr)} ${f(y + h)} V ${f(ly)} A ${f(lr)} ${f(lr)} 0 0 1 ${f(lx + lr)} ${f(ly)} V ${f(y + h)} Z"`;
    leaf = `${shape} fill="url(#gold)" opacity=".92"/>${shape} fill="#000" filter="url(#leaf)"/>`;
  }
  const stroke = t.color === "bone" ? `fill="none" stroke="#ece3d0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` : goldStroke(2.2);
  const body = `<g clip-path="url(#${id})">
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${t.base}"/>
<g filter="url(#blur)" opacity=".9">${blobs}</g>
${leaf}
<rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#paint)" opacity=".9"/>
<g stroke="none" opacity=".7">${stars(t.seed, 40, w, h * 0.6, x, y, "#efe2c4")}</g>
<g ${stroke}>${t.motif(x + w / 2, y + h * (t.cy ?? 0.5), w * t.scale)}</g>
${crackle(t.seed + 3, x, y, w, h)}
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#vig)"/>
</g>`;
  return { defs, body };
}

export function artwork(t: PaintTheme) {
  const W = 900;
  const H = 1200;
  const { defs, body } = paintingCanvas(t, 0, 0, W, H);
  return doc(W, H, body, { defs, vignette: false, grain: 0.7 });
}

export function framedPainting(t: PaintTheme) {
  const W = 800;
  const H = 1200;
  const { defs, body } = paintingCanvas(t, 192, 252, 416, 596, "cvf");
  const frameDefs = `${defs}<linearGradient id="frameG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a4224"/><stop offset=".3" stop-color="#c9a76f"/><stop offset=".5" stop-color="#7a5a30"/><stop offset=".75" stop-color="#d8bb86"/><stop offset="1" stop-color="#4a3418"/></linearGradient>`;
  const out = `${backdrop(W, H, 1010, "#17151a")}
<polygon points="260,0 540,0 720,1010 80,1010" fill="#e9d6ae" opacity=".04"/>
<rect x="166" y="232" width="500" height="680" fill="#000" opacity=".7" filter="url(#soft)"/>
<rect x="150" y="210" width="500" height="680" fill="url(#frameG)"/>
<rect x="164" y="224" width="472" height="652" fill="none" stroke="#2c1f0f" stroke-width="3"/>
<rect x="176" y="236" width="448" height="628" fill="url(#frameG)" opacity=".8"/>
<rect x="186" y="246" width="428" height="608" fill="#1a130a"/>
${body}
<rect x="192" y="252" width="416" height="596" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="4"/>
<rect x="340" y="950" width="120" height="30" fill="url(#gold)" opacity=".65"/>
<line x1="356" y1="962" x2="444" y2="962" stroke="#3a2a14" stroke-width="1.4"/><line x1="370" y1="970" x2="430" y2="970" stroke="#3a2a14" stroke-width="1"/>`;
  return doc(W, H, out, { defs: frameDefs });
}

export function artPrint(motif: Motif, title: string, edition: string) {
  const W = 800;
  const H = 1200;
  const body = `${backdrop(W, H, 1000, "#19171a")}
<rect x="180" y="218" width="470" height="665" fill="#000" opacity=".6" filter="url(#soft)"/>
<rect x="165" y="200" width="470" height="665" fill="#efe7d7"/>
<rect x="165" y="200" width="470" height="665" filter="url(#paint)" opacity=".12"/>
<rect x="215" y="250" width="370" height="480" fill="#e6dbc5" stroke="#cbbfa6" stroke-width="2"/>
<line x1="217" y1="252" x2="583" y2="252" stroke="#fbf6ea" stroke-width="1.4"/>
<path d="M 240 730 V 400 A 160 160 0 0 1 560 400 V 730 Z" fill="url(#inkHatch)" opacity=".55"/>
<g fill="none" stroke="#1d1915" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${motif(400, 500, 150)}</g>
<text x="232" y="772" font-family="Georgia, serif" font-style="italic" font-size="15" fill="#6d665c">${edition}</text>
<text x="400" y="772" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="3" fill="#6d665c">${title}</text>
<path d="M 500 768 c 8 -14 14 -14 12 0 c -2 10 10 -12 18 -6 c 6 4 -4 12 6 8 c 10 -4 14 -12 22 -10 c 6 2 4 8 14 2" fill="none" stroke="#5f584e" stroke-width="1.4"/>
<circle cx="580" cy="820" r="22" fill="none" stroke="#d3c8b0" stroke-width="2"/>
<circle cx="580" cy="820" r="16" fill="none" stroke="#ddd3bd" stroke-width="1"/>
<text x="580" y="825" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#d0c4aa">SG</text>`;
  return doc(W, H, body);
}

export function printDetail(motif: Motif) {
  const W = 800;
  const H = 1200;
  const body = `<rect width="${W}" height="${H}" fill="#e9dfca"/>
<rect width="${W}" height="${H}" filter="url(#paint)" opacity=".18"/>
<rect width="${W}" height="${H}" fill="url(#inkHatch)" opacity=".35"/>
<g fill="none" stroke="#1d1915" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${motif(400, 600, 360)}</g>`;
  return doc(W, H, body, { bg: "#e9dfca", vignette: true, grain: 0.5 });
}

export function leatherBook(title: string) {
  const W = 800;
  const H = 1200;
  const defs = `<linearGradient id="leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b3a23"/><stop offset=".5" stop-color="#3f2716"/><stop offset="1" stop-color="#26170c"/></linearGradient>
<clipPath id="cover"><rect x="212" y="262" width="380" height="570" rx="12"/></clipPath>`;
  let pages = "";
  for (let i = 0; i < 14; i++) pages += `<line x1="${598 + i * 0.9}" y1="${276 + i}" x2="${598 + i * 0.9}" y2="${838 - i}" stroke="#a8946f" stroke-width=".5"/>`;
  const emboss = (dx: number, dy: number, color: string) =>
    `<g transform="translate(${dx} ${dy})" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round">${treeOfLife(410, 350, 62, 2.2, "#3f2716")}</g>`;
  const body = `${backdrop(W, H, 930, "#1b1714")}
${shadow(420, 935, 280, 34)}
<g transform="rotate(-4 400 560)">
<rect x="224" y="272" width="384" height="572" rx="8" fill="#d9c7a1"/>
${pages}
<rect x="212" y="262" width="380" height="570" rx="12" fill="url(#leather)"/>
<g clip-path="url(#cover)"><rect x="212" y="262" width="380" height="570" filter="url(#paint)" opacity=".75"/></g>
<rect x="212" y="262" width="40" height="570" rx="10" fill="#22140a" opacity=".75"/>
<path d="M 214 330 h 36 M 214 450 h 36 M 214 570 h 36 M 214 690 h 36" stroke="#6b4a2e" stroke-width="3"/>
<rect x="268" y="292" width="300" height="510" rx="6" fill="none" stroke="#24150b" stroke-width="2"/>
<rect x="270" y="294" width="300" height="510" rx="6" fill="none" stroke="#7a5638" stroke-width="1" stroke-opacity=".6"/>
${emboss(1.6, 1.6, "#1c1008")}${emboss(-1, -1, "#8c6545")}${emboss(0, 0, "#4b301d")}
${text(410, 770, title, 18, { spacing: 5 })}
<path d="M 212 274 v 40 l 40 -40 Z M 592 274 v 40 l -40 -40 Z M 212 820 v -40 l 40 40 Z M 592 820 v -40 l -40 40 Z" fill="url(#bronze)"/>
<rect x="560" y="520" width="76" height="58" rx="6" fill="url(#bronze)"/>
<rect x="566" y="526" width="64" height="46" rx="4" fill="none" stroke="#2b1c0b" stroke-width="1.4"/>
<circle cx="582" cy="549" r="5" fill="#2b1c0b"/><circle cx="614" cy="549" r="5" fill="#2b1c0b"/>
</g>`;
  return doc(W, H, body, { defs });
}

export function openGrimoire() {
  const W = 800;
  const H = 1200;
  const r = rng(77);
  const burnt = (x0: number, x1: number, y0: number, y1: number) => {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 18) pts.push(`${f(x)},${f(y0 + (r() - 0.5) * 8)}`);
    for (let y = y0; y <= y1; y += 18) pts.push(`${f(x1 + (r() - 0.5) * 8)},${f(y)}`);
    for (let x = x1; x >= x0; x -= 18) pts.push(`${f(x)},${f(y1 + (r() - 0.5) * 8)}`);
    for (let y = y1; y >= y0; y -= 18) pts.push(`${f(x0 + (r() - 0.5) * 8)},${f(y)}`);
    return pts.join(" ");
  };
  const defs = `<radialGradient id="page" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#ecdfc1"/><stop offset=".75" stop-color="#cdb48a"/><stop offset="1" stop-color="#7a5a35"/></radialGradient>
<linearGradient id="gutter" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`;
  const body = `${backdrop(W, H, 900, "#1a1613")}
${shadow(400, 905, 360, 36)}
<rect x="40" y="300" width="720" height="580" rx="12" fill="#2d1b0f"/>
<polygon points="${burnt(60, 392, 318, 862)}" fill="url(#page)"/>
<polygon points="${burnt(408, 740, 318, 862)}" fill="url(#page)"/>
<rect x="360" y="318" width="80" height="544" fill="url(#gutter)"/>
<g fill="none" stroke="#2a1f16" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${solomonMotif(226, 560, 120)}</g>
${scribbleLines(5, 110, 400, 230, 3, 26, "#3b2c1e")}
${scribbleLines(9, 110, 730, 230, 4, 26, "#3b2c1e")}
${scribbleLines(12, 450, 400, 250, 14, 28, "#3b2c1e")}
<g fill="none" stroke="#2a1f16" stroke-width="1.6">${rose(680, 800, 26, 1.2)}</g>
<path d="M 600 860 q 6 40 -4 80" stroke="#801818" stroke-width="5" fill="none"/>`;
  return doc(W, H, body, { defs });
}

export function candle() {
  const W = 800;
  const H = 1200;
  const defs = `<linearGradient id="wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121010"/><stop offset=".4" stop-color="#2f2a27"/><stop offset=".7" stop-color="#1c1917"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient>`;
  let herbs = "";
  for (let i = 0; i < 9; i++) {
    const x = 250 + i * 10;
    herbs += `<path d="M ${x} 905 q ${-20 + i * 3} -60 ${-30 + i * 4} -110" stroke="#5d6b4a" stroke-width="1.6" fill="none"/>`;
    herbs += `<ellipse cx="${x - 22 + i * 3}" cy="${840 - i * 4}" rx="4" ry="9" fill="#4e5b3c" transform="rotate(-30 ${x - 22 + i * 3} ${840 - i * 4})"/>`;
  }
  const body = `${backdrop(W, H, 905, "#1d1714")}
<circle cx="400" cy="460" r="420" fill="url(#flameGlow)" opacity=".7"/>
${shadow(400, 915, 200, 26)}
<ellipse cx="400" cy="908" rx="150" ry="28" fill="url(#gold)" opacity=".75"/>
<ellipse cx="400" cy="900" rx="128" ry="20" fill="#2a1f12"/>
<rect x="320" y="520" width="160" height="380" fill="url(#wax)"/>
<ellipse cx="400" cy="900" rx="80" ry="12" fill="#0f0d0c"/>
<ellipse cx="400" cy="520" rx="80" ry="16" fill="#2b2624"/>
<path d="M 330 522 q 4 40 -2 70 q 6 6 8 -4 q 2 -40 8 -60 Z M 440 524 q 6 60 0 110 q 8 6 10 -6 q 0 -60 4 -100 Z" fill="#2b2624"/>
<line x1="400" y1="520" x2="402" y2="490" stroke="#111" stroke-width="3"/>
${flame(401, 455, 36)}
${g(solomonMotif(400, 710, 58), goldStroke(1.4, 'stroke-opacity=".8"'))}
${herbs}`;
  return doc(W, H, body, { defs });
}

export function velvetPouch() {
  const W = 800;
  const H = 1200;
  const defs = `<radialGradient id="pouch" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3b2547"/><stop offset=".6" stop-color="#1f1328"/><stop offset="1" stop-color="#0e0812"/></radialGradient>`;
  const body = `${backdrop(W, H, 905, "#18141b")}
${shadow(400, 915, 230, 28)}
<path d="M 300 560 C 230 690 230 870 330 905 C 380 922 420 922 470 905 C 570 870 570 690 500 560 Z" fill="url(#pouch)"/>
<path d="M 300 560 C 290 520 320 480 345 500 C 360 470 385 470 400 495 C 415 470 440 470 455 500 C 480 480 510 520 500 560 Z" fill="#2a1a33"/>
<path d="M 300 560 C 230 690 230 870 330 905 C 380 922 420 922 470 905 C 570 870 570 690 500 560 Z" filter="url(#paint)" opacity=".5"/>
${g(`<path d="M 296 566 Q 400 590 504 566" stroke-width="5"/>
<path d="M 470 576 q 30 40 22 120 M 486 572 q 40 50 34 130" stroke-width="2.4"/>
${crescent(400, 720, 70, 0, 0.55, 'stroke-width="2" fill="url(#gold)" fill-opacity=".18"')}
${star(452, 690, 14, 5, 8, 0, 'stroke-width="1" fill="url(#gold)"')}
${star(468, 760, 8, 3, 8, 0, 'stroke-width="1" fill="url(#gold)"')}`, goldStroke(2))}
<path d="M 488 700 l -10 50 h 28 Z M 515 706 l -10 50 h 28 Z" fill="url(#gold)"/>`;
  return doc(W, H, body, { defs });
}

// ───────── Обложки ─────────

export function collectionCover(kind: "lilith" | "alchemy" | "bestiary") {
  const W = 1600;
  const H = 1000;
  const r = rng(kind.length * 31);
  let body = "";
  if (kind === "lilith") {
    let arches = "";
    for (let i = 0; i < 5; i++) arches += arch(200 + i * 300, 1000, 220, 820 - (i % 2) * 80, 1.2);
    body = `<rect width="${W}" height="${H}" fill="#120708"/>
<circle cx="800" cy="460" r="620" fill="url(#crimsonGlow)"/>
<g ${goldStroke(1.2, 'stroke-opacity=".2"')}>${arches}</g>
<g transform="rotate(-18 820 470)"><path d="M 820 150 A 320 320 0 1 0 820 790 A 180 320 0 1 1 820 150 Z" fill="url(#gold)" opacity=".9"/><path d="M 820 150 A 320 320 0 1 0 820 790 A 180 320 0 1 1 820 150 Z" fill="#000" filter="url(#leaf)"/></g>
${g(`${lilithGlyph(860, 500, 300, 3.4)}${serpentWave(220, 880, 1320, 26, 9, 3)}${ring(800, 470, 440, 1)}${ticks(800, 470, 440, 460, 120, 0.8)}`)}
<g stroke="none">${stars(r() * 1000, 160, W, H * 0.8)}</g>`;
  } else if (kind === "alchemy") {
    body = `<rect width="${W}" height="${H}" fill="#091012"/>
<circle cx="800" cy="500" r="560" fill="url(#glow)"/>
<rect width="${W}" height="${H}" fill="url(#hatch)"/>
${g(`${planetRing(800, 500, 450, 70, 1.6, 0)}${ring(800, 500, 420, 1)}${ring(800, 500, 480, 1)}${ticks(800, 500, 420, 480, 144, 0.6)}`, goldStroke(1.4, 'stroke-opacity=".55"'))}
${g(`<circle cx="800" cy="500" r="330" fill="none"/>`)}
${g(`${sun(260, 260, 70, 16, 2)}${crescent(1340, 260, 80, 0, 0.5, 'stroke-width="2.4" fill="url(#gold)" fill-opacity=".2"')}`)}
<g ${goldStroke(2.6)}><circle cx="800" cy="500" r="300" stroke-width="40" stroke-dasharray="20 8" stroke-opacity=".9"/><circle cx="800" cy="500" r="325" stroke-width="1.6"/><circle cx="800" cy="500" r="275" stroke-width="1.6"/>${hexagram(800, 500, 200, 3)}${eye(800, 500, 80, 2.6, true)}</g>
<g stroke="none">${stars(33, 120, W, H)}</g>`;
  } else {
    let bats = "";
    for (let i = 0; i < 9; i++) bats += bat(150 + r() * 1300, 100 + r() * 300, 30 + r() * 40);
    let thorns = "";
    for (let x = 0; x < W; x += 40) thorns += `<path d="M ${x} 1000 Q ${x + 20 + r() * 20} ${880 - r() * 80} ${x + 40} 1000" stroke-width="1.2"/>`;
    body = `<rect width="${W}" height="${H}" fill="#0f0b08"/>
<circle cx="800" cy="520" r="560" fill="url(#glow)"/>
<circle cx="1300" cy="200" r="90" fill="#e8dcc0" opacity=".85"/><circle cx="1330" cy="185" r="88" fill="#0f0b08"/>
${g(`${arch(800, 1000, 760, 900, 3)}${arch(800, 1000, 700, 860, 1.2)}${thorns}`)}
<g ${goldStroke(2.6)}>${bestiaryHeads(800, 560, 330)}</g>
<g stroke="none">${bats}${stars(57, 90, W, H * 0.5)}</g>`;
  }
  return doc(W, H, body, { bg: "#000" });
}

function bestiaryHeads(cx: number, cy: number, s: number) {
  return `${ring(cx, cy, s * 1.05, 1)}${flameRow(cx, cy + s * 0.95, s)}
<g>${headsOnly(cx, cy, s)}</g>`;
}

function headsOnly(cx: number, cy: number, s: number) {
  // три головы стража
  const h = (x: number, y: number, k: number) =>
    `<g transform="translate(${f(x)} ${f(y)}) scale(${k}) translate(${f(-x)} ${f(-y)})">${houndPath(x, y, s * 0.42)}</g>`;
  return h(cx - s * 0.5, cy + s * 0.12, 0.72) + h(cx + s * 0.5, cy + s * 0.12, 0.72) + h(cx, cy - s * 0.05, 1);
}

function houndPath(cx: number, cy: number, s: number) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<path d="M ${x(-0.42)} ${y(-0.25)} L ${x(-0.5)} ${y(-0.78)} L ${x(-0.18)} ${y(-0.42)} Q ${x(0)} ${y(-0.5)} ${x(0.18)} ${y(-0.42)} L ${x(0.5)} ${y(-0.78)} L ${x(0.42)} ${y(-0.25)} Q ${x(0.5)} ${y(0.05)} ${x(0.26)} ${y(0.3)} L ${x(0.12)} ${y(0.62)} Q ${x(0)} ${y(0.72)} ${x(-0.12)} ${y(0.62)} L ${x(-0.26)} ${y(0.3)} Q ${x(-0.5)} ${y(0.05)} ${x(-0.42)} ${y(-0.25)} Z" fill="#0b0b0c"/>
<path d="M ${x(-0.26)} ${y(-0.08)} L ${x(-0.1)} ${y(-0.02)} L ${x(-0.24)} ${y(0.04)} Z M ${x(0.26)} ${y(-0.08)} L ${x(0.1)} ${y(-0.02)} L ${x(0.24)} ${y(0.04)} Z" fill="#b8241f" stroke-width="1"/>
<path d="M ${x(-0.08)} ${y(0.5)} L ${x(0)} ${y(0.58)} L ${x(0.08)} ${y(0.5)} Z" fill="url(#gold)" stroke="none"/>
<path d="M ${x(0)} ${y(-0.4)} L ${x(0)} ${y(0.3)} M ${x(-0.32)} ${y(-0.6)} L ${x(-0.26)} ${y(-0.4)} M ${x(0.32)} ${y(-0.6)} L ${x(0.26)} ${y(-0.4)}" stroke-width="1"/>`;
}

function flameRow(cx: number, y: number, s: number) {
  let out = "";
  for (let i = -5; i <= 5; i++) {
    const x = cx + i * s * 0.16;
    const hgt = s * (0.18 + (5 - Math.abs(i)) * 0.03);
    out += `<path d="M ${f(x - s * 0.06)} ${f(y)} Q ${f(x - s * 0.05)} ${f(y - hgt * 0.6)} ${f(x)} ${f(y - hgt)} Q ${f(x + s * 0.05)} ${f(y - hgt * 0.6)} ${f(x + s * 0.06)} ${f(y)}" stroke-width="1.4"/>`;
  }
  return out;
}

export function guardianMotif(cx: number, cy: number, s: number) {
  return `${arch(cx, cy + s * 0.95, s * 1.6, s * 1.9, 2)}${arch(cx, cy + s * 0.95, s * 1.45, s * 1.78, 0.8)}${headsOnly(cx, cy, s)}${flameRow(cx, cy + s * 0.92, s)}`;
}

export function journalCover(motif: Motif, seed: number, tint: string) {
  const W = 1200;
  const H = 700;
  let rules = "";
  for (let y = 80; y < H; y += 34) rules += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  const body = `<rect width="${W}" height="${H}" fill="${tint}"/>
<circle cx="600" cy="350" r="420" fill="url(#glow)"/>
<g stroke="#c5a880" stroke-opacity=".06" stroke-width="1">${rules}</g>
<g stroke="none">${stars(seed, 110, W, H)}</g>
${g(`${ring(600, 350, 270, 1)}${ticks(600, 350, 270, 290, 90, 0.7)}${motif(600, 350, 230)}${frameCorners(30, 30, 1140, 640, 70, 1.2)}`)}`;
  return doc(W, H, body, { bg: "#000" });
}

// ───────── Мастерская и автор ─────────

export function portrait() {
  const W = 800;
  const H = 1000;
  const body = `<defs><clipPath id="win"><path d="M 220 1000 V 360 A 180 180 0 0 1 580 360 V 1000 Z"/></clipPath></defs>
<rect width="${W}" height="${H}" fill="#0b0a0c"/>
<g clip-path="url(#win)">
<path d="M 220 1000 V 360 A 180 180 0 0 1 580 360 V 1000 Z" fill="#141820"/>
<circle cx="470" cy="260" r="70" fill="#e9dfc8" opacity=".9"/>
<circle cx="500" cy="245" r="66" fill="#141820"/>
<g stroke="none">${stars(12, 40, 360, 500, 220, 180)}</g>
</g>
<path d="M 220 1000 V 360 A 180 180 0 0 1 580 360 V 1000" fill="none" stroke="#c5a880" stroke-opacity=".35" stroke-width="3"/>
<path d="M 400 300 C 300 300 268 420 270 520 C 230 600 150 700 120 1000 L 680 1000 C 650 700 570 600 530 520 C 532 420 500 300 400 300 Z" fill="#040404"/>
<path d="M 400 300 C 300 300 268 420 270 520 C 230 600 150 700 120 1000" fill="none" stroke="url(#gold)" stroke-width="2.2" stroke-opacity=".75"/>
<path d="M 400 300 C 500 300 532 420 530 520 C 570 600 650 700 680 1000" fill="none" stroke="url(#gold)" stroke-width="1.2" stroke-opacity=".35"/>
<path d="M 400 360 C 345 360 320 420 325 500 Q 400 540 475 500 C 480 420 455 360 400 360 Z" fill="#000"/>
<circle cx="380" cy="460" r="3" fill="#c5a880" opacity=".8"/><circle cx="420" cy="460" r="3" fill="#c5a880" opacity=".8"/>
<circle cx="400" cy="760" r="210" fill="url(#flameGlow)"/>
<rect x="385" y="740" width="30" height="110" fill="#2a2522"/>
${flame(400, 712, 24)}
<path d="M 330 850 Q 400 800 470 850 Q 430 880 400 870 Q 370 880 330 850 Z" fill="#0c0a09" stroke="url(#gold)" stroke-opacity=".5"/>`;
  return doc(W, H, body, { bg: "#000" });
}

export function studioShelves() {
  const W = 800;
  const H = 800;
  const r = rng(404);
  const palette = ["#3a1f16", "#1f2a24", "#2b1b2f", "#4a3420", "#1c1c22", "#5a1a18"];
  let books = "";
  for (const shelfY of [250, 470, 690]) {
    let x = 60;
    while (x < 740) {
      const bw = 18 + r() * 30;
      const bh = 120 + r() * 70;
      if (shelfY === 470 && x > 430 && x < 620) {
        x += 12;
        continue;
      }
      const c = palette[Math.floor(r() * palette.length)];
      books += `<rect x="${f(x)}" y="${f(shelfY - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${c}"/>`;
      books += `<line x1="${f(x + 3)}" y1="${f(shelfY - bh + 16)}" x2="${f(x + bw - 3)}" y2="${f(shelfY - bh + 16)}" stroke="#c5a880" stroke-opacity=".6"/>`;
      books += `<line x1="${f(x + 3)}" y1="${f(shelfY - 22)}" x2="${f(x + bw - 3)}" y2="${f(shelfY - 22)}" stroke="#c5a880" stroke-opacity=".5"/>`;
      x += bw + 2 + r() * 3;
    }
    books += `<rect x="40" y="${shelfY}" width="720" height="16" fill="#2a1d12"/><rect x="40" y="${shelfY}" width="720" height="3" fill="#5a4024"/>`;
  }
  const body = `<rect width="${W}" height="${H}" fill="#120f0d"/>
<circle cx="520" cy="380" r="330" fill="url(#flameGlow)" opacity=".6"/>
${books}
${g(skull(525, 420, 90, 2.2))}
<rect x="600" y="372" width="30" height="98" fill="#2a2522"/>
${flame(615, 350, 18)}`;
  return doc(W, H, body, { bg: "#000" });
}

function skull(cx: number, cy: number, s: number, sw: number) {
  // локальная копия, чтобы отрисовать кость с заливкой цвета слоновой кости
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<path d="M ${x(-0.5)} ${y(0.12)} C ${x(-0.62)} ${y(-0.72)} ${x(0.62)} ${y(-0.72)} ${x(0.5)} ${y(0.12)} C ${x(0.48)} ${y(0.22)} ${x(0.38)} ${y(0.26)} ${x(0.36)} ${y(0.32)} L ${x(0.32)} ${y(0.58)} L ${x(-0.32)} ${y(0.58)} L ${x(-0.36)} ${y(0.32)} C ${x(-0.38)} ${y(0.26)} ${x(-0.48)} ${y(0.22)} ${x(-0.5)} ${y(0.12)} Z" fill="#d9ccb0" stroke-width="${sw}"/>
<ellipse cx="${x(-0.2)}" cy="${y(0.02)}" rx="${f(s * 0.15)}" ry="${f(s * 0.13)}" fill="#120f0d" stroke="none"/>
<ellipse cx="${x(0.2)}" cy="${y(0.02)}" rx="${f(s * 0.15)}" ry="${f(s * 0.13)}" fill="#120f0d" stroke="none"/>
<path d="M ${x(0)} ${y(0.13)} L ${x(-0.06)} ${y(0.27)} L ${x(0.06)} ${y(0.27)} Z" fill="#120f0d" stroke="none"/>
<path d="M ${x(-0.25)} ${y(0.42)} H ${x(0.25)}" stroke="#120f0d" stroke-width="2"/>`;
}

export function studioHerbs() {
  const W = 800;
  const H = 800;
  const r = rng(808);
  let bundles = "";
  for (let i = 0; i < 6; i++) {
    const x = 110 + i * 115;
    const len = 220 + r() * 120;
    bundles += `<line x1="${x}" y1="96" x2="${x}" y2="140" stroke="#8a7350" stroke-width="2"/>`;
    for (let k = 0; k < 14; k++) {
      const dx = (r() - 0.5) * 70;
      bundles += `<path d="M ${x} 140 Q ${f(x + dx * 0.4)} ${f(140 + len * 0.5)} ${f(x + dx)} ${f(140 + len)}" stroke="${["#56603f", "#6b6a45", "#4a523a", "#7a5f3c"][k % 4]}" stroke-width="1.6" fill="none"/>`;
      for (let l = 0; l < 4; l++) {
        const t = 0.3 + l * 0.18;
        const lx = x + dx * t;
        const ly = 140 + len * t;
        bundles += `<ellipse cx="${f(lx)}" cy="${f(ly)}" rx="3.5" ry="9" fill="#55603c" opacity=".85" transform="rotate(${f(dx)} ${f(lx)} ${f(ly)})"/>`;
      }
    }
    bundles += `<rect x="${x - 10}" y="132" width="20" height="10" fill="#801818"/>`;
  }
  const body = `<rect width="${W}" height="${H}" fill="#110e0c"/>
<circle cx="400" cy="640" r="380" fill="url(#flameGlow)" opacity=".7"/>
<rect x="0" y="80" width="800" height="22" fill="#2b1d12"/>
${bundles}
<rect x="0" y="690" width="800" height="110" fill="#1a130d"/>
<rect x="250" y="600" width="26" height="92" fill="#2a2522"/>${flame(263, 580, 16)}
<rect x="520" y="620" width="22" height="72" fill="#2a2522"/>${flame(531, 602, 13)}
<ellipse cx="400" cy="690" rx="90" ry="14" fill="url(#gold)" opacity=".5"/>`;
  return doc(W, H, body, { bg: "#000" });
}

export function studioPress() {
  const W = 800;
  const H = 800;
  let spokes = "";
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = polar(400, 300, 30, i * 45);
    const [x2, y2] = polar(400, 300, 190, i * 45);
    spokes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="7"/>`;
    const [hx, hy] = polar(400, 300, 205, i * 45);
    spokes += `<circle cx="${hx}" cy="${hy}" r="10" fill="url(#bronze)" stroke="none"/>`;
  }
  const body = `<rect width="${W}" height="${H}" fill="#100e0d"/>
<circle cx="400" cy="320" r="360" fill="url(#glow)"/>
<g fill="none" stroke="url(#bronze)" stroke-linecap="round">${spokes}<circle cx="400" cy="300" r="190" stroke-width="3" stroke-opacity=".5"/></g>
<circle cx="400" cy="300" r="32" fill="url(#bronze)"/>
<rect x="120" y="520" width="560" height="40" fill="#2b2622"/>
<rect x="160" y="490" width="480" height="30" fill="#3b2a1c"/>
<rect x="250" y="470" width="300" height="22" fill="#b0703f"/>
<rect x="250" y="470" width="300" height="22" fill="#000" filter="url(#leaf)" opacity=".6"/>
<rect x="150" y="560" width="40" height="200" fill="#211c19"/><rect x="610" y="560" width="40" height="200" fill="#211c19"/>
<g stroke="none">${stars(3, 40, 800, 300)}</g>`;
  return doc(W, H, body, { bg: "#000" });
}

export function techniqueEtching(motif: Motif) {
  const W = 800;
  const H = 600;
  const defs = `<linearGradient id="copper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a4a26"/><stop offset=".45" stop-color="#d48b56"/><stop offset=".7" stop-color="#9a5a30"/><stop offset="1" stop-color="#5e301a"/></linearGradient>`;
  const body = `<rect width="${W}" height="${H}" fill="#141110"/>
<rect x="150" y="70" width="500" height="460" fill="#000" opacity=".6" filter="url(#soft)" transform="translate(10 12)"/>
<rect x="150" y="70" width="500" height="460" rx="4" fill="url(#copper)"/>
<g fill="none" stroke="#3a1a0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${motif(400, 300, 190)}</g>
<g fill="none" stroke="#f0b98a" stroke-width=".8" stroke-opacity=".6" transform="translate(-1 -1)">${motif(400, 300, 190)}</g>
<path d="M 620 560 L 760 400" stroke="#c9c2b8" stroke-width="6" stroke-linecap="round"/>
<path d="M 740 420 L 790 362" stroke="#5a3a22" stroke-width="16" stroke-linecap="round"/>`;
  return doc(W, H, body, { defs });
}

export function techniqueInk() {
  const W = 800;
  const H = 600;
  const body = `<rect width="${W}" height="${H}" fill="#e8dcc2"/>
<rect width="${W}" height="${H}" filter="url(#paint)" opacity=".2"/>
<g fill="none" stroke="#17130f" stroke-width="2.4" stroke-linecap="round">${rose(300, 300, 110, 2.4)}${serpentWave(120, 470, 520, 18, 5, 2)}</g>
<path d="M 300 300 L 300 300" />
${scribbleLines(31, 470, 140, 260, 9, 30, "#3b2c1e")}
<ellipse cx="640" cy="470" rx="70" ry="22" fill="#111"/>
<path d="M 570 470 V 420 Q 640 380 710 420 V 470" fill="#151515"/>
<ellipse cx="640" cy="420" rx="70" ry="18" fill="#000"/>
<path d="M 640 420 Q 600 260 520 120 Q 560 220 640 420" fill="#efe4cf" stroke="#3b2c1e" stroke-width="1.2"/>`;
  return doc(W, H, body, { bg: "#e8dcc2", grain: 0.6 });
}

export function techniqueDigital(motif: Motif) {
  const W = 800;
  const H = 600;
  const body = `<rect width="${W}" height="${H}" fill="#0d0e10"/>
<rect width="${W}" height="${H}" fill="url(#hatch)"/>
<rect x="110" y="60" width="580" height="480" rx="26" fill="#050506" stroke="#2a2a2e" stroke-width="3"/>
<rect x="140" y="90" width="520" height="420" rx="8" fill="#0e0d10"/>
<g opacity=".35">${g(`<rect x="200" y="120" width="220" height="360" rx="8" stroke-width="1"/>`)}</g>
<g opacity=".6">${g(`<rect x="250" y="110" width="220" height="360" rx="8" stroke-width="1"/>`)}</g>
${g(`<rect x="300" y="100" width="220" height="360" rx="8" stroke-width="1.6"/>${motif(410, 280, 90)}`)}
<g font-family="Georgia, serif" font-size="11" fill="#8e8e93"><text x="560" y="140">layer · ink</text><text x="560" y="166">layer · gold leaf</text><text x="560" y="192">layer · etching</text></g>
<rect x="548" y="130" width="6" height="6" fill="#c5a880"/><rect x="548" y="156" width="6" height="6" fill="#c5a880" opacity=".6"/><rect x="548" y="182" width="6" height="6" fill="#c5a880" opacity=".3"/>`;
  return doc(W, H, body, { bg: "#000" });
}
