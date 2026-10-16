"use client";

import { useCallback, useRef } from "react";

/**
 * 3D-наклон карточки за курсором («Дыхание бездны»).
 * Пишет CSS-переменные --rx/--ry (градусы) и --mx/--my (позиция блика) прямо в style, без ре-рендеров.
 */
export function useTilt<T extends HTMLElement>(max = 10) {
  const node = useRef<T | null>(null);
  const frame = useRef(0);

  const bind = useCallback((el: T | null) => {
    node.current = el;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (e.pointerType !== "mouse") return;
      const el = node.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
    },
    [max],
  );

  const onPointerLeave = useCallback(() => {
    const el = node.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);

  return { bind, onPointerMove, onPointerLeave };
}

export const tiltStyle = {
  transform: "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
} as const;
