import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { BotonComprar } from "@/components/BotonComprar";
import { GuardarEnPinterest } from "@/components/GuardarEnPinterest";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";
import { ETIQUETA, ETIQUETA_BASE, FOTO_PRODUCTO, MARCO_FOTO } from "@/components/estilo";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKits } from "@/engine/kits";
import { indicePorSlug, slugProducto } from "@/engine/slug";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, ORIGENES, TIERS } from "@/niches/skincare/config";
import { KITS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";
import { descripcionPin } from "@/lib/pinterest";
import { urlDelSitio } from "@/lib/sitio";

export const revalidate = 3600;

// Una URL por producto. Es la unidad que se pinea: un pin lleva a un producto,
// no a una grilla donde la persona tiene que volver a buscar lo que ya vio.
export function generateStaticParams() {
  return fallback.filter((p) => p.activo).map((p) => ({ slug: slugProducto(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = indicePorSlug(fallback.filter((x) => x.activo)).get(slug);
  if (!p) return {};
  const titulo = [p.marca, p.nombre].filter(Boolean).join(" ");
  return {
    title: `${titulo} · ${copy.marca}`,
    description: p.por_que ?? copy.meta.description,
    // Todo relativo a propósito. Next lo resuelve contra metadataBase, así que
    // el día que se cargue NEXT_PUBLIC_SITE_URL se actualizan solas. Absolutas
    // quedarían clavadas al vercel.app.
    alternates: { canonical: `/producto/${slug}` },
    openGraph: {
      url: `/producto/${slug}`,
      // Imagen propia. Antes acá iba `p.imagen_hd`, o sea un hotlink al CDN de
      // Mercado Libre en las 25 páginas que se pinean.
      images: [{ url: `/api/og/producto/${slug}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductoDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const activos = productos.filter((p) => p.activo);

  const p = indicePorSlug(activos).get(slug);
  if (!p) notFound();

  // En qué kits aparece. Da contexto y manda tráfico al kit, que convierte mejor
  // que un producto suelto porque resuelve la rutina entera.
  const enKits = armarKits(productos, KITS, TIERS).filter((k) =>
    k.pasos.some((paso) => paso.producto.id === p.id),
  );

  // Lo que se guarda en Pinterest: la ficha, con su pin 2:3 y no con la foto de
  // Mercado Libre. Absolutas porque salen del sitio.
  const sitio = urlDelSitio();
  const pin = {
    url: `${sitio}/producto/${slug}`,
    media: `${sitio}/api/pin/producto/${slug}`,
    descripcion: descripcionPin(p),
  };

  return (
    <Shell volver={{ href: "/catalogo", label: "catálogo" }} disclaimers>
      <article className="flex flex-col gap-5">
        {p.imagen_url ? (
          // Abajo, el marco deja lugar para el botón Guardar (pb-14): así no tapa
          // la foto, que queda del mismo alto que antes.
          <div className={`relative h-80 w-full px-6 pb-14 pt-6 ${MARCO_FOTO}`}>
            {/* Los data-pin-* los lee el selector de imágenes de Pinterest
                (pinmarklet.js): si alguien guarda desde la extensión, se lleva el
                pin 2:3 y no la foto de Mercado Libre. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imagen_url}
              alt={`${p.marca ?? ""} ${p.nombre}`.trim()}
              className={FOTO_PRODUCTO}
              data-pin-media={pin.media}
              data-pin-url={pin.url}
              data-pin-description={pin.descripcion}
            />
            {/* En la esquina del marco, porque lo que se guarda es la foto. */}
            <GuardarEnPinterest
              {...pin}
              className={`absolute bottom-0 right-0 inline-flex min-h-11 items-center bg-porcelana px-4 ${ETIQUETA_BASE} text-tinta underline-offset-4 hover:underline`}
            />
          </div>
        ) : null}

        <header className="flex flex-col gap-2">
          {p.marca ? <p className={ETIQUETA}>{p.marca}</p> : null}
          <h1 className="font-display text-3xl font-normal leading-tight text-tinta">{p.nombre}</h1>
          <PruebaSocial d={p} />
        </header>

        {/* Antes acá iba el precio en pesos con la fecha del relevamiento al
            pie. La fecha era honesta pero no arreglaba el problema: seguía
            siendo un número que el sitio afirma y que Mercado Libre desmiente
            al día siguiente. Ahora se afirma la banda —que no caduca— y el
            número se busca donde siempre estuvo bien, en la publicación. */}
        <div className="flex flex-col gap-1">
          <RangoPrecio rango={p.rango_precio} className="self-start" />
          <p className="font-etiqueta text-xs text-piedra">{copy.precio.dondeVerlo}</p>
        </div>

        <BotonComprar
          href={p.link_afiliado}
          productoId={p.id}
          label="Ver en Mercado Libre"
        />
        <p className="font-body text-sm text-tinta">
          <span className="text-piedra">{copy.ficha.cruce}</span>{" "}
          <Link href="/rutina" className="font-medium text-tinta underline decoration-piedra underline-offset-4">
            {copy.ficha.cruceCta} →
          </Link>
        </p>

        {p.por_que ? (
          <section className="flex flex-col gap-2">
            <h2 className={ETIQUETA}>{copy.ficha.porQue}</h2>
            <p className="font-body leading-relaxed text-tinta">{p.por_que}</p>
          </section>
        ) : null}

        {p.como_usar ? (
          <section className="flex flex-col gap-2">
            <h2 className={ETIQUETA}>cómo se usa</h2>
            <p className="font-body leading-relaxed text-tinta">{p.como_usar}</p>
          </section>
        ) : null}

        <section className="flex flex-col divide-y divide-niebla bg-arena px-5">
          <Dato k="paso" v={CATEGORIAS[p.categoria] ?? p.categoria} />
          <Dato k="origen" v={ORIGENES[p.origen] ?? p.origen} />
          <Dato k="tipo de piel" v={p.tipos_piel.join(" · ")} />
          <Dato
            k="piel sensible"
            v={p.apto_sensible ? "apto" : "no recomendado"}
          />
        </section>

        {enKits.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h2 className={ETIQUETA}>aparece en</h2>
            {enKits.map((k) => (
              <Link
                key={k.def.slug}
                href={`/kits/${k.def.slug}`}
                className="flex flex-col gap-1 border border-niebla p-4 transition-colors hover:border-tinta"
              >
                <span className="font-display text-lg font-normal text-tinta">{k.def.nombre}</span>
                <span className={ETIQUETA}>
                  {copy.kits.pasos(k.pasos.length)} · {copy.precio.rangoKit(copy.precio.rangos[k.rango])}
                </span>
              </Link>
            ))}
          </section>
        ) : null}
      </article>
    </Shell>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <p className="flex items-baseline justify-between gap-4 py-3">
      <span className={ETIQUETA}>{k}</span>
      <span className="text-right font-body text-sm text-tinta">{v}</span>
    </p>
  );
}
