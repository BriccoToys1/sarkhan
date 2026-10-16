"use client";

import { useEffect, useRef } from "react";

type Puff = { x: number; y: number; r: number; vx: number; vy: number; life: number; max: number; hue: number };

/** Медленно плывущий дым благовоний. Останавливается вне экрана и в фоновой вкладке. */
export function SmokeCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const puffs: Puff[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false): Puff => {
      const sources = [0.22, 0.5, 0.78];
      const sx = sources[Math.floor(Math.random() * sources.length)] * w + (Math.random() - 0.5) * 60;
      const max = 600 + Math.random() * 500;
      return {
        x: sx,
        y: initial ? h * (0.3 + Math.random() * 0.7) : h + 40,
        r: 30 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.25 + Math.random() * 0.45),
        life: initial ? Math.random() * max : 0,
        max,
        hue: Math.random() < 0.7 ? 38 : 20,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += 1;
        p.x += p.vx + Math.sin((p.life + i * 40) / 90) * 0.35;
        p.y += p.vy;
        p.r += 0.12;
        const t = p.life / p.max;
        const alpha = Math.sin(Math.PI * Math.min(1, t)) * 0.07;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `hsla(${p.hue}, 30%, 72%, ${alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, 30%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.max || p.y + p.r < 0) puffs[i] = spawn();
      }
    };

    const loop = () => {
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    const count = w < 640 ? 28 : 55;
    for (let i = 0; i < count; i++) puffs.push(spawn(true));
    if (reduce) {
      for (let k = 0; k < 120; k++) draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
