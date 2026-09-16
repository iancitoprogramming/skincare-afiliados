import { ImageResponse } from "next/og";
import { indicePorSlug, slugProducto } from "@/engine/slug";
import { CATEGORIAS } from "@/niches/skincare/config";
import { PALETA } from "@/niches/skincare/paleta";
import { productos } from "@/niches/skincare/productos";
import { copy } from "@/niches/skincare/copy";
import { MarcaOG } from "@/components/og/MarcaOG";
import { fotoProducto, fuentesOG, tinta } from "@/components/og/recursos";
import { PIN } from "@/lib/pinterest";

// El pin 2:3 de cada ficha: la imagen que el botón Guardar le ofrece a Pinterest.
//
// Sigue el orden que Pinterest recomienda para un pin: "visuals in the middle,
// then stacking text overlay with key messaging at the top and extra details at
// the bottom" (Creative best practices). Arriba la marca del sitio y el producto;
// en el medio la foto; abajo el porqué de la ficha, el paso y la banda de precio.
//
// Mismo criterio que la imagen de Open Graph de la ficha: sin precio en pesos,
// porque Pinterest cachea la imagen y un descuento la dejaría mintiendo, y la foto
// sobre blanco, porque Satori no soporta mix-blend-mode. Ver
// `api/og/producto/[slug]/route.tsx`.

const activos = productos.filter((p) => p.activo);

// Se hornean todas en el build, como las de Open Graph: Pinterest pide la imagen
// cuando alguien guarda, y ahí no hay que depender del CDN de Mercado Libre.
export const dynamic = "force-static";

export function generateStaticParams() {
  return activos.map((p) => ({ slug: slugProducto(p) }));
}

/** Los nombres son títulos de Mercado Libre y van de 20 a 99 caracteres. */
function tamanoNombre(nombre: string): string {
  if (nombre.length <= 40) return "64px";
  if (nombre.length <= 70) return "54px";
  return "46px";
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = indicePorSlug(activos).get(slug);
  if (!p) return new Response("No existe", { status: 404 });

  const [foto, fuentes] = await Promise.all([fotoProducto(p.imagen_hd ?? p.imagen_url), fuentesOG()]);
  const paso = CATEGORIAS[p.categoria] ?? p.categoria;
  const banda = copy.precio.rangos[p.rango_precio];
  const etiqueta = {
    display: "flex",
    fontFamily: "Instrument Sans",
    letterSpacing: "0.16em",
    color: tinta(0.7),
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PALETA.porcelana,
          padding: "64px",
        }}
      >
        <MarcaOG escala={0.8} />

        <div style={{ display: "flex", flexDirection: "column", marginTop: "44px" }}>
          {p.marca ? <div style={{ ...etiqueta, fontSize: "24px" }}>{p.marca.toLocaleUpperCase("es-AR")}</div> : null}
          <div
            style={{
              display: "flex",
              marginTop: "12px",
              fontFamily: "Newsreader",
              fontSize: tamanoNombre(p.nombre),
              fontWeight: 400,
              lineHeight: 1.12,
              color: PALETA.tinta,
            }}
          >
            {p.nombre}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            padding: "56px",
            overflow: "hidden",
          }}
        >
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          ) : null}
        </div>

        {p.por_que ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
            <div style={{ ...etiqueta, fontSize: "20px" }}>{copy.ficha.porQue.toLocaleUpperCase("es-AR")}</div>
            <div
              style={{
                display: "flex",
                marginTop: "12px",
                fontFamily: "Instrument Sans",
                fontSize: "30px",
                lineHeight: 1.4,
                color: PALETA.tinta,
              }}
            >
              {p.por_que}
            </div>
          </div>
        ) : null}

        {/* El paso como etiqueta y la banda en su recuadro, como en la ficha y en
            la imagen de Open Graph. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
            paddingTop: "28px",
            borderTop: `2px solid ${PALETA.niebla}`,
          }}
        >
          <div style={{ ...etiqueta, fontSize: "20px" }}>{paso.toLocaleUpperCase("es-AR")}</div>
          {banda ? (
            <div
              style={{
                display: "flex",
                fontFamily: "Instrument Sans",
                fontSize: "24px",
                color: PALETA.piedra,
                border: `2px solid ${PALETA.niebla}`,
                padding: "6px 16px",
              }}
            >
              {banda}
            </div>
          ) : null}
        </div>
      </div>
    ),
    // Sin fuentes cargadas no se pasa el arreglo vacío: así Satori usa la suya.
    { ...PIN, ...(fuentes.length ? { fonts: fuentes } : {}) },
  );
}
