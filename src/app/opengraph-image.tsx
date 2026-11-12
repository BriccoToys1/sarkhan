import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Sarkhan Grim — Mystical Cards & Esoteric Artifacts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoBuf = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={180} height={180} alt="" style={{ borderRadius: 999 }} />
        <div style={{ marginTop: 36, fontSize: 84, letterSpacing: 18 }}>SARKHAN GRIM</div>
        <div style={{ marginTop: 16, fontSize: 32, fontStyle: "italic", color: "#e6d3ad", letterSpacing: 4 }}>
          Mystical Cards & Esoteric Artifacts
        </div>
      </div>
    ),
    size,
  );
}
