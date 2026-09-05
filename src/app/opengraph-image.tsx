import { ImageResponse } from "next/og";
import { copy } from "@/niches/skincare/copy";

export const alt = copy.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir (Instagram/WhatsApp). Colores de marca, sin fuentes custom.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#eff2f0",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#f0531d" }}
          />
          <div style={{ fontSize: "36px", fontWeight: 600, color: "#16211d" }}>{copy.marca}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "84px",
            fontWeight: 600,
            color: "#16211d",
            lineHeight: 1.05,
          }}
        >
          <span>Tu piel,</span>
          <span>sin vueltas.</span>
        </div>
        <div style={{ fontSize: "30px", color: "#6fb2c0" }}>
          Kits armados · o tu rutina en 4 preguntas
        </div>
      </div>
    ),
    size,
  );
}
