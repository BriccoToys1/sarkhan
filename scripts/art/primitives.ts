// Примитивы для генерации SVG-гравюр в стиле Sarkhan Grim.
// Каждая функция возвращает фрагмент SVG-разметки.

export const f = (n: number) => Number(n.toFixed(1));

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];
}

export const SERIF = `Cinzel, 'Cormorant Garamond', Georgia, 'Times New Roman', serif`;

export type Motif = (cx: number, cy: number, s: number) => string;

export function doc(
  w: number,
  h: number,
  body: string,
  opts: { bg?: string; defs?: string; grain?: number; vignette?: boolean } = {},
) {
  const { bg = "#0b0b0c", defs = "", grain = 0.9, vignette = true } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${f(w * 0.55)}" y2="${f(h * 0.4)}" spreadMethod="reflect">
<stop offset="0" stop-color="#6e532f"/><stop offset=".3" stop-color="#c5a880"/><stop offset=".52" stop-color="#f3e2bb"/><stop offset=".74" stop-color="#b08d5c"/><stop offset="1" stop-color="#5e4526"/>
</linearGradient>
<linearGradient id="bronze" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${f(w * 0.3)}" y2="${f(h * 0.2)}" spreadMethod="reflect">
<stop offset="0" stop-color="#4a3418"/><stop offset=".5" stop-color="#b98a4e"/><stop offset="1" stop-color="#3b2812"/>
</linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#c5a880" stop-opacity=".32"/><stop offset=".55" stop-color="#c5a880" stop-opacity=".08"/><stop offset="1" stop-color="#c5a880" stop-opacity="0"/></radialGradient>
<radialGradient id="crimsonGlow"><stop offset="0" stop-color="#9b1c1c" stop-opacity=".45"/><stop offset="1" stop-color="#801818" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".72"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient>
<radialGradient id="flame" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fffaf0"/><stop offset=".35" stop-color="#f7d58b"/><stop offset=".7" stop-color="#d9822b" stop-opacity=".85"/><stop offset="1" stop-color="#8a2b0f" stop-opacity="0"/></radialGradient>
<radialGradient id="flameGlow"><stop offset="0" stop-color="#f3c77a" stop-opacity=".55"/><stop offset=".4" stop-color="#c5803a" stop-opacity=".18"/><stop offset="1" stop-color="#c5803a" stop-opacity="0"/></radialGradient>
<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#c5a880" stroke-width=".6" stroke-opacity=".08"/></pattern>
<pattern id="inkHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)"><line x1="0" y1="0" x2="0" y2="5" stroke="#1d1915" stroke-width=".7" stroke-opacity=".55"/></pattern>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .82  0 0 0 0 .72  0 0 0 0 .56  0 0 0 .075 0"/></filter>
<filter id="paint" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="7"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .06  0 0 0 .55 0"/></filter>
<filter id="leaf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .95  0 0 0 0 .82  0 0 0 0 .55  0 0 0 .35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
${defs}
</defs>
<rect width="${w}" height="${h}" fill="${bg}"/>
${body}
${vignette ? `<rect width="${w}" height="${h}" fill="url(#vig)"/>` : ""}
${grain > 0 ? `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grain}"/>` : ""}
</svg>`;
}

export const goldStroke = (sw = 2, extra = "") =>
  `fill="none" stroke="url(#gold)" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}`;

export function g(content: string, attrs = goldStroke()) {
  return `<g ${attrs}>${content}</g>`;
}

export function text(
  x: number,
  y: number,
  value: string,
  size: number,
  opts: { spacing?: number; fill?: string; weight?: number; anchor?: string; style?: string } = {},
) {
  const { spacing = size * 0.25, fill = "url(#gold)", weight = 600, anchor = "middle", style = "normal" } = opts;
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="${SERIF}" font-size="${size}" font-weight="${weight}" font-style="${style}" letter-spacing="${spacing}" fill="${fill}" stroke="none">${value}</text>`;
}

export function ring(cx: number, cy: number, r: number, sw = 2, extra = "") {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" stroke-width="${sw}" ${extra}/>`;
}

