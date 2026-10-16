// Центральные мотивы карт и изделий. Каждый мотив вписан в круг радиуса s.
import {
  arch,
  bat,
  chalice,
  crescent,
  eye,
  f,
  flame,
  hexagram,
  houndHead,
  key,
  lilithGlyph,
  ouroboros,
  planet,
  planetRing,
  polar,
  polygon,
  ring,
  rose,
  scythe,
  serpentWave,
  skull,
  star,
  stars,
  sun,
  sword,
  ticks,
  triangle,
  type Motif,
} from "./primitives";

const glow = (cx: number, cy: number, r: number, id = "glow") =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="url(#${id})" stroke="none"/>`;

export const magician: Motif = (cx, cy, s) => {
  const ly = cy - s * 0.72;
  const lw = s * 0.28;
  return `${glow(cx, cy, s * 1.1)}
<path d="M ${f(cx)} ${f(ly)} C ${f(cx + lw * 0.6)} ${f(ly - lw * 0.7)} ${f(cx + lw * 1.6)} ${f(ly - lw * 0.7)} ${f(cx + lw * 1.6)} ${f(ly)} C ${f(cx + lw * 1.6)} ${f(ly + lw * 0.7)} ${f(cx + lw * 0.6)} ${f(ly + lw * 0.7)} ${f(cx)} ${f(ly)} C ${f(cx - lw * 0.6)} ${f(ly - lw * 0.7)} ${f(cx - lw * 1.6)} ${f(ly - lw * 0.7)} ${f(cx - lw * 1.6)} ${f(ly)} C ${f(cx - lw * 1.6)} ${f(ly + lw * 0.7)} ${f(cx - lw * 0.6)} ${f(ly + lw * 0.7)} ${f(cx)} ${f(ly)} Z" stroke-width="2.4"/>
<line x1="${f(cx)}" y1="${f(cy - s * 0.42)}" x2="${f(cx)}" y2="${f(cy + s * 0.55)}" stroke-width="3"/>
${ring(cx, cy - s * 0.46, s * 0.06, 2, 'fill="url(#gold)"')}
${ring(cx, cy + s * 0.58, s * 0.06, 2, 'fill="url(#gold)"')}
${triangle(cx - s * 0.62, cy - s * 0.1, s * 0.16, true, false)}
${triangle(cx + s * 0.62, cy - s * 0.1, s * 0.16, false, false)}
${triangle(cx - s * 0.62, cy + s * 0.42, s * 0.16, true, true)}
${triangle(cx + s * 0.62, cy + s * 0.42, s * 0.16, false, true)}
<line x1="${f(cx - s * 0.95)}" y1="${f(cy + s * 0.8)}" x2="${f(cx + s * 0.95)}" y2="${f(cy + s * 0.8)}" stroke-width="2"/>
<line x1="${f(cx - s * 0.85)}" y1="${f(cy + s * 0.88)}" x2="${f(cx + s * 0.85)}" y2="${f(cy + s * 0.88)}" stroke-width="1"/>
${sun(cx, cy + s * 0.08, s * 0.14, 12, 1.4)}`;
};

export const priestess: Motif = (cx, cy, s) => {
  const pw = s * 0.2;
  const ph = s * 1.5;
  const top = cy - s * 0.8;
  const pillar = (x: number, letter: string) =>
    `<rect x="${f(x - pw / 2)}" y="${f(top)}" width="${f(pw)}" height="${f(ph)}" stroke-width="2"/>
<rect x="${f(x - pw * 0.7)}" y="${f(top - s * 0.06)}" width="${f(pw * 1.4)}" height="${f(s * 0.06)}" stroke-width="1.6"/>
<rect x="${f(x - pw * 0.7)}" y="${f(top + ph)}" width="${f(pw * 1.4)}" height="${f(s * 0.06)}" stroke-width="1.6"/>
<text x="${f(x)}" y="${f(top + ph * 0.25)}" text-anchor="middle" font-family="Georgia, serif" font-size="${f(s * 0.14)}" fill="url(#gold)" stroke="none">${letter}</text>`;
  let veil = "";
  for (let i = 0; i < 9; i++) {
    const x = cx - s * 0.45 + (i % 3) * s * 0.45;
    const y = cy - s * 0.4 + Math.floor(i / 3) * s * 0.4;
    veil += ring(x, y, s * 0.07, 1.2) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 0.02)}" fill="url(#gold)" stroke="none"/>`;
  }
  return `${glow(cx, cy, s * 1.1)}${pillar(cx - s * 0.82, "B")}${pillar(cx + s * 0.82, "J")}
<g stroke-opacity=".55">${veil}</g>
${crescent(cx - s * 0.2, cy - s * 0.95, s * 0.12, 0, 0.5, 'stroke-width="2"')}
${ring(cx, cy - s * 0.95, s * 0.11, 2, 'fill="url(#gold)" fill-opacity=".25"')}
${crescent(cx + s * 0.2, cy - s * 0.95, s * 0.12, 180, 0.5, 'stroke-width="2"')}
${crescent(cx, cy + s * 0.78, s * 0.2, 90, 0.45, 'stroke-width="2.4" fill="url(#gold)" fill-opacity=".2"')}`;
};

