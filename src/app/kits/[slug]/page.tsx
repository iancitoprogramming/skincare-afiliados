import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { BotonComprar } from "@/components/BotonComprar";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";
import { ETIQUETA, ETIQUETA_BASE, FOTO_PRODUCTO, MARCO_FOTO } from "@/components/estilo";
import { getCatalogo } from "@/engine/catalogo";
import { OG_POR_DEFECTO } from "@/lib/sitio";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKit } from "@/engine/kits";
import { PasoRutina } from "@/engine/quiz/PasoRutina";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

// Cada kit es una URL propia: sirve para pinear uno por tipo de piel.
export function generateStaticParams() {
  return [...KITS_UNICOS, ...KITS].map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const k = [...KITS_UNICOS, ...KITS].find((x) => x.slug === slug);
  if (!k) return {};
  return {
    title: `${k.nombre} · ${copy.marca}`,
    description: k.descripcion,
    alternates: { canonical: `/kits/${slug}` },
    openGraph: { url: `/kits/${slug}`, images: OG_POR_DEFECTO },
  };
}

export default async function KitDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ── Kit de compra única: una publicación de ML, un botón ──────────────────
  const unico = KITS_UNICOS.find((k) => k.slug === slug);
  if (unico) {
    return (
      <Shell volver={{ href: "/kits", label: copy.kits.volver }} disclaimers>
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-2">
            {/* El sello en tinta: el terracota queda para el botón de compra. */}
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className={`${ETIQUETA_BASE} border border-tinta px-2 py-0.5 text-tinta`}>
                {copy.kits.unicos.badge}
              </span>
              {unico.mas_vendido ? <span className={ETIQUETA}>más vendido en ML</span> : null}
            </span>
            <h1 className="font-display text-3xl font-normal leading-tight text-tinta">
              {unico.nombre}
            </h1>
            <p className="font-body text-sm text-tinta/80">{unico.descripcion}</p>
            <PruebaSocial d={unico} className="mt-1" />
          </header>

          <div className={`h-56 w-full p-4 ${MARCO_FOTO}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={unico.imagen_url} alt={unico.nombre} className={FOTO_PRODUCTO} />
          </div>

          <div className="flex flex-col gap-1">
            <RangoPrecio rango={unico.rango_precio} className="self-start" />
            <p className="font-etiqueta text-xs text-piedra">{copy.precio.dondeVerlo}</p>
          </div>

          {unico.incluye.length > 0 ? (
            <div className="bg-arena p-5">
              <p className={ETIQUETA}>{copy.kits.unicos.incluye}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {unico.incluye.map((x) => (
                  <li key={x} className="font-body text-tinta">
                    · {x}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <BotonComprar
            href={unico.link_afiliado}
            productoId={unico.ml_id}
            label={copy.kits.unicos.ver}
          />

          <p className="font-body text-sm text-tinta/80">
            {copy.kits.unicos.bajada}
            {unico.vendedor ? ` Vendido por ${unico.vendedor}.` : ""}
          </p>
        </div>
      </Shell>
    );
  }

  // ── Kit armado por nosotros: N productos, N compras ───────────────────────
  const def = KITS.find((k) => k.slug === slug);
  if (!def) notFound();

  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kit = armarKit(productos, def, TIERS);
  if (!kit) notFound();

  return (
    <Shell volver={{ href: "/kits", label: copy.kits.volver }} disclaimers>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className={ETIQUETA}>
            {copy.kits.pasos(kit.pasos.length)} ·{" "}
            {copy.precio.rangoKit(copy.precio.rangos[kit.rango])}
          </p>
          <h1 className="font-display text-3xl font-normal leading-tight text-tinta">
            {def.nombre}
          </h1>
          <p className="font-body text-sm text-tinta/80">{def.descripcion}</p>
        </header>

        <div className="flex flex-col gap-3">
          {kit.pasos.map((paso, i) => (
            <PasoRutina
              key={paso.producto.id}
              paso={paso}
              numero={i + 1}
              categoriaLabel={CATEGORIAS[paso.slot.categoria] ?? paso.slot.categoria}
              sesionId={null}
            />
          ))}
        </div>

        <p className="bg-arena p-4 font-body text-sm text-tinta/80">
          {copy.kits.aclaracionCompra}
        </p>
      </div>
    </Shell>
  );
}