export function ticks(cx: number, cy: number, r1: number, r2: number, n: number, sw = 1, offset = 0) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i + offset;
    const [x1, y1] = polar(cx, cy, r1, a);
    const [x2, y2] = polar(cx, cy, r2, a);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${sw}"/>`;
  }
  return out;
}

export function starPoints(cx: number, cy: number, R: number, r: number, n: number, rot = 0) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const [x, y] = polar(cx, cy, rad, rot + (180 / n) * i);
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

export function star(cx: number, cy: number, R: number, r: number, n: number, rot = 0, extra = "") {
  return `<polygon points="${starPoints(cx, cy, R, r, n, rot)}" ${extra}/>`;
}

export function polygon(cx: number, cy: number, r: number, n: number, rot = 0, extra = "") {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(cx, cy, r, rot + (360 / n) * i);
    pts.push(`${x},${y}`);
  }
  return `<polygon points="${pts.join(" ")}" ${extra}/>`;
}

export function hexagram(cx: number, cy: number, r: number, sw = 2) {
  return polygon(cx, cy, r, 3, 0, `stroke-width="${sw}"`) + polygon(cx, cy, r, 3, 180, `stroke-width="${sw}"`);
}

export function triangle(cx: number, cy: number, r: number, up = true, bar = false, sw = 2) {
  let out = polygon(cx, cy, r, 3, up ? 0 : 180, `stroke-width="${sw}"`);
  if (bar) {
    const y = up ? cy + r * 0.05 : cy - r * 0.05;
    out += `<line x1="${f(cx - r * 0.62)}" y1="${f(y)}" x2="${f(cx + r * 0.62)}" y2="${f(y)}" stroke-width="${sw}"/>`;
  }
  return out;
}

/** Полумесяц, открытый вправо; rot поворачивает фигуру. */
export function crescent(cx: number, cy: number, r: number, rot = 0, thin = 0.55, extra = "") {
  return `<path transform="rotate(${rot} ${f(cx)} ${f(cy)})" d="M ${f(cx)} ${f(cy - r)} A ${f(r)} ${f(r)} 0 1 0 ${f(cx)} ${f(cy + r)} A ${f(r * thin)} ${f(r)} 0 1 1 ${f(cx)} ${f(cy - r)} Z" ${extra}/>`;
}

export function eye(cx: number, cy: number, w: number, sw = 2, rays = true) {
  let out = `<path d="M ${f(cx - w)} ${f(cy)} Q ${f(cx)} ${f(cy - w * 0.78)} ${f(cx + w)} ${f(cy)} Q ${f(cx)} ${f(cy + w * 0.78)} ${f(cx - w)} ${f(cy)} Z" stroke-width="${sw}"/>`;
  out += ring(cx, cy, w * 0.34, sw);
  out += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(w * 0.13)}" fill="url(#gold)" stroke="none"/>`;
  if (rays) {
    for (let i = -4; i <= 4; i++) {
      const a = i * 17;
      const [x1, y1] = polar(cx, cy, w * 0.62, a);
      const [x2, y2] = polar(cx, cy, w * (i % 2 === 0 ? 1.05 : 0.9), a);
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${sw * 0.6}"/>`;
    }
  }
  return out;
}

export function sun(cx: number, cy: number, r: number, rays = 16, sw = 2) {
  let out = ring(cx, cy, r, sw) + ring(cx, cy, r * 0.82, sw * 0.5);
  for (let i = 0; i < rays; i++) {
    const a = (360 / rays) * i;
    if (i % 2 === 0) {
      const [x1, y1] = polar(cx, cy, r * 1.12, a);
      const [x2, y2] = polar(cx, cy, r * 1.75, a);
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${sw}"/>`;
    } else {
      const [a1x, a1y] = polar(cx, cy, r * 1.12, a - 5);
      const [tx, ty] = polar(cx, cy, r * 1.45, a);
      const [a2x, a2y] = polar(cx, cy, r * 1.12, a + 5);
      out += `<path d="M ${a1x} ${a1y} Q ${tx} ${ty} ${a2x} ${a2y}" stroke-width="${sw * 0.7}"/>`;
    }
  }
  return out;
}

