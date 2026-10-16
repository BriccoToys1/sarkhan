"use client";

import QRCode from "qrcode";
import { useMemo } from "react";

/** QR-код, модули которого проявляются золотой волной от центра. */
export function AnimatedQR({ value, size = 220 }: { value: string; size?: number }) {
  const cells = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
    const n = qr.modules.size;
    const out: { x: number; y: number; d: number }[] = [];
    const c = (n - 1) / 2;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) out.push({ x, y, d: Math.hypot(x - c, y - c) / c });
    return { n, out };
  }, [value]);

  return (
    <div className="relative inline-block bg-parchment p-3 shadow-gold-strong" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${cells.n} ${cells.n}`} className="h-full w-full" shapeRendering="crispEdges" role="img" aria-label="QR-код для перевода">
        {cells.out.map(({ x, y, d }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#0b0b0c" style={{ animation: `qr-in 0.5s ease ${(d * 0.9).toFixed(2)}s both` }} />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-x-3 top-3 h-8 bg-gradient-to-b from-gold/50 to-transparent mix-blend-multiply" style={{ animation: "qr-scan 2.6s ease-in-out infinite" }} aria-hidden />
      <style>{`@keyframes qr-scan{0%,100%{transform:translateY(0)}50%{transform:translateY(${size - 56}px)}}@keyframes qr-in{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
