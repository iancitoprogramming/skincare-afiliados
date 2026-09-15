import Link from "next/link";
import { Shell } from "@/components/Shell";
import { BOTON_LINEA, ETIQUETA, ETIQUETA_BASE } from "@/components/estilo";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";
import { TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";
import { OG_POR_DEFECTO } from "@/lib/sitio";

export const revalidate = 3600;

export const metadata = {
  title: `${copy.kits.titulo} · ${copy.marca}`,
  description: copy.kits.bajada,
  alternates: { canonical: "/kits" },
  openGraph: { url: "/kits", images: OG_POR_DEFECTO },
};

// El sello de "una sola compra". Va en tinta con borde y no en terracota: el
// terracota es sólo para comprar, y la tarjeta todavía no abre la publicación,
// abre el kit.
const SELLO = `${ETIQUETA_BASE} border border-tinta px-2 py-0.5 text-tinta`;

export default async function Kits() {
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kits = armarKits(productos, KITS, TIERS);

  return (
    <Shell volver={{ href: "/", label: "inicio" }}>
      <div className="flex flex-col gap-12">
        {/* Compra única primero: es el camino de menos fricción. */}
        {KITS_UNICOS.length > 0 ? (
          <section className="flex flex-col gap-4">
            <header className="flex flex-col gap-1">
              <h1 className="font-display text-3xl font-normal text-tinta">
                {copy.kits.unicos.titulo}
              </h1>
              <p className="font-body text-sm text-tinta/80">{copy.kits.unicos.bajada}</p>
            </header>

            {KITS_UNICOS.map((k) => (
              <Link
                key={k.slug}
                href={`/kits/${k.slug}`}
                className="group flex flex-col gap-1 border border-niebla p-5 transition-colors hover:border-tinta"
              >
                <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={SELLO}>{copy.kits.unicos.badge}</span>
                  {k.mas_vendido ? <span className={ETIQUETA}>más vendido en ML</span> : null}
                </span>

                <span className="mt-2 font-display text-xl font-normal leading-tight text-tinta">
                  {k.nombre}
                </span>
                <span className="font-body text-sm text-tinta/80">{k.descripcion}</span>
                <PruebaSocial d={k} className="mt-2" />

                {/* Acá había precio y precio de lista tachado. Un descuento
                    tachado es lo primero que deja de ser cierto: dura días y
                    después el sitio está prometiendo una oferta que no existe.
                    El descuento de hoy se ve en la publicación. */}
                <RangoPrecio rango={k.rango_precio} className="mt-2 self-start" />

                {/* Un <span> y no un botón: la tarjeta entera es el link. */}
                <span className={`${BOTON_LINEA} mt-4 group-hover:bg-tinta group-hover:text-porcelana`}>
                  {copy.kits.unicos.ver}
                </span>
              </Link>
            ))}
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-normal text-tinta">
              {copy.kits.armados.titulo}
            </h2>
            <p className="font-body text-sm text-tinta/80">{copy.kits.armados.bajada}</p>
          </header>

          <ul className="border-t border-niebla">
            {kits.map((kit) => (
              <li key={kit.def.slug}>
                <Link
                  href={`/kits/${kit.def.slug}`}
                  className="group flex flex-col gap-1 border-b border-niebla py-5"
                >
                  <span className={ETIQUETA}>
                    {copy.kits.pasos(kit.pasos.length)} ·{" "}
                    {copy.precio.rangoKit(copy.precio.rangos[kit.rango])}
                  </span>
                  <span className="font-display text-xl font-normal leading-tight text-tinta">
                    {kit.def.nombre}
                  </span>
                  <span className="font-body text-sm text-tinta/80">{kit.def.descripcion}</span>
                  <span className={`${ETIQUETA_BASE} mt-2 font-medium text-tinta underline-offset-4 group-hover:underline`}>
                    {copy.kits.ver} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/rutina"
          className={`${ETIQUETA_BASE} inline-flex min-h-11 items-center self-start text-tinta underline decoration-niebla underline-offset-4 transition-colors hover:decoration-tinta`}
        >
          ¿ninguno te cierra? armá la tuya →
        </Link>
      </div>
    </Shell>
  );
}