export const hermit: Motif = (cx, cy, s) => {
  const lx = cx + s * 0.25;
  const ly = cy - s * 0.15;
  return `${glow(lx, ly, s * 0.9)}
<line x1="${f(cx - s * 0.35)}" y1="${f(cy - s * 0.95)}" x2="${f(cx - s * 0.35)}" y2="${f(cy + s * 0.85)}" stroke-width="3"/>
<path d="M ${f(cx - s * 0.35)} ${f(cy - s * 0.65)} Q ${f(lx)} ${f(cy - s * 0.75)} ${f(lx)} ${f(ly - s * 0.35)}" stroke-width="1.6"/>
${polygon(lx, ly, s * 0.3, 6, 30, 'stroke-width="2.2"')}
${hexagram(lx, ly, s * 0.17, 1.6)}
<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(s * 0.05)}" fill="url(#gold)" stroke="none"/>
<path d="M ${f(cx - s)} ${f(cy + s * 0.85)} L ${f(cx - s * 0.55)} ${f(cy + s * 0.35)} L ${f(cx - s * 0.2)} ${f(cy + s * 0.65)} L ${f(cx + s * 0.25)} ${f(cy + s * 0.2)} L ${f(cx + s * 0.6)} ${f(cy + s * 0.6)} L ${f(cx + s)} ${f(cy + s * 0.3)}" stroke-width="1.8"/>
<g stroke="none">${stars(91, 18, s * 1.8, s * 0.7, cx - s * 0.9, cy - s * 1.1)}</g>`;
};

export const wheel: Motif = (cx, cy, s) => {
  let spokes = "";
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = polar(cx, cy, s * 0.22, i * 45);
    const [x2, y2] = polar(cx, cy, s * 0.72, i * 45);
    spokes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="2"/>`;
  }
  return `${glow(cx, cy, s * 1.1)}
${ring(cx, cy, s * 0.92, 2.6)}${ring(cx, cy, s * 0.72, 1.6)}${ring(cx, cy, s * 0.22, 2)}
${ticks(cx, cy, s * 0.74, s * 0.9, 72, 0.8)}
${spokes}
${planetRing(cx, cy, s * 0.82, s * 0.24, 1.3, 22)}
${sun(cx, cy, s * 0.1, 8, 1.4)}`;
};

export const death: Motif = (cx, cy, s) => {
  const hy = cy + s * 0.75;
  let rays = "";
  for (let i = -6; i <= 6; i++) {
    const [x2, y2] = polar(cx, hy, s * 1.05, i * 14);
    const [x1, y1] = polar(cx, hy, s * 0.4, i * 14);
    rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="0.9" stroke-opacity=".6"/>`;
  }
  return `${glow(cx, cy - s * 0.1, s)}
${rays}
<path d="M ${f(cx - s * 0.36)} ${f(hy)} A ${f(s * 0.36)} ${f(s * 0.36)} 0 0 1 ${f(cx + s * 0.36)} ${f(hy)}" stroke-width="2" fill="url(#gold)" fill-opacity=".2"/>
<line x1="${f(cx - s)}" y1="${f(hy)}" x2="${f(cx + s)}" y2="${f(hy)}" stroke-width="2"/>
${skull(cx, cy - s * 0.22, s * 0.62, 2.4)}
${scythe(cx + s * 0.72, cy - s * 0.95, s * 1.6, 2.2)}
${rose(cx - s * 0.68, cy + s * 0.5, s * 0.12, 1.2)}`;
};

