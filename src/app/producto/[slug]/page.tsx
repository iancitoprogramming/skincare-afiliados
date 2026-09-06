import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { BotonComprar } from "@/components/BotonComprar";
import { PruebaSocial } from "@/components/PruebaSocial";
import { getCatalogo } from "@/engine/catalogo";
import { armarKits } from "@/engine/kits";
import { indicePorSlug, slugProducto } from "@/engine/slug";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, ORIGENES, TIERS } from "@/niches/skincare/config";
import { KITS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";

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

const precio = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default async function ProductoDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productos = await getCatalogo(fallback);
  const activos = productos.filter((p) => p.activo);

  const p = indicePorSlug(activos).get(slug);
  if (!p) notFound();

  // En qué kits aparece. Da contexto y manda tráfico al kit, que convierte mejor
  // que un producto suelto porque resuelve la rutina entera.
  const enKits = armarKits(productos, KITS, TIERS).filter((k) =>
    k.pasos.some((paso) => paso.producto.id === p.id),
  );

  return (
    <Shell volver={{ href: "/catalogo", label: "catálogo" }} disclaimers>
      <article className="flex flex-col gap-5">
        {p.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imagen_url}
            alt={`${p.marca ?? ""} ${p.nombre}`.trim()}
            className="h-64 w-full rounded-2xl border border-niebla bg-porcelana object-contain p-3"
          />
        ) : null}

        <header className="flex flex-col gap-2">
          {p.marca ? <p className="font-mono text-xs text-piedra">{p.marca}</p> : null}
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-tinta">
            {p.nombre}
          </h1>
          <PruebaSocial d={p} />
        </header>

        {p.precio_ars ? (
          <p className="font-display text-3xl font-medium text-tinta">{precio(p.precio_ars)}</p>
        ) : null}

        <BotonComprar
          href={p.link_afiliado}
          productoId={p.id}
          label="Ver en Mercado Libre"
        />

        {p.por_que ? (
          <section className="flex flex-col gap-2">
            <h2 className="font-mono text-xs text-piedra">por qué lo elegimos</h2>
            <p className="font-body leading-relaxed text-tinta">{p.por_que}</p>
          </section>
        ) : null}

        {p.como_usar ? (
          <section className="flex flex-col gap-2">
            <h2 className="font-mono text-xs text-piedra">cómo se usa</h2>
            <p className="font-body leading-relaxed text-tinta">{p.como_usar}</p>
          </section>
        ) : null}

        <section className="flex flex-col gap-3 rounded-2xl border border-niebla bg-gel/25 p-5">
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
            <h2 className="font-mono text-xs text-piedra">aparece en</h2>
            {enKits.map((k) => (
              <Link
                key={k.def.slug}
                href={`/kits/${k.def.slug}`}
                className="flex flex-col gap-1 rounded-2xl border border-niebla bg-porcelana p-4 transition-transform active:scale-[0.99]"
              >
                <span className="font-display text-lg font-medium text-tinta">{k.def.nombre}</span>
                <span className="font-mono text-xs text-piedra">
                  {copy.kits.pasos(k.pasos.length)}
                  {k.totalCompleto ? ` · ${copy.kits.total} ${precio(k.total)}` : ""}
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
    <p className="flex items-baseline justify-between gap-4">
      <span className="font-mono text-xs text-piedra">{k}</span>
      <span className="text-right font-body text-sm text-tinta">{v}</span>
    </p>
  );
}
