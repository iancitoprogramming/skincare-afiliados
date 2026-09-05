import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { BotonComprar } from "@/components/BotonComprar";
import { getCatalogo } from "@/engine/catalogo";
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
  return { title: `${k.nombre} · ${copy.marca}`, description: k.descripcion };
}

const precio = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default async function KitDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ── Kit de compra única: una publicación de ML, un botón ──────────────────
  const unico = KITS_UNICOS.find((k) => k.slug === slug);
  if (unico) {
    return (
      <Shell volver={{ href: "/kits", label: copy.kits.volver }} disclaimers>
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-2">
            <span className="flex flex-wrap items-center gap-2 font-mono text-xs text-agua">
              <span className="rounded-full bg-vitamina px-2 py-0.5 text-porcelana">
                {copy.kits.unicos.badge}
              </span>
              {unico.mas_vendido ? <span>más vendido en ML</span> : null}
            </span>
            <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-tinta">
              {unico.nombre}
            </h1>
            <p className="font-body text-sm text-tinta/75">{unico.descripcion}</p>
          </header>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={unico.imagen_url}
            alt={unico.nombre}
            className="h-56 w-full rounded-2xl border border-niebla bg-porcelana object-contain p-2"
          />

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-medium text-tinta">
              {precio(unico.precio_ars)}
            </span>
            {unico.precio_lista ? (
              <span className="font-mono text-base text-agua line-through">
                {precio(unico.precio_lista)}
              </span>
            ) : null}
          </div>

          {unico.incluye.length > 0 ? (
            <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
              <p className="font-mono text-xs text-agua">{copy.kits.unicos.incluye}</p>
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

          <p className="font-body text-sm text-tinta/75">
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

  const productos = await getCatalogo(fallback);
  const kit = armarKit(productos, def, TIERS);
  if (!kit) notFound();

  return (
    <Shell volver={{ href: "/kits", label: copy.kits.volver }} disclaimers>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs text-agua">
            {copy.kits.pasos(kit.pasos.length)}
            {kit.totalCompleto ? ` · ${copy.kits.total} ${precio(kit.total)}` : ""}
          </p>
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-tinta">
            {def.nombre}
          </h1>
          <p className="font-body text-sm text-tinta/75">{def.descripcion}</p>
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

        <p className="rounded-2xl border border-niebla bg-gel/25 p-4 font-body text-sm text-tinta/80">
          {copy.kits.aclaracionCompra}
        </p>
      </div>
    </Shell>
  );
}
