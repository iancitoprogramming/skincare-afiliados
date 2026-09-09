import Link from "next/link";
import { Shell } from "@/components/Shell";
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

export default async function Kits() {
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kits = armarKits(productos, KITS, TIERS);

  return (
    <Shell volver={{ href: "/", label: "inicio" }}>
      <div className="flex flex-col gap-10">
        {/* Compra única primero: es el camino de menos fricción. */}
        {KITS_UNICOS.length > 0 ? (
          <section className="flex flex-col gap-4">
            <header className="flex flex-col gap-1">
              <h1 className="font-display text-3xl font-medium tracking-tight text-tinta">
                {copy.kits.unicos.titulo}
              </h1>
              <p className="font-body text-sm text-tinta/75">{copy.kits.unicos.bajada}</p>
            </header>

            {KITS_UNICOS.map((k) => (
              <Link
                key={k.slug}
                href={`/kits/${k.slug}`}
                className="flex flex-col gap-1 rounded-2xl border border-terracota/40 bg-gel/40 p-5 transition-transform active:scale-[0.99]"
              >
                <span className="flex flex-wrap items-center gap-2 font-mono text-xs text-piedra">
                  <span className="rounded-full bg-terracota px-2 py-0.5 text-porcelana">
                    {copy.kits.unicos.badge}
                  </span>
                  {k.mas_vendido ? <span>más vendido en ML</span> : null}
                </span>

                <span className="mt-1 font-display text-xl font-medium leading-tight text-tinta">
                  {k.nombre}
                </span>
                <span className="font-body text-sm text-tinta/75">{k.descripcion}</span>
                <PruebaSocial d={k} className="mt-2" />

                {/* Acá había precio y precio de lista tachado. Un descuento
                    tachado es lo primero que deja de ser cierto: dura días y
                    después el sitio está prometiendo una oferta que no existe.
                    El descuento de hoy se ve en la publicación. */}
                <RangoPrecio rango={k.rango_precio} className="mt-2 self-start" />

                <span className="mt-3 font-body text-base font-medium text-terracota">
                  {copy.kits.unicos.ver} →
                </span>
              </Link>
            ))}
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-medium tracking-tight text-tinta">
              {copy.kits.armados.titulo}
            </h2>
            <p className="font-body text-sm text-tinta/75">{copy.kits.armados.bajada}</p>
          </header>

          {kits.map((kit) => (
            <Link
              key={kit.def.slug}
              href={`/kits/${kit.def.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-niebla bg-gel/25 p-5 transition-transform active:scale-[0.99]"
            >
              <span className="font-mono text-xs text-piedra">
                {copy.kits.pasos(kit.pasos.length)} ·{" "}
                {copy.precio.rangoKit(copy.precio.rangos[kit.rango])}
              </span>
              <span className="font-display text-xl font-medium leading-tight text-tinta">
                {kit.def.nombre}
              </span>
              <span className="font-body text-sm text-tinta/75">{kit.def.descripcion}</span>
              <span className="mt-3 font-body text-base font-medium text-terracota">
                {copy.kits.ver} →
              </span>
            </Link>
          ))}
        </section>

        <Link
          href="/rutina"
          className="font-mono text-sm text-piedra transition-colors hover:text-tinta"
        >
          ¿ninguno te cierra? armá la tuya →
        </Link>
      </div>
    </Shell>
  );
}
