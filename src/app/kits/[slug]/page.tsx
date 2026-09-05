import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { getCatalogo } from "@/engine/catalogo";
import { armarKit } from "@/engine/kits";
import { PasoRutina } from "@/engine/quiz/PasoRutina";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, TIERS } from "@/niches/skincare/config";
import { KITS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

// Cada kit es una URL propia: sirve para pinear uno por tipo de piel.
export function generateStaticParams() {
  return KITS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = KITS.find((k) => k.slug === slug);
  if (!def) return {};
  return {
    title: `${def.nombre} · ${copy.marca}`,
    description: def.descripcion,
  };
}

export default async function KitDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
            {kit.totalCompleto
              ? ` · ${copy.kits.total} $${kit.total.toLocaleString("es-AR")}`
              : ""}
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