export const devil: Motif = (cx, cy, s) => {
  let chains = "";
  for (let i = 0; i < 6; i++) {
    chains += `<ellipse cx="${f(cx - s * 0.55)}" cy="${f(cy + s * 0.2 + i * s * 0.1)}" rx="${f(s * 0.04)}" ry="${f(s * 0.06)}" stroke-width="1.2"/>`;
    chains += `<ellipse cx="${f(cx + s * 0.55)}" cy="${f(cy + s * 0.2 + i * s * 0.1)}" rx="${f(s * 0.04)}" ry="${f(s * 0.06)}" stroke-width="1.2"/>`;
  }
  return `${glow(cx, cy, s * 1.1, "crimsonGlow")}
${crescent(cx, cy - s * 0.62, s * 0.38, -90, 0.6, 'stroke-width="2.4" fill="url(#gold)" fill-opacity=".15"')}
${triangle(cx, cy - s * 0.05, s * 0.5, false, false, 2.4)}
${eye(cx, cy - s * 0.18, s * 0.18, 1.6, false)}
${star(cx, cy + s * 0.25, s * 0.12, s * 0.05, 5, 180, 'stroke-width="1.4"')}
<line x1="${f(cx - s * 0.75)}" y1="${f(cy + s * 0.15)}" x2="${f(cx + s * 0.75)}" y2="${f(cy + s * 0.15)}" stroke-width="2"/>
${chains}
${flame(cx + s * 0.85, cy - s * 0.65, s * 0.12)}
<line x1="${f(cx + s * 0.85)}" y1="${f(cy - s * 0.58)}" x2="${f(cx + s * 0.85)}" y2="${f(cy + s * 0.1)}" stroke-width="2.4"/>
<rect x="${f(cx - s * 0.95)}" y="${f(cy + s * 0.82)}" width="${f(s * 1.9)}" height="${f(s * 0.08)}" stroke-width="1.6"/>`;
};

export const starCard: Motif = (cx, cy, s) => {
  let small = "";
  for (let i = 0; i < 7; i++) {
    const [x, y] = polar(cx, cy - s * 0.25, s * 0.78, -90 + i * 30);
    small += star(x, y, s * 0.09, s * 0.03, 8, 0, 'stroke-width="1.2" fill="url(#gold)" fill-opacity=".35"');
  }
  return `${glow(cx, cy - s * 0.25, s * 1.1)}
${star(cx, cy - s * 0.25, s * 0.42, s * 0.12, 8, 0, 'stroke-width="2.2" fill="url(#gold)" fill-opacity=".18"')}
${star(cx, cy - s * 0.25, s * 0.26, s * 0.08, 8, 22.5, 'stroke-width="1.2"')}
${small}
${chalice(cx - s * 0.48, cy + s * 0.48, s * 0.28, 1.6)}
${chalice(cx + s * 0.48, cy + s * 0.48, s * 0.28, 1.6)}
${serpentWave(cx - s * 0.95, cy + s * 0.88, cx + s * 0.75, s * 0.04, 6, 1.4)}`;
};

export const moon: Motif = (cx, cy, s) => {
  const tower = (x: number) =>
    `<path d="M ${f(x - s * 0.12)} ${f(cy + s * 0.7)} V ${f(cy + s * 0.05)} h ${f(s * 0.05)} v ${f(-s * 0.06)} h ${f(s * 0.045)} v ${f(s * 0.06)} h ${f(s * 0.05)} v ${f(-s * 0.06)} h ${f(s * 0.045)} v ${f(s * 0.06)} h ${f(s * 0.05)} V ${f(cy + s * 0.7)}" stroke-width="1.8"/>
<rect x="${f(x - s * 0.03)}" y="${f(cy + s * 0.2)}" width="${f(s * 0.06)}" height="${f(s * 0.1)}" stroke-width="1"/>`;
  return `${glow(cx, cy - s * 0.45, s)}
${ring(cx, cy - s * 0.45, s * 0.36, 2)}
${ticks(cx, cy - s * 0.45, s * 0.42, s * 0.56, 32, 1)}
${crescent(cx + s * 0.04, cy - s * 0.45, s * 0.3, 180, 0.55, 'stroke-width="1.6" fill="url(#gold)" fill-opacity=".35"')}
${tower(cx - s * 0.75)}${tower(cx + s * 0.75)}
${houndHead(cx - s * 0.32, cy + s * 0.32, s * 0.18, 1.4)}${houndHead(cx + s * 0.32, cy + s * 0.32, s * 0.18, 1.4)}
<path d="M ${f(cx)} ${f(cy + s * 0.95)} C ${f(cx - s * 0.2)} ${f(cy + s * 0.7)} ${f(cx + s * 0.2)} ${f(cy + s * 0.55)} ${f(cx)} ${f(cy + s * 0.25)}" stroke-width="1.4" stroke-dasharray="4 5"/>
${serpentWave(cx - s * 0.95, cy + s * 0.9, cx + s * 0.8, s * 0.035, 7, 1.2)}`;
};