export function skull(cx: number, cy: number, s: number, sw = 2) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  let out = `<path d="M ${x(-0.5)} ${y(0.12)} C ${x(-0.62)} ${y(-0.72)} ${x(0.62)} ${y(-0.72)} ${x(0.5)} ${y(0.12)} C ${x(0.48)} ${y(0.22)} ${x(0.38)} ${y(0.26)} ${x(0.36)} ${y(0.32)} L ${x(0.32)} ${y(0.58)} L ${x(-0.32)} ${y(0.58)} L ${x(-0.36)} ${y(0.32)} C ${x(-0.38)} ${y(0.26)} ${x(-0.48)} ${y(0.22)} ${x(-0.5)} ${y(0.12)} Z" stroke-width="${sw}" fill="#0b0b0c"/>`;
  out += `<ellipse cx="${x(-0.2)}" cy="${y(0.02)}" rx="${f(s * 0.15)}" ry="${f(s * 0.13)}" stroke-width="${sw}" fill="#000"/>`;
  out += `<ellipse cx="${x(0.2)}" cy="${y(0.02)}" rx="${f(s * 0.15)}" ry="${f(s * 0.13)}" stroke-width="${sw}" fill="#000"/>`;
  out += `<path d="M ${x(0)} ${y(0.13)} L ${x(-0.06)} ${y(0.27)} L ${x(0.06)} ${y(0.27)} Z" stroke-width="${sw * 0.8}"/>`;
  out += `<line x1="${x(-0.3)}" y1="${y(0.4)}" x2="${x(0.3)}" y2="${y(0.4)}" stroke-width="${sw * 0.7}"/>`;
  for (let i = -3; i <= 3; i++) {
    out += `<line x1="${x(i * 0.085)}" y1="${y(0.33)}" x2="${x(i * 0.085)}" y2="${y(0.55)}" stroke-width="${sw * 0.6}"/>`;
  }
  out += `<path d="M ${x(0.05)} ${y(-0.52)} L ${x(0.12)} ${y(-0.38)} L ${x(0.06)} ${y(-0.3)} L ${x(0.14)} ${y(-0.2)}" stroke-width="${sw * 0.5}"/>`;
  return out;
}

export function scythe(x: number, y: number, len: number, sw = 2) {
  return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y + len)}" stroke-width="${sw * 1.4}"/>
<path d="M ${f(x)} ${f(y + 4)} C ${f(x - len * 0.35)} ${f(y - len * 0.12)} ${f(x - len * 0.62)} ${f(y + len * 0.05)} ${f(x - len * 0.72)} ${f(y + len * 0.22)} C ${f(x - len * 0.5)} ${f(y + len * 0.06)} ${f(x - len * 0.25)} ${f(y + len * 0.03)} ${f(x)} ${f(y + len * 0.08)}" stroke-width="${sw}" fill="url(#gold)" fill-opacity=".25"/>`;
}

export function sword(cx: number, top: number, len: number, sw = 2) {
  const guardY = top + len * 0.72;
  return `<path d="M ${f(cx)} ${f(top)} L ${f(cx + len * 0.04)} ${f(guardY)} L ${f(cx - len * 0.04)} ${f(guardY)} Z" stroke-width="${sw}"/>
