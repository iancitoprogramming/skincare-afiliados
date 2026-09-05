import Link from "next/link";
import { Shell } from "@/components/Shell";
import { getCatalogo } from "@/engine/catalogo";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

// Puerta de entrada: dos caminos y nada mas. El que llega de una red social
// decide en un toque, sin buscar ni scrollear un catalogo.
export default async function Home() {
  const productos = await getCatalogo(fallback);
  const kits = armarKits(productos, KITS, TIERS);
  const total = kits.length + KITS_UNICOS.length;

  return (
    <Shell>
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-tinta">
            {copy.home.titulo}
          </h1>
          <p className="font-body text-base text-tinta/80">{copy.home.bajada}</p>
        </div>

        <div className="flex flex-col gap-4">
          {total > 0 ? (
            <Link
              href="/kits"
              className="flex flex-col gap-1 rounded-2xl border border-niebla bg-gel/40 p-5 transition-transform active:scale-[0.99]"
            >
              <span className="font-mono text-xs text-agua">
                {total} kits{KITS_UNICOS.length > 0 ? " · hay de una sola compra" : ""}
              </span>
              <span className="font-display text-2xl font-medium text-tinta">
                {copy.home.kits.titulo}
              </span>
              <span className="font-body text-sm text-tinta/75">{copy.home.kits.bajada}</span>
              <span className="mt-3 font-body text-base font-medium text-vitamina">
                {copy.home.kits.cta} →
              </span>
            </Link>
          ) : null}

          <Link
            href="/rutina"
            className="flex flex-col gap-1 rounded-2xl border border-niebla bg-porcelana p-5 transition-transform active:scale-[0.99]"
          >
            <span className="font-mono text-xs text-agua">a tu medida</span>
            <span className="font-display text-2xl font-medium text-tinta">
              {copy.home.quiz.titulo}
            </span>
            <span className="font-body text-sm text-tinta/75">{copy.home.quiz.bajada}</span>
            <span className="mt-3 font-body text-base font-medium text-vitamina">
              {copy.home.quiz.cta} →
            </span>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
