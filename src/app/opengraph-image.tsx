import { ImageResponse } from "next/og";

export const alt = "Sarkhan Grim — Mystical Cards & Esoteric Artifacts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #2a2018 0%, #0b0b0c 65%)",
          color: "#c5a880",
          fontFamily: "serif",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="#c5a880" strokeWidth="2">
          <circle cx="50" cy="50" r="44" />
          <circle cx="50" cy="50" r="38" strokeOpacity="0.45" />
          <path d="M 32 30 A 18 18 0 0 0 68 30 A 13 18 0 0 1 32 30 Z" />
          <path d="M 50 44 V 86" />
          <path d="M 38 66 H 62" />
          <path d="M 50 50 L 66 78 H 34 Z" strokeOpacity="0.6" />
        </svg>
        <div style={{ marginTop: 40, fontSize: 84, letterSpacing: 18 }}>SARKHAN GRIM</div>
        <div style={{ marginTop: 16, fontSize: 32, fontStyle: "italic", color: "#e6d3ad", letterSpacing: 4 }}>Mystical Cards & Esoteric Artifacts</div>
      </div>
    ),
    size,
  );
}