<line x1="${f(cx)}" y1="${f(top + len * 0.05)}" x2="${f(cx)}" y2="${f(guardY)}" stroke-width="${sw * 0.5}"/>
<path d="M ${f(cx - len * 0.18)} ${f(guardY)} Q ${f(cx)} ${f(guardY + len * 0.05)} ${f(cx + len * 0.18)} ${f(guardY)}" stroke-width="${sw * 1.3}"/>
<line x1="${f(cx)}" y1="${f(guardY)}" x2="${f(cx)}" y2="${f(top + len * 0.94)}" stroke-width="${sw * 1.8}"/>
${ring(cx, top + len * 0.97, len * 0.03, sw)}`;
}

export function chalice(cx: number, cy: number, s: number, sw = 2) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<path d="M ${x(-0.42)} ${y(-0.5)} C ${x(-0.42)} ${y(-0.05)} ${x(-0.18)} ${y(0.08)} ${x(-0.05)} ${y(0.1)} L ${x(-0.05)} ${y(0.42)} C ${x(-0.2)} ${y(0.45)} ${x(-0.3)} ${y(0.5)} ${x(-0.32)} ${y(0.56)} L ${x(0.32)} ${y(0.56)} C ${x(0.3)} ${y(0.5)} ${x(0.2)} ${y(0.45)} ${x(0.05)} ${y(0.42)} L ${x(0.05)} ${y(0.1)} C ${x(0.18)} ${y(0.08)} ${x(0.42)} ${y(-0.05)} ${x(0.42)} ${y(-0.5)} Z" stroke-width="${sw}"/>
<ellipse cx="${x(0)}" cy="${y(-0.5)}" rx="${f(s * 0.42)}" ry="${f(s * 0.07)}" stroke-width="${sw}"/>
<ellipse cx="${x(0)}" cy="${y(0.26)}" rx="${f(s * 0.09)}" ry="${f(s * 0.04)}" stroke-width="${sw * 0.8}"/>`;
}

export function key(cx: number, cy: number, s: number, sw = 2) {
  return `${ring(cx, cy - s * 0.38, s * 0.16, sw)}${ring(cx, cy - s * 0.38, s * 0.07, sw * 0.6)}
<line x1="${f(cx)}" y1="${f(cy - s * 0.22)}" x2="${f(cx)}" y2="${f(cy + s * 0.55)}" stroke-width="${sw * 1.3}"/>
<path d="M ${f(cx)} ${f(cy + s * 0.32)} h ${f(s * 0.16)} v ${f(s * 0.08)} M ${f(cx)} ${f(cy + s * 0.46)} h ${f(s * 0.2)} v ${f(s * 0.09)}" stroke-width="${sw}"/>`;
}

export function hourglass(cx: number, cy: number, s: number, sw = 2) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<line x1="${x(-0.35)}" y1="${y(-0.55)}" x2="${x(0.35)}" y2="${y(-0.55)}" stroke-width="${sw * 1.6}"/>
<line x1="${x(-0.35)}" y1="${y(0.55)}" x2="${x(0.35)}" y2="${y(0.55)}" stroke-width="${sw * 1.6}"/>
<path d="M ${x(-0.26)} ${y(-0.52)} C ${x(-0.26)} ${y(-0.15)} ${x(-0.04)} ${y(-0.08)} ${x(-0.04)} ${y(0)} C ${x(-0.04)} ${y(0.08)} ${x(-0.26)} ${y(0.15)} ${x(-0.26)} ${y(0.52)} M ${x(0.26)} ${y(-0.52)} C ${x(0.26)} ${y(-0.15)} ${x(0.04)} ${y(-0.08)} ${x(0.04)} ${y(0)} C ${x(0.04)} ${y(0.08)} ${x(0.26)} ${y(0.15)} ${x(0.26)} ${y(0.52)}" stroke-width="${sw}"/>
<path d="M ${x(-0.2)} ${y(0.52)} Q ${x(0)} ${y(0.25)} ${x(0.2)} ${y(0.52)} Z" fill="url(#gold)" fill-opacity=".5" stroke="none"/>
<line x1="${x(0)}" y1="${y(0)}" x2="${x(0)}" y2="${y(0.38)}" stroke-width="${sw * 0.4}" stroke-dasharray="2 4"/>`;
}

export function flame(cx: number, cy: number, s: number) {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 2.4)}" fill="url(#flameGlow)" stroke="none"/>
<path d="M ${f(cx)} ${f(cy - s)} C ${f(cx + s * 0.5)} ${f(cy - s * 0.3)} ${f(cx + s * 0.42)} ${f(cy + s * 0.45)} ${f(cx)} ${f(cy + s * 0.55)} C ${f(cx - s * 0.42)} ${f(cy + s * 0.45)} ${f(cx - s * 0.5)} ${f(cy - s * 0.3)} ${f(cx)} ${f(cy - s)} Z" fill="url(#flame)" stroke="none"/>`;
}

