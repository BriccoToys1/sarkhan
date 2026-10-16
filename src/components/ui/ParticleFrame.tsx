// Рамка CTA, которая при наведении собирается из золотых частиц.
const COUNT = 44;

function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLES = Array.from({ length: COUNT }, (_, i) => {
  const t = i / COUNT;
  // периметр условного прямоугольника 4:1 → доли сторон
  const w = 0.4;
  const h = 0.1;
  let left: number;
  let top: number;
  if (t < w) [left, top] = [(t / w) * 100, 0];
  else if (t < w + h) [left, top] = [100, ((t - w) / h) * 100];
  else if (t < 2 * w + h) [left, top] = [100 - ((t - w - h) / w) * 100, 100];
  else [left, top] = [0, 100 - ((t - 2 * w - h) / h) * 100];
  const angle = seeded(i) * Math.PI * 2;
  const dist = 40 + seeded(i + 99) * 80;
  return {
    left: `${left.toFixed(2)}%`,
    top: `${top.toFixed(2)}%`,
    dx: `${(Math.cos(angle) * dist).toFixed(1)}px`,
    dy: `${(Math.sin(angle) * dist).toFixed(1)}px`,
    delay: `${(seeded(i + 7) * 0.35).toFixed(2)}s`,
  };
});

export function ParticleFrame() {
  return (
    <span className="particle-frame pointer-events-none absolute inset-0" aria-hidden>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          style={{ left: p.left, top: p.top, ["--dx" as string]: p.dx, ["--dy" as string]: p.dy, ["--delay" as string]: p.delay }}
        />
      ))}
    </span>
  );
}
