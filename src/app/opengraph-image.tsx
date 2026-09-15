import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { configServible } from "@/engine/quiz/servible";
import { copy } from "@/niches/skincare/copy";
import { PALETA } from "@/niches/skincare/paleta";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos } from "@/niches/skincare/productos";
import { MarcaOG } from "@/components/og/MarcaOG";
import { fuentesOG, tinta } from "@/components/og/recursos";

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
//
// Desde el 15/9 tiene el lenguaje de la home: la foto de la portada a la
// izquierda, la etiqueta en mayúscula con aire y el titular en Newsreader.

/**
 * La foto de la portada de la home, como data URI. Es de Unsplash, con la
 * licencia verificada en `fotos-home.ts`. Si no se puede leer, la imagen se arma
 * sin foto.
 */
async function fotoPortada(): Promise<string | null> {
  try {
    const foto = await readFile(join(process.cwd(), "src/assets/home/serums-superpuestos.jpg"));
    return `data:image/jpeg;base64,${foto.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const preguntas = configServible(skincareQuiz, productos).questions.length;
  const [foto, fuentes] = await Promise.all([fotoPortada(), fuentesOG()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: PALETA.porcelana,
        }}
      >
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt="" width={500} height={630} style={{ width: "500px", height: "630px", objectFit: "cover" }} />
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "64px",
          }}
        >
          <MarcaOG />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Instrument Sans",
                fontSize: "18px",
                letterSpacing: "0.16em",
                color: tinta(0.7),
              }}
            >
              {copy.home.portada.etiqueta.toLocaleUpperCase("es-AR")}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                fontFamily: "Newsreader",
                fontSize: "62px",
                fontWeight: 400,
                color: PALETA.tinta,
                lineHeight: 1.08,
              }}
            >
              {copy.home.tituloOG.map((linea) => (
                <span key={linea}>{linea}</span>
              ))}
            </div>
          </div>

          {/* display explícito: Satori lo exige en cualquier div con más de un
              hijo, y la interpolación de {preguntas} parte el texto en tres nodos. */}
          <div style={{ display: "flex", fontFamily: "Instrument Sans", fontSize: "24px", color: tinta(0.8) }}>
            Catálogo · kits armados · o tu rutina en {preguntas} preguntas
          </div>
        </div>
      </div>
    ),
    // Sin fuentes cargadas no se pasa el arreglo vacío: así Satori usa la suya.
    { ...size, ...(fuentes.length ? { fonts: fuentes } : {}) },
  );
}