export function rose(cx: number, cy: number, r: number, sw = 2) {
  let out = "";
  for (let layer = 0; layer < 4; layer++) {
    const rr = r * (1 - layer * 0.22);
    const n = 5;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + layer * 36;
      const [x1, y1] = polar(cx, cy, rr, a - 36);
      const [x2, y2] = polar(cx, cy, rr, a + 36);
      const [qx, qy] = polar(cx, cy, rr * 1.32, a);
      out += `<path d="M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}" stroke-width="${sw * (1 - layer * 0.15)}"/>`;
    }
  }
  return out + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.1)}" fill="url(#gold)" stroke="none"/>`;
}

export function serpentWave(x1: number, y: number, x2: number, amp: number, waves: number, sw = 2.4) {
  const step = (x2 - x1) / (waves * 2);
  let d = `M ${f(x1)} ${f(y)}`;
  for (let i = 0; i < waves * 2; i++) {
    const cx = x1 + step * (i + 0.5);
    const cy = y + (i % 2 === 0 ? -amp : amp);
    d += ` Q ${f(cx)} ${f(cy)} ${f(x1 + step * (i + 1))} ${f(y)}`;
  }
  const hx = x2;
  return `<path d="${d}" stroke-width="${sw}"/>
<path d="M ${f(hx)} ${f(y)} q ${f(amp * 0.35)} ${f(-amp * 0.3)} ${f(amp * 0.7)} 0 q ${f(-amp * 0.35)} ${f(amp * 0.3)} ${f(-amp * 0.7)} 0 Z" fill="url(#gold)" stroke-width="${sw * 0.6}"/>
<path d="M ${f(hx + amp * 0.7)} ${f(y)} l ${f(amp * 0.3)} ${f(-amp * 0.08)} M ${f(hx + amp * 0.7)} ${f(y)} l ${f(amp * 0.3)} ${f(amp * 0.08)}" stroke-width="${sw * 0.4}"/>`;
}

export function ouroboros(cx: number, cy: number, r: number, sw = 2) {
  const [hx, hy] = polar(cx, cy, r, 0);
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" stroke-width="${f(r * 0.13)}" stroke-dasharray="${f(r * 0.06)} ${f(r * 0.03)}" stroke-opacity=".9"/>
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.07)}" stroke-width="${sw * 0.6}"/>
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.93)}" stroke-width="${sw * 0.6}"/>
<path d="M ${f(hx - r * 0.12)} ${f(hy - r * 0.02)} Q ${f(hx)} ${f(hy - r * 0.2)} ${f(hx + r * 0.2)} ${f(hy - r * 0.04)} Q ${f(hx + r * 0.05)} ${f(hy + r * 0.12)} ${f(hx - r * 0.12)} ${f(hy - r * 0.02)} Z" fill="#0b0b0c" stroke-width="${sw}"/>
<circle cx="${f(hx + r * 0.04)}" cy="${f(hy - r * 0.07)}" r="${f(r * 0.022)}" fill="url(#gold)" stroke="none"/>`;
}

const SEPHIROT: [number, number][] = [
  [0, 0], [1, 0.6], [-1, 0.6], [1, 1.8], [-1, 1.8], [0, 2.4], [1, 3.6], [-1, 3.6], [0, 4.2], [0, 5.6],
];
const SEPHIROT_PATHS: [number, number][] = [
  [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
  [3, 6], [4, 7], [5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [7, 8], [6, 9], [7, 9], [8, 9],
];

export function treeOfLife(cx: number, top: number, unit: number, sw = 2, nodeFill = "#0b0b0c") {
  const pt = (i: number) => [f(cx + SEPHIROT[i][0] * unit), f(top + SEPHIROT[i][1] * unit)] as const;
  let out = "";
  for (const [a, b] of SEPHIROT_PATHS) {
    const [x1, y1] = pt(a);
    const [x2, y2] = pt(b);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${sw * 0.7}"/>`;
  }
  out += `<circle cx="${f(cx)}" cy="${f(top + 1.2 * unit)}" r="${f(unit * 0.2)}" stroke-width="${sw * 0.5}" stroke-dasharray="3 4"/>`;
  for (let i = 0; i < SEPHIROT.length; i++) {
    const [x, y] = pt(i);
    out += `<circle cx="${x}" cy="${y}" r="${f(unit * 0.26)}" fill="${nodeFill}" stroke-width="${sw}"/>`;
    out += `<circle cx="${x}" cy="${y}" r="${f(unit * 0.08)}" fill="url(#gold)" stroke="none"/>`;
  }
  return out;
}

