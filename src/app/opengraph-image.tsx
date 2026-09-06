import { ImageResponse } from "next/og";
import { configServible } from "@/engine/quiz/servible";
import { copy } from "@/niches/skincare/copy";
import { PALETA } from "@/niches/skincare/paleta";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos } from "@/niches/skincare/productos";
import { MarcaOG } from "@/components/og/MarcaOG";

export const alt = copy.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// La imagen que ven Pinterest, WhatsApp e Instagram al compartir el link.
//
// Nada acá va hardcodeado: los colores salen de PALETA, el título de copy.ts y
// la cantidad de preguntas de configServible(). Cuando esos tres cambian, la
// imagen cambia con ellos.
//
// Importa porque esta imagen no se ve navegando el sitio: si queda vieja, nadie
// se entera hasta que alguien comparte el link. Ya pasó una vez — quedó con el
// headline descartado, con "4 preguntas" cuando eran 5, y con la paleta anterior.
export default function OpengraphImage() {
  const preguntas = configServible(skincareQuiz, productos).questions.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PALETA.porcelana,
          padding: "80px",
        }}
      >
        <MarcaOG />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "70px",
            fontWeight: 600,
            color: PALETA.tinta,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {copy.home.tituloOG.map((linea, i) => (
            <span key={linea} style={i === copy.home.tituloOG.length - 1 ? { color: PALETA.salvia } : undefined}>
              {linea}
            </span>
          ))}
        </div>

        {/* display explícito: Satori lo exige en cualquier div con más de un
            hijo, y la interpolación de {preguntas} parte el texto en tres nodos. */}
        <div style={{ display: "flex", fontSize: "30px", color: PALETA.piedra }}>
          Catálogo · kits armados · o tu rutina en {preguntas} preguntas
        </div>
      </div>
    ),
    size,
  );
}
