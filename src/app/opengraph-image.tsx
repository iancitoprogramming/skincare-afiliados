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
            style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#f0531d" }}
          />
          <div style={{ fontSize: "28px", color: "#6fb2c0" }}>rutina en 30 segundos</div>
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
          <span>Tu rutina de skincare,</span>
          <span>para tu piel y tu bolsillo.</span>
        </div>
        <div style={{ fontSize: "30px", color: "#6fb2c0" }}>
          4 preguntas · productos recomendados
        </div>
      </div>
    ),
    size,
  );
}