export function lilithGlyph(cx: number, cy: number, s: number, sw = 2.5) {
  return `${crescent(cx, cy - s * 0.35, s * 0.42, -90, 0.5, `stroke-width="${sw}" fill="url(#gold)" fill-opacity=".14"`)}
<line x1="${f(cx)}" y1="${f(cy + s * 0.02)}" x2="${f(cx)}" y2="${f(cy + s * 0.75)}" stroke-width="${sw}"/>
<line x1="${f(cx - s * 0.24)}" y1="${f(cy + s * 0.4)}" x2="${f(cx + s * 0.24)}" y2="${f(cy + s * 0.4)}" stroke-width="${sw}"/>`;
}

export function houndHead(cx: number, cy: number, s: number, sw = 2) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<path d="M ${x(-0.42)} ${y(-0.25)} L ${x(-0.5)} ${y(-0.78)} L ${x(-0.18)} ${y(-0.42)} Q ${x(0)} ${y(-0.5)} ${x(0.18)} ${y(-0.42)} L ${x(0.5)} ${y(-0.78)} L ${x(0.42)} ${y(-0.25)} Q ${x(0.5)} ${y(0.05)} ${x(0.26)} ${y(0.3)} L ${x(0.12)} ${y(0.62)} Q ${x(0)} ${y(0.72)} ${x(-0.12)} ${y(0.62)} L ${x(-0.26)} ${y(0.3)} Q ${x(-0.5)} ${y(0.05)} ${x(-0.42)} ${y(-0.25)} Z" fill="#0b0b0c" stroke-width="${sw}"/>
<path d="M ${x(-0.26)} ${y(-0.08)} L ${x(-0.1)} ${y(-0.02)} L ${x(-0.24)} ${y(0.04)} Z M ${x(0.26)} ${y(-0.08)} L ${x(0.1)} ${y(-0.02)} L ${x(0.24)} ${y(0.04)} Z" fill="url(#gold)" stroke-width="${sw * 0.5}"/>
<path d="M ${x(-0.08)} ${y(0.5)} L ${x(0)} ${y(0.58)} L ${x(0.08)} ${y(0.5)} Z" fill="url(#gold)" stroke="none"/>
<path d="M ${x(-0.32)} ${y(-0.6)} L ${x(-0.26)} ${y(-0.4)} M ${x(0.32)} ${y(-0.6)} L ${x(0.26)} ${y(-0.4)} M ${x(0)} ${y(-0.4)} L ${x(0)} ${y(0.3)}" stroke-width="${sw * 0.4}"/>
<path d="M ${x(-0.14)} ${y(0.7)} L ${x(-0.1)} ${y(0.82)} M ${x(0.14)} ${y(0.7)} L ${x(0.1)} ${y(0.82)}" stroke-width="${sw * 0.8}"/>`;
}

export function bat(cx: number, cy: number, s: number) {
  const x = (k: number) => f(cx + k * s);
  const y = (k: number) => f(cy + k * s);
  return `<path d="M ${x(0)} ${y(-0.1)} Q ${x(-0.3)} ${y(-0.45)} ${x(-1)} ${y(-0.3)} Q ${x(-0.85)} ${y(-0.05)} ${x(-0.7)} ${y(0.1)} Q ${x(-0.55)} ${y(-0.05)} ${x(-0.45)} ${y(0.15)} Q ${x(-0.3)} ${y(0)} ${x(-0.15)} ${y(0.2)} Q ${x(0)} ${y(0.05)} ${x(0.15)} ${y(0.2)} Q ${x(0.3)} ${y(0)} ${x(0.45)} ${y(0.15)} Q ${x(0.55)} ${y(-0.05)} ${x(0.7)} ${y(0.1)} Q ${x(0.85)} ${y(-0.05)} ${x(1)} ${y(-0.3)} Q ${x(0.3)} ${y(-0.45)} ${x(0)} ${y(-0.1)} Z" fill="url(#gold)" fill-opacity=".85" stroke="none"/>`;
}

/** Простые планетарные знаки: солнце, луна, меркурий, венера, марс, юпитер, сатурн. */
export function planet(kind: number, cx: number, cy: number, s: number, sw = 1.6) {
  const r = s * 0.32;
  switch (kind % 7) {
    case 0:
      return ring(cx, cy, r, sw) + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.22)}" fill="url(#gold)" stroke="none"/>`;
    case 1:
      return crescent(cx, cy, r * 1.2, 180, 0.5, `stroke-width="${sw}"`);
    case 2:
      return (
        ring(cx, cy - r * 0.2, r * 0.8, sw) +
        `<path d="M ${f(cx - r * 0.7)} ${f(cy - r * 1.5)} Q ${f(cx)} ${f(cy - r * 0.6)} ${f(cx + r * 0.7)} ${f(cy - r * 1.5)} M ${f(cx)} ${f(cy + r * 0.6)} V ${f(cy + r * 1.7)} M ${f(cx - r * 0.5)} ${f(cy + r * 1.15)} H ${f(cx + r * 0.5)}" stroke-width="${sw}"/>`
      );
    case 3:
      return (
        ring(cx, cy - r * 0.4, r * 0.85, sw) +
        `<path d="M ${f(cx)} ${f(cy + r * 0.45)} V ${f(cy + r * 1.6)} M ${f(cx - r * 0.55)} ${f(cy + r * 1.05)} H ${f(cx + r * 0.55)}" stroke-width="${sw}"/>`
      );
    case 4:
      return (
        ring(cx - r * 0.25, cy + r * 0.25, r * 0.85, sw) +
        `<path d="M ${f(cx + r * 0.35)} ${f(cy - r * 0.35)} L ${f(cx + r * 1.15)} ${f(cy - r * 1.15)} M ${f(cx + r * 0.55)} ${f(cy - r * 1.15)} H ${f(cx + r * 1.15)} V ${f(cy - r * 0.55)}" stroke-width="${sw}"/>`
      );
    case 5:
      return `<path d="M ${f(cx - r)} ${f(cy - r * 0.9)} Q ${f(cx)} ${f(cy - r * 1.4)} ${f(cx)} ${f(cy - r * 0.4)} Q ${f(cx)} ${f(cy + r * 0.3)} ${f(cx - r)} ${f(cy + r * 0.4)} H ${f(cx + r * 1.1)} M ${f(cx + r * 0.6)} ${f(cy - r * 1.2)} V ${f(cy + r * 1.3)}" stroke-width="${sw}"/>`;
    default:
      return `<path d="M ${f(cx - r * 0.5)} ${f(cy - r * 1.4)} V ${f(cy + r * 0.4)} M ${f(cx - r)} ${f(cy - r * 0.9)} H ${f(cx)} M ${f(cx - r * 0.5)} ${f(cy - r * 0.2)} Q ${f(cx + r)} ${f(cy - r * 0.6)} ${f(cx + r * 0.6)} ${f(cy + r * 0.6)} Q ${f(cx + r * 0.3)} ${f(cy + r * 1.2)} ${f(cx + r * 0.8)} ${f(cy + r * 1.4)}" stroke-width="${sw}"/>`;
  }
}

