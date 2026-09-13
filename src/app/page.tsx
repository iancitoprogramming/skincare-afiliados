import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ComoFunciona } from "@/components/ComoFunciona";
import { PreguntasFrecuentes } from "@/components/PreguntasFrecuentes";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { configServible } from "@/engine/quiz/servible";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

// Relativas a propósito: Next las resuelve contra metadataBase, así que el día
// que se cargue el dominio propio se actualizan solas.
export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Puerta de entrada: tres caminos y nada más —quiz, catálogo y kits—. El que
// llega de una red social decide en un toque, sin buscar ni scrollear un catálogo.
export default async function Home() {
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kits = armarKits(productos, KITS, TIERS);
  const total = kits.length + KITS_UNICOS.length;
  const activos = productos.filter((p) => p.activo).length;
  // La cantidad de preguntas cambia sola: si el catálogo sólo puede servir un
  // tier, esa pregunta desaparece. Hardcodear "4 preguntas" ya nos quedó viejo
  // una vez cuando entró la rama coreana.
  const preguntas = configServible(skincareQuiz, productos).questions.length;

  return (
    <Shell>
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-[2.1rem] font-medium leading-[1.06] tracking-tight text-tinta sm:text-5xl">
            {copy.home.titulo}
          </h1>
          <p className="font-body text-base leading-relaxed text-tinta/80">{copy.home.bajada(preguntas)}</p>

          <ul className="flex flex-col gap-2">
            {copy.home.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 font-body text-sm text-tinta/80">
                <span aria-hidden className="mt-2 h-1 w-3 flex-none rounded-full bg-salvia" />
                {b}
              </li>
            ))}
          </ul>

          {/* La credibilidad del mecanismo la da contenido real, no un número.
              Este link es el respaldo de la promesa de arriba. */}
          <Link
            href="/combinaciones"
            className="self-start font-mono text-xs text-piedra underline decoration-niebla underline-offset-4 transition-colors hover:text-tinta"
          >
            {copy.home.respaldo} →
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/rutina"
            className="flex flex-col gap-1 rounded-2xl border border-terracota/40 bg-gel/25 p-5 transition-transform active:scale-[0.99]"
          >
            <span className="font-mono text-xs text-piedra">a tu medida</span>
            <span className="font-display text-2xl font-medium text-tinta">
              {copy.home.quiz.titulo}
            </span>
            <span className="font-body text-sm text-tinta/75">{copy.home.quiz.bajada(preguntas)}</span>
            <span className="mt-3 font-body text-base font-medium text-terracota">
              {copy.home.quiz.cta} →
            </span>
          </Link>
          <Link
            href="/catalogo"
            className="flex flex-col gap-1 rounded-2xl border border-niebla bg-porcelana p-5 transition-transform active:scale-[0.99]"
          >
            <span className="font-mono text-xs text-piedra">
              {activos} productos · con filtros
            </span>
            <span className="font-display text-2xl font-medium text-tinta">
              {copy.catalogo.titulo}
            </span>
            <span className="font-body text-sm text-tinta/75">{copy.catalogo.bajadaHome}</span>
            <span className="mt-3 font-body text-base font-medium text-terracota">
              {copy.catalogo.cta} →
            </span>
          </Link>

          {total > 0 ? (
            <Link
              href="/kits"
              className="flex flex-col gap-1 rounded-2xl border border-niebla bg-gel/25 p-5 transition-transform active:scale-[0.99]"
            >
              <span className="font-mono text-xs text-piedra">
                {total} kits{KITS_UNICOS.length > 0 ? " · hay de una sola compra" : ""}
              </span>
              <span className="font-display text-2xl font-medium text-tinta">
                {copy.home.kits.titulo}
              </span>
              <span className="font-body text-sm text-tinta/75">{copy.home.kits.bajada}</span>
              <span className="mt-3 font-body text-base font-medium text-terracota">
                {copy.home.kits.cta} →
              </span>
            </Link>
          ) : null}

        </div>

        {/* Debajo de las puertas y fuera del fold: no son puertas, son para el que
            bajó sin decidir. Ver 03-PRODUCTO.md § Tres puertas. */}
        <ComoFunciona preguntas={preguntas} />
        <PreguntasFrecuentes />
      </div>
    </Shell>
  );
}