export const sunCard: Motif = (cx, cy, s) =>
  `${glow(cx, cy - s * 0.2, s * 1.2)}
${sun(cx, cy - s * 0.2, s * 0.32, 24, 2.2)}
${eye(cx, cy - s * 0.2, s * 0.17, 1.4, false)}
<line x1="${f(cx - s)}" y1="${f(cy + s * 0.62)}" x2="${f(cx + s)}" y2="${f(cy + s * 0.62)}" stroke-width="2"/>
${rose(cx - s * 0.6, cy + s * 0.48, s * 0.12, 1.2)}${rose(cx, cy + s * 0.48, s * 0.12, 1.2)}${rose(cx + s * 0.6, cy + s * 0.48, s * 0.12, 1.2)}
<path d="M ${f(cx - s)} ${f(cy + s * 0.7)} H ${f(cx + s)} M ${f(cx - s)} ${f(cy + s * 0.8)} H ${f(cx + s)}" stroke-width="1" stroke-dasharray="14 6"/>`;

export const world: Motif = (cx, cy, s) => {
  let leaves = "";
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const x = cx + Math.cos(a) * s * 0.55;
    const y = cy + Math.sin(a) * s * 0.82;
    const rot = (a * 180) / Math.PI + 90;
    leaves += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s * 0.025)}" ry="${f(s * 0.07)}" transform="rotate(${f(rot + 25)} ${f(x)} ${f(y)})" stroke-width="1"/>`;
  }
  const corner = (x: number, y: number, k: number) => ring(x, y, s * 0.15, 1.4) + planet(k, x, y, s * 0.3, 1.2);
  return `${glow(cx, cy, s)}
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(s * 0.55)}" ry="${f(s * 0.82)}" stroke-width="2"/>
${leaves}
${hexagram(cx, cy, s * 0.32, 1.8)}
${ring(cx, cy, s * 0.08, 1.4, 'fill="url(#gold)" fill-opacity=".4"')}
${corner(cx - s * 0.85, cy - s * 0.85, 0)}${corner(cx + s * 0.85, cy - s * 0.85, 1)}${corner(cx - s * 0.85, cy + s * 0.85, 3)}${corner(cx + s * 0.85, cy + s * 0.85, 4)}`;
};

// ── Мотивы колод и изделий ──

export const lilithMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s * 1.1, "crimsonGlow")}${glow(cx, cy, s * 0.9)}
${ring(cx, cy, s * 0.95, 1.4)}${ring(cx, cy, s * 0.88, 0.8)}
${ticks(cx, cy, s * 0.88, s * 0.95, 60, 0.7)}
${arch(cx, cy + s * 0.75, s * 1.0, s * 1.45, 1.6)}
${lilithGlyph(cx, cy - s * 0.12, s * 0.75, 2.6)}
<path d="M ${f(cx - s * 0.62)} ${f(cy + s * 0.55)} C ${f(cx - s * 0.2)} ${f(cy + s * 0.35)} ${f(cx + s * 0.2)} ${f(cy + s * 0.85)} ${f(cx + s * 0.62)} ${f(cy + s * 0.55)}" stroke-width="2"/>
${star(cx, cy - s * 0.78, s * 0.08, s * 0.03, 8, 0, 'stroke-width="1" fill="url(#gold)"')}
<g stroke="none">${stars(17, 26, s * 1.6, s * 1.5, cx - s * 0.8, cy - s * 0.8)}</g>`;

export const hermeticMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s * 1.1)}
${sun(cx, cy - s * 0.05, s * 0.36, 32, 1.4)}
${triangle(cx, cy + s * 0.02, s * 0.62, true, false, 2.6)}
${eye(cx, cy + s * 0.1, s * 0.2, 1.6, false)}
${crescent(cx - s * 0.78, cy - s * 0.7, s * 0.14, 0, 0.5, 'stroke-width="1.6"')}
${ring(cx + s * 0.78, cy - s * 0.7, s * 0.12, 1.6)}<circle cx="${f(cx + s * 0.78)}" cy="${f(cy - s * 0.7)}" r="${f(s * 0.03)}" fill="url(#gold)" stroke="none"/>
${planetRing(cx, cy, s * 0.9, s * 0.18, 1, 10)}`;