export function planetRing(cx: number, cy: number, r: number, s: number, sw = 1.6, offset = 0) {
  let out = "";
  for (let i = 0; i < 7; i++) {
    const [x, y] = polar(cx, cy, r, offset + (360 / 7) * i);
    out += planet(i, x, y, s, sw);
  }
  return out;
}

export function stars(seed: number, count: number, w: number, h: number, x0 = 0, y0 = 0, color = "#e9d9b6") {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = f(x0 + r() * w);
    const y = f(y0 + r() * h);
    const big = r() > 0.93;
    const op = f(0.25 + r() * 0.6);
    if (big) {
      const s = 3 + r() * 5;
      out += `<path d="M ${x} ${f(y - s)} L ${f(x + s * 0.18)} ${f(y - s * 0.18)} L ${f(x + s)} ${y} L ${f(x + s * 0.18)} ${f(y + s * 0.18)} L ${x} ${f(y + s)} L ${f(x - s * 0.18)} ${f(y + s * 0.18)} L ${f(x - s)} ${y} L ${f(x - s * 0.18)} ${f(y - s * 0.18)} Z" fill="${color}" opacity="${op}" stroke="none"/>`;
    } else {
      out += `<circle cx="${x}" cy="${y}" r="${f(0.4 + r() * 1.1)}" fill="${color}" opacity="${op}" stroke="none"/>`;
    }
  }
  return out;
}

