import Link from "next/link";
import { Shell } from "@/components/Shell";
import { getCatalogo } from "@/engine/catalogo";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { TIERS } from "@/niches/skincare/config";
import { KITS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

export const metadata = {
  title: `${copy.kits.titulo} · ${copy.marca}`,
  description: copy.kits.bajada,
};

export default async function Kits() {
  const productos = await getCatalogo(fallback);
  const kits = armarKits(productos, KITS, TIERS);

  return (
    <Shell volver={{ href: "/", label: "inicio" }}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-medium tracking-tight text-tinta">
            {copy.kits.titulo}
          </h1>
          <p className="font-body text-sm text-tinta/75">{copy.kits.bajada}</p>
        </header>

        <div className="flex flex-col gap-3">
          {kits.map((kit) => (
            <Link
              key={kit.def.slug}
              href={`/kits/${kit.def.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-niebla bg-gel/25 p-5 transition-transform active:scale-[0.99]"
            >
              <span className="font-mono text-xs text-agua">
                {copy.kits.pasos(kit.pasos.length)}
                {kit.totalCompleto
                  ? ` · ${copy.kits.total} $${kit.total.toLocaleString("es-AR")}`
                  : ""}
              </span>
              <span className="font-display text-xl font-medium leading-tight text-tinta">
                {kit.def.nombre}
              </span>
              <span className="font-body text-sm text-tinta/75">{kit.def.descripcion}</span>
              <span className="mt-3 font-body text-base font-medium text-vitamina">
                {copy.kits.ver} →
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/rutina"
          className="font-mono text-sm text-agua transition-colors hover:text-tinta"
        >
          ¿ninguno te cierra? armá la tuya →
        </Link>
      </div>
    </Shell>
  );
}