export const bestiaryMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s * 1.1)}
${arch(cx, cy + s * 0.8, s * 1.4, s * 1.75, 2)}
${arch(cx, cy + s * 0.8, s * 1.22, s * 1.6, 0.8)}
${houndHead(cx, cy, s * 0.42, 2.2)}
${houndHead(cx - s * 0.42, cy + s * 0.18, s * 0.28, 1.6)}
${houndHead(cx + s * 0.42, cy + s * 0.18, s * 0.28, 1.6)}
${bat(cx, cy - s * 0.7, s * 0.3)}
${crescent(cx, cy - s * 0.95, s * 0.08, 90, 0.5, 'stroke-width="1.2" fill="url(#gold)"')}`;

export const solomonMotif: Motif = (cx, cy, s) =>
  `${ring(cx, cy, s * 0.98, 2)}${ring(cx, cy, s * 0.84, 1.2)}
${ticks(cx, cy, s * 0.86, s * 0.96, 48, 1)}
${hexagram(cx, cy, s * 0.62, 2.4)}
${ring(cx, cy, s * 0.28, 1.6)}
${planetRing(cx, cy, s * 0.72, s * 0.2, 1.3, 0)}
${star(cx, cy, s * 0.16, s * 0.07, 6, 0, 'stroke-width="1.4" fill="url(#gold)" fill-opacity=".3"')}`;

export const ouroborosMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s)}
${ouroboros(cx, cy, s * 0.82, 2)}
${triangle(cx, cy + s * 0.04, s * 0.5, true, false, 2)}
${triangle(cx, cy - s * 0.04, s * 0.5, false, false, 1.2)}
${ring(cx, cy, s * 0.16, 1.6)}<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 0.04)}" fill="url(#gold)" stroke="none"/>`;

export const roseCross: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s)}
<path d="M ${f(cx - s * 0.12)} ${f(cy - s * 0.9)} h ${f(s * 0.24)} v ${f(s * 0.68)} h ${f(s * 0.68)} v ${f(s * 0.24)} h ${f(-s * 0.68)} v ${f(s * 0.88)} h ${f(-s * 0.24)} v ${f(-s * 0.88)} h ${f(-s * 0.68)} v ${f(-s * 0.24)} h ${f(s * 0.68)} Z" stroke-width="2.2"/>
${rose(cx, cy, s * 0.22, 1.6)}
${ticks(cx, cy, s * 0.4, s * 0.62, 24, 0.8, 7.5)}`;

export const blackSun: Motif = (cx, cy, s) => {
  let rays = "";
  for (let i = 0; i < 12; i++) {
    const a = i * 30;
    const [x1, y1] = polar(cx, cy, s * 0.3, a);
    const [qx, qy] = polar(cx, cy, s * 0.65, a + 18);
    const [x2, y2] = polar(cx, cy, s * 0.95, a + 30);
    rays += `<path d="M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}" stroke-width="2.2"/>`;
  }
  return `${glow(cx, cy, s * 1.1)}${rays}${ring(cx, cy, s * 0.3, 2.4, 'fill="#000"')}${ring(cx, cy, s * 0.95, 1)}`;
};

export const keysMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s)}
<g transform="rotate(-28 ${f(cx)} ${f(cy)})">${key(cx, cy, s * 0.9, 2.2)}</g>
<g transform="rotate(28 ${f(cx)} ${f(cy)})">${key(cx, cy, s * 0.9, 2.2)}</g>
${ring(cx, cy - s * 0.62, s * 0.1, 1.2)}`;

export const swordMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s)}${sword(cx, cy - s * 0.95, s * 1.9, 2.2)}${crescent(cx, cy - s * 0.2, s * 0.5, -90, 0.7, 'stroke-width="1.4"')}`;

export const chaliceMotif: Motif = (cx, cy, s) =>
  `${glow(cx, cy, s)}${chalice(cx, cy + s * 0.2, s * 0.9, 2.4)}${flame(cx, cy - s * 0.5, s * 0.18)}`;

export const ORACLE_MOTIFS: Record<string, Motif> = {
  magician,
  priestess,
  hermit,
  wheel,
  death,
  devil,
  star: starCard,
  moon,
  sun: sunCard,
  world,
};