export function cornerOrnament(x: number, y: number, dx: number, dy: number, s: number, sw = 1.4) {
  return `<path d="M ${f(x)} ${f(y + dy * s)} L ${f(x)} ${f(y)} L ${f(x + dx * s)} ${f(y)}" stroke-width="${sw}"/>
<path d="M ${f(x + dx * s * 0.25)} ${f(y + dy * s * 0.25)} Q ${f(x + dx * s * 0.7)} ${f(y + dy * s * 0.05)} ${f(x + dx * s * 0.95)} ${f(y + dy * s * 0.3)} M ${f(x + dx * s * 0.25)} ${f(y + dy * s * 0.25)} Q ${f(x + dx * s * 0.05)} ${f(y + dy * s * 0.7)} ${f(x + dx * s * 0.3)} ${f(y + dy * s * 0.95)}" stroke-width="${sw * 0.8}"/>
<circle cx="${f(x + dx * s * 0.25)}" cy="${f(y + dy * s * 0.25)}" r="${f(s * 0.07)}" fill="url(#gold)" stroke="none"/>`;
}

export function frameCorners(x: number, y: number, w: number, h: number, s: number, sw = 1.4) {
  return (
    cornerOrnament(x, y, 1, 1, s, sw) +
    cornerOrnament(x + w, y, -1, 1, s, sw) +
    cornerOrnament(x, y + h, 1, -1, s, sw) +
    cornerOrnament(x + w, y + h, -1, -1, s, sw)
  );
}

export function arch(cx: number, base: number, w: number, h: number, sw = 2) {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const spring = base - h + w * 0.55;
  return `<path d="M ${f(l)} ${f(base)} L ${f(l)} ${f(spring)} Q ${f(l)} ${f(base - h)} ${f(cx)} ${f(base - h)} Q ${f(r)} ${f(base - h)} ${f(r)} ${f(spring)} L ${f(r)} ${f(base)}" stroke-width="${sw}"/>`;
}

export function scribbleLines(seed: number, x: number, y: number, w: number, lines: number, gap: number, color: string, sw = 1.1) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < lines; i++) {
    const ly = y + i * gap;
    const len = w * (i === lines - 1 ? 0.45 + r() * 0.3 : 0.82 + r() * 0.18);
    let d = `M ${f(x)} ${f(ly)}`;
    for (let px = x + 6; px < x + len; px += 6) {
      d += ` L ${f(px)} ${f(ly + (r() - 0.5) * 3.2)}`;
    }
    out += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${f(0.55 + r() * 0.35)}"/>`;
  }
  return out;
}
