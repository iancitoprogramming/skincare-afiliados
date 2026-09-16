import { ImageResponse } from "next/og";
import { indicePorSlug, slugProducto } from "@/engine/slug";
import { PALETA } from "@/niches/skincare/paleta";
import { productos } from "@/niches/skincare/productos";
import { copy } from "@/niches/skincare/copy";
import { MarcaOG } from "@/components/og/MarcaOG";
import { fotoProducto, fuentesOG, tinta } from "@/components/og/recursos";

// La imagen que Pinterest y WhatsApp muestran al compartir una ficha.
//
// Va como ruta explícita y no con el archivo `opengraph-image.tsx` que propone
// Next: esa convención, dentro de un segmento dinámico, o prerenderiza en una
// URL que después no matchea, o revienta en runtime con "u2 is not iterable".
// Acá la URL la elegimos nosotros y funciona igual en dev que en producción.
//
// Antes de esto, el og:image de las 25 fichas apuntaba directo al CDN de Mercado
// Libre. Justo las 25 páginas que se pinean, dependiendo de que un tercero no
// bloquee el hotlink ni rote la URL.
//
// Desde el 15/9 tiene el lenguaje del sitio: marca y nombre en Newsreader, la
// marca del producto en mayúscula con aire y la banda en un recuadro recto.

// Constante local, no export: un route handler sólo admite exports conocidos.
const SIZE = { width: 1200, height: 630 };
const activos = productos.filter((p) => p.activo);

// Se hornean las 25 en el build. Así la descarga desde el CDN de Mercado Libre
// pasa a ser cosa nuestra una vez, y no algo que ocurre cuando Pinterest pide la
// imagen — que es cuando no querés depender de un tercero.
export const dynamic = "force-static";

export function generateStaticParams() {
  return activos.map((p) => ({ slug: slugProducto(p) }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = indicePorSlug(activos).get(slug);
  if (!p) return new Response("No existe", { status: 404 });

  const [foto, fuentes] = await Promise.all([fotoProducto(p.imagen_hd ?? p.imagen_url), fuentesOG()]);
  const banda = copy.precio.rangos[p.rango_precio];

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: foto ? "58%" : "100%",
            padding: "64px",
          }}
        >
          <MarcaOG escala={0.8} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {p.marca ? (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Instrument Sans",
                  fontSize: "20px",
                  letterSpacing: "0.16em",
                  color: tinta(0.7),
                }}
              >
                {p.marca.toLocaleUpperCase("es-AR")}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                marginTop: "14px",
                fontFamily: "Newsreader",
                fontSize: p.nombre.length > 40 ? "48px" : "58px",
                fontWeight: 400,
                color: PALETA.tinta,
                lineHeight: 1.1,
              }}
            >
              {p.nombre}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            {/* Acá había el precio en pesos, y era el peor lugar del sitio para
                tenerlo: Pinterest cachea esta imagen y no la regenera sola, así
                que un descuento la deja mintiendo en el feed durante meses, sin
                que se note desde acá. La banda cualitativa dice lo mismo que el
                número decía de verdad y no envejece. Ver `docs/PRECIO.md`. */}
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
            {/* Mismo criterio que en el sitio: la calificación sólo con 10 o más
                opiniones detrás, porque tres productos tienen 5,0 con una sola.
                Es un dato de Mercado Libre, no nuestra valoración del producto.
                Sin ★: la fuente por defecto de Satori no tiene ese glifo y sale
                como caja vacía. Escrito en palabras se entiende igual. */}
            {p.rating && (p.opiniones ?? 0) >= 10 ? (
              <div style={{ display: "flex", fontFamily: "Instrument Sans", fontSize: "24px", color: tinta(0.7) }}>
                {`${p.rating.toLocaleString("es-AR", { minimumFractionDigits: 1 })} de 5 · ${p.opiniones!.toLocaleString("es-AR")} opiniones`}
              </div>
            ) : null}
          </div>
        </div>

        {/* La foto va sobre blanco y no sobre arena como en el sitio: allá el
            blanco de la foto se funde con mix-blend-mode, y Satori no lo
            soporta. Sobre arena se vería el recuadro; sobre blanco, no. */}
        {foto ? (
          <div
            style={{
              display: "flex",
              width: "42%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              padding: "56px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
        ) : null}
      </div>
    ),
    // Sin fuentes cargadas no se pasa el arreglo vacío: así Satori usa la suya.
    { ...SIZE, ...(fuentes.length ? { fonts: fuentes } : {}) },
  );
}
