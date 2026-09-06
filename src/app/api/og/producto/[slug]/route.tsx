import { ImageResponse } from "next/og";
import { indicePorSlug, slugProducto } from "@/engine/slug";
import { PALETA } from "@/niches/skincare/paleta";
import { productos } from "@/niches/skincare/productos";
import { MarcaOG } from "@/components/og/MarcaOG";

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

/**
 * Trae la foto de ML y la devuelve como data URI.
 *
 * Corre del lado del servidor, no en el cliente de quien comparte. Es lo que
 * convierte un hotlink en un PNG propio.
 *
 * Pide .jpg aunque el catálogo guarde .webp: Satori —el motor detrás de
 * ImageResponse— no decodifica WebP y falla con "u2 is not iterable", que no
 * dice absolutamente nada. El CDN de Mercado Libre sirve las dos extensiones
 * para la misma foto.
 *
 * Si falla, la imagen se arma igual sin foto: una ficha sin foto en el preview
 * es un problema menor, una imagen rota es peor.
 */
async function fotoComoDataUri(url?: string): Promise<string | null> {
  if (!url) return null;
  try {
    const r = await fetch(url.replace(/\.webp$/i, ".jpg"));
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return `data:${r.headers.get("content-type") ?? "image/jpeg"};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = indicePorSlug(activos).get(slug);
  if (!p) return new Response("No existe", { status: 404 });

  const foto = await fotoComoDataUri(p.imagen_hd ?? p.imagen_url);

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
            padding: "70px",
          }}
        >
          <MarcaOG escala={0.8} />

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {p.marca ? (
              <div style={{ display: "flex", fontSize: "28px", color: PALETA.piedra }}>
                {p.marca}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: p.nombre.length > 40 ? "50px" : "62px",
                fontWeight: 600,
                color: PALETA.tinta,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {p.nombre}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            {p.precio_ars ? (
              <div
                style={{ display: "flex", fontSize: "40px", fontWeight: 600, color: PALETA.tinta }}
              >
                ${p.precio_ars.toLocaleString("es-AR")}
              </div>
            ) : null}
            {/* Mismo criterio que en el sitio: la calificación sólo con respaldo.
                Sin ★: la fuente por defecto de Satori no tiene ese glifo y sale
                como caja vacía. Escrito en palabras se entiende igual. */}
            {p.rating && (p.opiniones ?? 0) >= 10 ? (
              <div style={{ display: "flex", fontSize: "26px", color: PALETA.piedra }}>
                {`${p.rating.toLocaleString("es-AR", { minimumFractionDigits: 1 })} de 5 · ${p.opiniones!.toLocaleString("es-AR")} opiniones`}
              </div>
            ) : null}
          </div>
        </div>

        {foto ? (
          <div
            style={{
              display: "flex",
              width: "42%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: PALETA.gel,
              padding: "50px",
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
    SIZE,
  );
}
